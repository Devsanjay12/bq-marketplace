import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const generations = await prisma.zImageGeneration.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json({ generations });
    } catch (error: any) {
        console.error('Z-Image history error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
