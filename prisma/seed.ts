import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tools = [
    // Coding
    {
        name: "GitHub Copilot",
        slug: "github-copilot",
        company: "GitHub",
        description: "Your AI pair programmer. GitHub Copilot uses the OpenAI Codex to suggest code and entire functions in real-time.",
        category: "CODING",
        pricingModel: "PAID",
        websiteUrl: "https://github.com/features/copilot",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/GitHub_Copilot_logo.svg",
        verified: true,
        featured: true,
        trending: true,
        features: ["Code completion", "Chat interface", "Multi-language support"],
    },
    {
        name: "Cursor",
        slug: "cursor",
        company: "Cursor",
        description: "The AI-first code editor. Built to make you extraordinarily productive, Cursor is the best way to code with AI.",
        category: "CODING",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://cursor.sh",
        logo: "https://images.seeklogo.com/logo-png/52/1/cursor-logo-png_seeklogo-524926.png",
        verified: true,
        featured: true,
        trending: true,
        features: ["AI-native editor", "Codebase indexing", "Privacy-focused"],
    },
    {
        name: "Replit Ghostwriter",
        slug: "replit-ghostwriter",
        company: "Replit",
        description: "An AI pair programmer that helps you write better code, faster. Integrated directly into the Replit IDE.",
        category: "CODING",
        pricingModel: "PAID",
        websiteUrl: "https://replit.com/site/ghostwriter",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Replit_Logo.png",
        verified: true,
        features: ["Context-aware suggestions", "Explain code", "Generate tests"],
    },
    {
        name: "Tabnine",
        slug: "tabnine",
        company: "Tabnine",
        description: "AI assistant for software developers. Tabnine helps you write code faster with whole-line and full-function code completions.",
        category: "CODING",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://www.tabnine.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/TabNine_logo.svg/1200px-TabNine_logo.svg.png",
        verified: true,
        features: ["Private code models", "IDE integration", "Team learning"],
    },
    // Writing
    {
        name: "Z-Image Generator",
        slug: "z-image-generator",
        company: "Tongyi-MAI (Built into Blaqhole)",
        description: "Fast, high-quality AI image generation with photorealistic output and accurate text rendering. Generate images directly within Blaqhole.",
        category: "DESIGN",
        pricingModel: "FREEMIUM",
        websiteUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/z-image`,
        logo: "https://via.placeholder.com/512x512?text=Z-Image",
        features: [
            "Photorealistic image generation",
            "Fast Turbo performance (5-10 seconds)",
            "Accurate bilingual text rendering",
            "Multiple aspect ratios",
            "Built-in generation history"
        ],
        integrations: ["Blaqhole Platform"],
        limitations: [
            "Rate limited to 10 generations per hour",
            "Costs ~$0.004 per image"
        ],
        verified: true,
        featured: true,
        trending: true,
    },
    {
        name: "ChatGPT",
        slug: "chatgpt",
        company: "OpenAI",
        description: "A conversational AI model capable of generating human-like text based on context and past conversations.",
        category: "WRITING",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://chat.openai.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
        verified: true,
        featured: true,
        trending: true,
        features: ["Conversational AI", "Content generation", "Plugin support"],
    },
    {
        name: "Claude",
        slug: "claude",
        company: "Anthropic",
        description: "A next-generation AI assistant built for work and trained to be safe, accurate, and secure.",
        category: "WRITING",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://claude.ai",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/1200px-Anthropic_logo.svg.png",
        verified: true,
        featured: true,
        trending: true,
        features: ["Large context window", "Safe AI", "Document analysis"],
    },
    {
        name: "Notion AI",
        slug: "notion-ai",
        company: "Notion",
        description: "Access the limitless power of AI, right inside Notion. Work faster. Write better. Think bigger.",
        category: "WRITING",
        pricingModel: "PAID",
        websiteUrl: "https://www.notion.so/product/ai",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
        verified: true,
        features: ["Summarization", "Translation", "Brainstorming"],
    },
    {
        name: "Jasper",
        slug: "jasper",
        company: "Jasper AI",
        description: "AI copywriter and content generator for teams. Create high-quality content faster with Jasper.",
        category: "MARKETING",
        pricingModel: "PAID",
        websiteUrl: "https://www.jasper.ai",
        logo: "https://assets-global.website-files.com/60e5f2de011b86acebc30db7/60e5f2de011b8655e3c30dd6_Jasper%20Logo%20(1).png",
        verified: true,
        features: ["Brand voice", "Marketing templates", "SEO integration"],
    },
    // Design
    {
        name: "Midjourney",
        slug: "midjourney",
        company: "Midjourney",
        description: "An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.",
        category: "DESIGN",
        pricingModel: "PAID",
        websiteUrl: "https://www.midjourney.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Midjourney_Emblem.png/900px-Midjourney_Emblem.png",
        verified: true,
        featured: true,
        trending: true,
        features: ["High-quality image generation", "Discord interface", "Artistic styles"],
    },
    {
        name: "Canva",
        slug: "canva",
        company: "Canva",
        description: "Canva is a free-to-use online graphic design tool. Use it to create social media posts, presentations, posters, videos, logos and more.",
        category: "DESIGN",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://www.canva.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
        verified: true,
        features: ["Magic Studio", "Templates", "Collaboration"],
    },
    // Video
    {
        name: "Runway",
        slug: "runway",
        company: "Runway",
        description: "Advancing creativity with artificial intelligence. Runway is a creative suite for professionals.",
        category: "VIDEO",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://runwayml.com",
        logo: "https://logowik.com/content/uploads/images/runway-ai7958.logowik.com.webp",
        verified: true,
        trending: true,
        features: ["Gen-2 Video", "Inpainting", "Motion Brush"],
    },
    {
        name: "Pika",
        slug: "pika",
        company: "Pika Labs",
        description: "An idea-to-video platform that brings your creativity to motion.",
        category: "VIDEO",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://pika.art",
        logo: "https://logowik.com/content/uploads/images/pika-ai-art-generator9746.logowik.com.webp",
        verified: true,
        features: ["Text-to-Video", "Image-to-Video", "Lip Sync"],
    },
    // Data
    {
        name: "Julius AI",
        slug: "julius-ai",
        company: "Julius",
        description: "Your personal AI data analyst. Analyze and visualize your data with natural language.",
        category: "DATA",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://julius.ai",
        logo: "https://julius.ai/favicon.ico",
        verified: true,
        trending: true,
        features: ["Data visualization", "Python code generation", "Spreadsheet analysis"],
    },
    // Agents
    {
        name: "AutoGPT",
        slug: "autogpt",
        company: "Significant Gravitas",
        description: "An experimental open-source attempt to make GPT-4 fully autonomous.",
        category: "AGENTS",
        pricingModel: "OPENSOURCE",
        websiteUrl: "https://agpt.co",
        githubUrl: "https://github.com/Significant-Gravitas/Auto-GPT",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/1200px-GitHub_Invertocat_Logo.svg.png", // Fallback
        verified: true,
        trending: true,
        features: ["Autonomous agents", "Goal-oriented", "Internet access"],
    },
    {
        name: "Perplexity",
        slug: "perplexity",
        company: "Perplexity AI",
        description: "Perplexity AI unlocks the power of knowledge with information discovery and sharing.",
        category: "AGENTS",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://www.perplexity.ai",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.jpg",
        verified: true,
        features: ["Real-time search", "Citations", "Copilot"],
    },
];

async function main() {
    console.log(`Start seeding ...`);

    // Create a default vendor user
    const vendor = await prisma.user.upsert({
        where: { email: "admin@bq.com" },
        update: {},
        create: {
            email: "admin@bq.com",
            name: "BQ Admin",
            role: "ADMIN",
        },
    });

    for (const tool of tools) {
        const result = await prisma.tool.upsert({
            where: { slug: tool.slug },
            update: {},
            create: {
                ...tool,
                vendorId: vendor.id,
                category: tool.category as any,
                pricingModel: tool.pricingModel as any,
            },
        });
        console.log(`Created tool with id: ${result.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
