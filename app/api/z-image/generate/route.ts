import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { createGenerationTask, GenerateImageSchema } from '@/lib/z-image/client';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        // Check authentication (optional)
        const session = await getServerSession(authOptions);

        // Rate limiting: 10 generations per user/IP per hour
        const identifier = session?.user?.id || req.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimitResult = await rateLimit(identifier, 10, '1h');

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Try again later.' },
                { status: 429 }
            );
        }

        // Parse and validate request
        const body = await req.json();
        const validatedInput = GenerateImageSchema.parse(body);

        // Construct callback URL
        const baseUrl = process.env.NEXTAUTH_URL || req.nextUrl.origin;
        const callbackUrl = `${baseUrl}/api/z-image/callback`;

        // Create generation task
        const taskId = await createGenerationTask(validatedInput, callbackUrl);

        // Save to database
        const generation = await prisma.zImageGeneration.create({
            data: {
                userId: session?.user?.id, // Optional
                taskId,
                prompt: validatedInput.prompt,
                aspectRatio: validatedInput.aspectRatio,
                status: 'PENDING',
            },
        });

        return NextResponse.json({
            success: true,
            generationId: generation.id,
            taskId,
        });
    } catch (error: any) {
        console.error('Z-Image generation error details:', {
            message: error.message,
            stack: error.stack,
            apiKeyPresent: !!process.env.Z_IMAGE_API_KEY,
            env: process.env.NODE_ENV
        });
        return NextResponse.json(
            {
                error: error.message || 'Failed to create generation',
                debug: {
                    apiKeyPresent: !!process.env.Z_IMAGE_API_KEY,
                    env: process.env.NODE_ENV
                }
            },
            { status: 500 }
        );
    }
}
