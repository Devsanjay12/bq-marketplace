import { z } from 'zod';

const Z_IMAGE_API_KEY = process.env.Z_IMAGE_API_KEY;
const Z_IMAGE_BASE_URL = 'https://api.kie.ai';

// Request validation schema
export const GenerateVideoSchema = z.object({
    prompt: z.string().min(1).max(800),
    negativePrompt: z.string().max(500).optional(),
    duration: z.enum(['5', '10']).default('5'),
    aspectRatio: z.enum(['16:9', '9:16', '1:1']).default('16:9'),
    resolution: z.enum(['720p', '1080p']).default('720p'),
    enablePromptExpansion: z.boolean().default(true),
});

export type GenerateVideoInput = z.infer<typeof GenerateVideoSchema>;

// Create generation task
export async function createVideoGenerationTask(
    input: GenerateVideoInput,
    callbackUrl?: string
) {
    const response = await fetch(`${Z_IMAGE_BASE_URL}/api/v1/jobs/createTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Z_IMAGE_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'wan/2-5-text-to-video',
            callBackUrl: callbackUrl,
            input: {
                prompt: input.prompt,
                negative_prompt: input.negativePrompt,
                duration: input.duration,
                aspect_ratio: input.aspectRatio,
                resolution: input.resolution,
                enable_prompt_expansion: input.enablePromptExpansion,
            },
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Z-Video API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    console.log('Z-Video API Response:', JSON.stringify(data, null, 2));

    if (data.code !== 200) {
        throw new Error(data.msg || `Z-Video API error: ${data.code}`);
    }

    if (!data.data) {
        throw new Error(`Z-Video API error: Missing data in response. Full response: ${JSON.stringify(data)}`);
    }

    return data.data.taskId;
}

// Query task status (using the same endpoint as Z-Image)
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
        throw new Error(`Z-Video API error: ${response.statusText}`);
    }

    return response.json();
}
