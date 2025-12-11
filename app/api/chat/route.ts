import { Groq } from "groq-sdk";
import { researchTools } from "@/lib/research";
import { INTENT_PARSER_PROMPT, SYNTHESIS_PROMPT } from "@/lib/ai/prompts";
import { groq as groqClient } from "@/lib/ai/groq";
import { prisma } from "@/lib/db/prisma";



export const runtime = 'nodejs';
export const maxDuration = 60; // Allow 60 seconds for research + generation


export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1].content;

        // 1. Parse intent
        const intentCompletion = await groqClient.chat.completions.create({
            messages: [
                { role: "system", content: INTENT_PARSER_PROMPT },
                { role: "user", content: lastMessage },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" },
        });

        const intentJson = intentCompletion.choices[0]?.message?.content;
        const intent = intentJson ? JSON.parse(intentJson) : { category: "general" };

        console.log("Parsed Intent:", intent);

        // 2. Research tools (parallel)
        // Use the category and requirements to refine the search query
        const searchQuery = `${intent.category} ai tools pricing cost features ${intent.requirements?.join(" ") || ""} ${intent.stack?.join(" ") || ""} ${lastMessage}`;

        // Execute parallel search (External + Internal DB)
        // Normalize category to uppercase for Prisma Enum
        const normalizedCategory = intent.category?.toUpperCase();
        const categoryEnum = ["CODING", "WRITING", "DESIGN", "DATA", "MARKETING", "BUSINESS", "AUDIO", "VIDEO", "AGENTS", "PRODUCTIVITY", "EDUCATION", "OTHER"];
        const isValidCategory = categoryEnum.includes(normalizedCategory);

        // Extract keywords from message (simple split, filter short words)
        const keywords = lastMessage.split(/\s+/).filter((w: string) => w.length > 3 && !["find", "some", "tools", "show", "give", "list"].includes(w.toLowerCase()));

        const [rawResearchResults, localTools] = await Promise.all([
            researchTools(searchQuery),
            prisma.tool.findMany({
                where: {
                    OR: [
                        // Category match (if valid)
                        ...(isValidCategory ? [{ category: { equals: normalizedCategory as any } }] : []),
                        // Name/Description match on category string
                        { name: { contains: intent.category, mode: "insensitive" } },
                        { description: { contains: intent.category, mode: "insensitive" } },
                        // Keyword matches
                        ...keywords.map((k: string) => ({ name: { contains: k, mode: "insensitive" } })),
                        ...keywords.map((k: string) => ({ description: { contains: k, mode: "insensitive" } }))
                    ],
                },
                take: 5,
            }).catch(() => []) // Fail gracefully if DB error
        ]);

        // Inject Real-Time Timestamp & Local Data
        const researchResults = {
            timestamp: new Date().toISOString(),
            external_data: rawResearchResults,
            internal_marketplace_data: localTools.map((t: any) => ({
                name: t.name,
                description: t.description,
                pricing: t.pricingModel,
                features: t.features,
                internalUrl: `/tool/${t.id}`, // Explicit internal URL
                websiteUrl: t.websiteUrl
            }))
        };

        // 3. Synthesize response with Groq (streaming)
        const stream = await groqClient.chat.completions.create({
            messages: [
                { role: "system", content: SYNTHESIS_PROMPT },
                { role: "user", content: `User Context: ${JSON.stringify(intent)}\n\nUser Query: ${lastMessage}\n\nResearch Results: ${JSON.stringify(researchResults)}` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            stream: true,
            response_format: { type: "json_object" },
        });

        // Convert Groq stream to web stream
        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                }
                controller.close();
            },
        });

        return new Response(readableStream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });

    } catch (error) {
        console.error("Chat API error:", error);
        return new Response("Error processing request", { status: 500 });
    }
}
