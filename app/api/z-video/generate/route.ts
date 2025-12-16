import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { createVideoGenerationTask, GenerateVideoSchema } from '@/lib/z-video/client';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        // Check authentication (optional)
        const session = await getServerSession(authOptions);

        // Rate limiting: 5 generations per user/IP per hour (stricter for video)
        const identifier = session?.user?.id || req.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimitResult = await rateLimit(identifier, 5, 3600000); // 1 hour in ms

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await req.json();

        // Validate input
        const validationResult = GenerateVideoSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.format() },
                { status: 400 }
            );
        }

        const validatedInput = validationResult.data;

        // Create task in Z-Image/Video API
        const taskId = await createVideoGenerationTask(validatedInput);

        // Save to database
        const generation = await prisma.zVideoGeneration.create({
            data: {
                userId: session?.user?.id, // Optional
                taskId,
                prompt: validatedInput.prompt,
                negativePrompt: validatedInput.negativePrompt,
                duration: validatedInput.duration,
                aspectRatio: validatedInput.aspectRatio,
                resolution: validatedInput.resolution,
                promptExpansion: validatedInput.enablePromptExpansion,
                status: 'PENDING',
            },
        });

        return NextResponse.json({ generationId: generation.id, taskId });
    } catch (error: any) {
        console.error('Z-Video generation error:', error);
        return NextResponse.json(
            {
                error: error.message || 'Failed to start generation',
                debug: {
                    apiKeyPresent: !!process.env.Z_IMAGE_API_KEY,
                    env: process.env.NODE_ENV
                }
            },
            { status: 500 }
        );
    }
}
