import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
    try {
        // Check authentication (optional)
        const session = await getServerSession(authOptions);

        const { searchParams } = new URL(req.url);
        const generationId = searchParams.get('id');

        if (!generationId) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        // Fetch generation status
        const generation = await prisma.zImageGeneration.findUnique({
            where: { id: generationId },
        });

        // Allow if generation exists AND (it belongs to user OR it has no user)
        if (!generation) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (generation.userId && generation.userId !== session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // If status is not final, check with Z-Image API directly (since callbacks don't work on localhost)
        if (generation.status === 'PENDING' || generation.status === 'PROCESSING') {
            try {
                const { queryTaskStatus } = await import('@/lib/z-image/client');
                const taskData = await queryTaskStatus(generation.taskId);

                if (taskData && taskData.data) {
                    const { state, resultJson, failMsg, costTime } = taskData.data;

                    // State: 0=GENERATING, 1=SUCCESS, 2=CREATE_FAILED, 3=GENERATE_FAILED
                    // The API returns state as a string "success" or number in some cases, handling both
                    const isSuccess = state === 1 || state === 'success' || state === 'SUCCESS';
                    const isFailed = state === 2 || state === 3 || state === 'fail' || state === 'FAIL';

                    if (isSuccess) {
                        const result = typeof resultJson === 'string' ? JSON.parse(resultJson) : resultJson;
                        const imageUrl = result.resultUrls?.[0];

                        if (imageUrl) {
                            await prisma.zImageGeneration.update({
                                where: { id: generationId },
                                data: {
                                    status: 'SUCCESS',
                                    resultUrl: imageUrl,
                                    costTime,
                                    completedAt: new Date(),
                                },
                            });

                            // Update local variable to return fresh data
                            generation.status = 'SUCCESS';
                            generation.resultUrl = imageUrl;
                        }
                    } else if (isFailed) {
                        await prisma.zImageGeneration.update({
                            where: { id: generationId },
                            data: {
                                status: 'FAILED',
                                failReason: failMsg || 'Generation failed',
                                completedAt: new Date(),
                            },
                        });

                        generation.status = 'FAILED';
                        generation.failReason = failMsg || 'Generation failed';
                    }
                }
            } catch (error) {
                console.error('Failed to poll Z-Image status:', error);
                // Continue returning the current DB status if polling fails
            }
        }

        return NextResponse.json({
            status: generation.status,
            resultUrl: generation.resultUrl,
            failReason: generation.failReason,
        });
    } catch (error: any) {
        console.error('Z-Image status error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
