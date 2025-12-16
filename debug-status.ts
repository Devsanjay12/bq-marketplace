const Z_IMAGE_API_KEY = process.env.Z_IMAGE_API_KEY || 'ad22359bc1ba4844e79b5895602803bc';
const Z_IMAGE_BASE_URL = 'https://api.kie.ai';
const taskId = '9c1feafb501d063d3b69794003e3a321';

async function queryTaskStatus(taskId: string) {
    const response = await fetch(
        `${Z_IMAGE_BASE_URL}/api/v1/jobs/queryTask?taskId=${taskId}`,
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

async function main() {
    try {
        console.log('Querying status for task:', taskId);
        const result = await queryTaskStatus(taskId);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
