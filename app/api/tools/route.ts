import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const toolSchema = z.object({
    name: z.string().min(1),
    company: z.string().min(1),
    description: z.string().min(10),
    category: z.enum(["CODING", "WRITING", "DESIGN", "DATA", "MARKETING", "BUSINESS", "AUDIO", "VIDEO", "AGENTS", "PRODUCTIVITY", "EDUCATION", "OTHER"]),
    pricingModel: z.enum(["FREE", "FREEMIUM", "PAID", "OPENSOURCE"]),
    websiteUrl: z.string().url(),
    logo: z.string().url(),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const json = await req.json();
        const body = toolSchema.parse(json);

        // Create slug from name
        const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        // Check if slug exists
        const existing = await prisma.tool.findUnique({ where: { slug } });
        if (existing) {
            return new NextResponse("Tool with this name already exists", { status: 409 });
        }

        const tool = await prisma.tool.create({
            data: {
                ...body,
                slug,
                vendorId: session.user.id,
            },
        });

        return NextResponse.json(tool);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
