import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tools = [
    // Coding
    {
        name: "GitHub Copilot",
        slug: "github-copilot",
        company: "GitHub",
        description: "Your AI pair programmer. GitHub Copilot uses the OpenAI Codex to suggest code and entire functions in real-time, right from your editor.",
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
        logo: "https://cursor.sh/brand/icon.svg",
        verified: true,
        featured: true,
        trending: true,
        features: ["AI-native editor", "Codebase indexing", "Privacy-focused"],
        roi: {
            estimated_hours_saved: 10,
            cost_per_month: 20,
            break_even_weeks: 1
        },
        compatibility: {
            works_with: ["VS Code Extensions", "Git", "Terminal"],
            conflicts_with: ["Some VS Code keybindings"]
        }
    },
    {
        name: "Tabnine",
        slug: "tabnine",
        company: "Tabnine",
        description: "AI assistant for software developers. Tabnine helps you write code faster with whole-line and full-function code completions.",
        category: "CODING",
        pricingModel: "FREEMIUM",
        websiteUrl: "https://www.tabnine.com",
        logo: "https://www.tabnine.com/favicon.ico",
        verified: true,
        features: ["Private code models", "IDE integration", "Team learning"],
    },
    // Writing
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
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png",
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
        logo: "https://github.com/Significant-Gravitas/Auto-GPT/raw/master/docs/content/imgs/autogpt-logo.png",
        verified: true,
        trending: true,
        features: ["Autonomous agents", "Goal-oriented", "Internet access"],
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
