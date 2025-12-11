import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const reviewSchema = z.object({
    toolId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const json = await req.json();
        const body = reviewSchema.parse(json);

        // Check if user already reviewed this tool
        const existing = await prisma.review.findFirst({
            where: {
                userId: session.user.id,
                toolId: body.toolId,
            }
        });

        if (existing) {
            return new NextResponse("You have already reviewed this tool", { status: 409 });
        }

        const review = await prisma.review.create({
            data: {
                ...body,
                userId: session.user.id,
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 });
        }
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
