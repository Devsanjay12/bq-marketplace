import { z } from 'zod';

const Z_IMAGE_API_KEY = process.env.Z_IMAGE_API_KEY;
const Z_IMAGE_BASE_URL = 'https://api.kie.ai';

// Request validation schema
export const GenerateImageSchema = z.object({
    prompt: z.string().min(1).max(1000),
    aspectRatio: z.enum(['1:1', '4:3', '3:4', '16:9', '9:16']),
});

export type GenerateImageInput = z.infer<typeof GenerateImageSchema>;

// Create generation task
export async function createGenerationTask(
    input: GenerateImageInput,
    callbackUrl?: string
) {
    const response = await fetch(`${Z_IMAGE_BASE_URL}/api/v1/jobs/createTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Z_IMAGE_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'z-image',
            callBackUrl: callbackUrl,
            input: {
                prompt: input.prompt,
                aspect_ratio: input.aspectRatio,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Z-Image API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.taskId;
}

// Query task status (for polling)
export async function queryTaskStatus(taskId: string) {
    const response = await fetch(
        `${Z_IMAGE_BASE_URL}/api/v1/jobs/recordInfo?taskId=${taskId}`,
        {
            headers: {
                'Authorization': `Bearer ${Z_IMAGE_API_KEY}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Z-Image API error: ${response.statusText}`);
    }

    return response.json();
}
