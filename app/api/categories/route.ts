import { NextResponse } from "next/server";

const CATEGORIES = [
    "CODING",
    "WRITING",
    "DESIGN",
    "DATA",
    "MARKETING",
    "BUSINESS",
    "AUDIO",
    "VIDEO",
    "AGENTS",
    "PRODUCTIVITY",
    "EDUCATION",
    "OTHER"
];

export async function GET() {
    return NextResponse.json(CATEGORIES);
}
