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
        const generation = await prisma.zVideoGeneration.findUnique({
            where: { id: generationId },
        });

        // Allow if generation exists AND (it belongs to user OR it has no user)
        if (!generation) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (generation.userId && generation.userId !== session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // If status is not final, check with Z-Video API directly
        if (generation.status === 'PENDING' || generation.status === 'PROCESSING') {
            try {
                const { queryTaskStatus } = await import('@/lib/z-video/client');
                const taskData = await queryTaskStatus(generation.taskId);

                if (taskData && taskData.data) {
                    const { state, resultJson, failMsg, costTime, consumeCredits } = taskData.data;

                    // State: 0=GENERATING, 1=SUCCESS, 2=CREATE_FAILED, 3=GENERATE_FAILED
                    const isSuccess = state === 1 || state === 'success' || state === 'SUCCESS';
                    const isFailed = state === 2 || state === 3 || state === 'fail' || state === 'FAIL';

                    if (isSuccess) {
                        const result = typeof resultJson === 'string' ? JSON.parse(resultJson) : resultJson;
                        const videoUrl = result.resultUrls?.[0];

                        if (videoUrl) {
                            await prisma.zVideoGeneration.update({
                                where: { id: generationId },
                                data: {
                                    status: 'SUCCESS',
                                    resultUrl: videoUrl,
                                    costTime,
                                    consumeCredits,
                                    completedAt: new Date(),
                                },
                            });

                            // Update local variable
                            generation.status = 'SUCCESS';
                            generation.resultUrl = videoUrl;
                        }
                    } else if (isFailed) {
                        await prisma.zVideoGeneration.update({
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
                console.error('Failed to poll Z-Video status:', error);
            }
        }

        return NextResponse.json({
            status: generation.status,
            resultUrl: generation.resultUrl,
            failReason: generation.failReason,
        });
    } catch (error: any) {
        console.error('Z-Video status error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
