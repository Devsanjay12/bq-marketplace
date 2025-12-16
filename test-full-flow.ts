const Z_IMAGE_API_KEY = process.env.Z_IMAGE_API_KEY || 'ad22359bc1ba4844e79b5895602803bc';
const Z_IMAGE_BASE_URL = 'https://api.kie.ai';

async function createTask() {
    console.log('Creating task with model: z-image...');
    const response = await fetch(`${Z_IMAGE_BASE_URL}/api/v1/jobs/createTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Z_IMAGE_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'z-image',
            input: {
                prompt: 'description: black American woman taking a late night front camera selfie on a red eye flight wrapped in a blanket while half awake with messy hair and headphones slipping off age: mid twenties expression: tired half smile eyes half closed hair_color: dark brown hair_style: curly hair loose flattened slightly from headrest top: oversized dark gray sweatshirt bottom: soft fleece joggers makeup: nearly faded makeup slight mascara warm under eye glow headwear: none earrings: small gold studs necklace: none wrist: fabric scrunchie rings: none prop: blanket wrapped around her shoulders camera_distance: arms length selfie no phone visible photo_style: amateur iphone front camera selfie camera_angle: slightly downward capturing her tucked in posture framing: close face with blanket covering edges lighting: dim cabin blue toned LED night mode light background _description: silent dark cabin rows illuminated faintly by overhead lights details: airplane window barely visible almost black items: headphones slipping off blanket seat pocket ambient_ light: cool dim blue cabin lighting lens_artifacts: heavy grain soft blur low contrast slight lens noise'.substring(0, 500),
                aspect_ratio: '1:1',
            },
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Create failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    console.log('Create response:', JSON.stringify(data, null, 2));
    return data.data.taskId;
}

async function queryStatus(taskId: string) {
    const endpoint = '/api/v1/jobs/recordInfo';
    console.log(`Querying ${endpoint}?taskId=${taskId}...`);

    const response = await fetch(
        `${Z_IMAGE_BASE_URL}${endpoint}?taskId=${taskId}`,
        {
            headers: {
                'Authorization': `Bearer ${Z_IMAGE_API_KEY}`,
            },
        }
    );

    if (response.ok) {
        const data = await response.json();
        console.log(`Success! Response:`, JSON.stringify(data, null, 2));
        return data;
    } else {
        console.log(`Failed with ${endpoint}: ${response.status}`);
        const text = await response.text();
        console.log('Error body:', text);
    }
}

async function main() {
    try {
        const taskId = await createTask();

        console.log('Waiting 15 seconds...');
        await new Promise(resolve => setTimeout(resolve, 15000));

        await queryStatus(taskId);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

main();
