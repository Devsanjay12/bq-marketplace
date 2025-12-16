import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // For guest users, we might want to return empty or handle via local storage on client
        // But for now, let's assume we only show history for logged-in users or return empty
        if (!session?.user?.id) {
            return NextResponse.json({ items: [] });
        }

        const userId = session.user.id;

        // Fetch images
        const images = await prisma.zImageGeneration.findMany({
            where: {
                userId,
                status: 'SUCCESS',
                resultUrl: { not: null }
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        // Fetch videos
        const videos = await prisma.zVideoGeneration.findMany({
            where: {
                userId,
                status: 'SUCCESS',
                resultUrl: { not: null }
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        // Normalize and combine
        const galleryItems = [
            ...images.map(img => ({
                id: img.id,
                type: 'image',
                url: img.resultUrl,
                prompt: img.prompt,
                createdAt: img.createdAt,
                aspectRatio: img.aspectRatio,
            })),
            ...videos.map(vid => ({
                id: vid.id,
                type: 'video',
                url: vid.resultUrl,
                prompt: vid.prompt,
                createdAt: vid.createdAt,
                aspectRatio: vid.aspectRatio,
                duration: vid.duration,
            }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ items: galleryItems });
    } catch (error) {
        console.error('Gallery fetch error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
