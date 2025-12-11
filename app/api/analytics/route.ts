import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const analyticsSchema = z.object({
    toolId: z.string(),
    type: z.enum(["view", "click"]),
});

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const body = analyticsSchema.parse(json);

        // Update tool counters
        if (body.type === "view") {
            await prisma.tool.update({
                where: { id: body.toolId },
                data: { views: { increment: 1 } }
            });
        } else if (body.type === "click") {
            await prisma.tool.update({
                where: { id: body.toolId },
                data: { clicks: { increment: 1 } }
            });
        }

        // Record daily analytics (simplified)
        // In a real app, you'd upsert into Analytics model based on date

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
