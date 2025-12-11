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
    logo: z.string().url().optional(),
});

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const tool = await prisma.tool.findUnique({
            where: { id: params.id },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!tool) {
            return new NextResponse("Tool not found", { status: 404 });
        }

        return NextResponse.json(tool);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const json = await req.json();
        const body = toolSchema.parse(json);

        const tool = await prisma.tool.findUnique({
            where: { id: params.id },
        });

        if (!tool) {
            return new NextResponse("Tool not found", { status: 404 });
        }

        if (tool.vendorId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const updatedTool = await prisma.tool.update({
            where: { id: params.id },
            data: body,
        });

        return NextResponse.json(updatedTool);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const tool = await prisma.tool.findUnique({
            where: { id: params.id },
        });

        if (!tool) {
            return new NextResponse("Tool not found", { status: 404 });
        }

        if (tool.vendorId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await prisma.tool.delete({
            where: { id: params.id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
