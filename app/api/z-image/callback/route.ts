import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { code, data } = body;
        const { taskId, state, resultJson, failMsg, consumeCredits, costTime } = data;

        // Find generation in database
        const generation = await prisma.zImageGeneration.findUnique({
            where: { taskId },
        });

        if (!generation) {
            console.error(`Generation not found for taskId: ${taskId}`);
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Update based on state
        if (state === 'success') {
            const result = JSON.parse(resultJson);
            const imageUrl = result.resultUrls[0];

            await prisma.zImageGeneration.update({
                where: { taskId },
                data: {
                    status: 'SUCCESS',
                    resultUrl: imageUrl,
                    consumeCredits,
                    costTime,
                    completedAt: new Date(),
                },
            });
        } else if (state === 'fail') {
            await prisma.zImageGeneration.update({
                where: { taskId },
                data: {
                    status: 'FAILED',
                    failReason: failMsg,
                    completedAt: new Date(),
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Z-Image callback error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
