export interface Tool {
    id: string;
    name: string;
    slug: string;
    company: string;
    description: string;
    shortDescription?: string | null;
    category: string;
    pricingModel: "FREE" | "FREEMIUM" | "PAID" | "OPENSOURCE";
    pricingDetails?: any;
    internalUrl?: string;
    websiteUrl: string;
    githubUrl?: string | null;
    logo: string;
    screenshots?: any;
    demoVideo?: string | null;
    features?: any;
    integrations?: any;
    limitations?: any;
    roi?: {
        estimated_hours_saved: number;
        cost_per_month: number;
        break_even_weeks: number;
    } | null;
    compatibility?: {
        works_with: string[];
        conflicts_with: string[];
    } | null;
    verified: boolean;
    featured: boolean;
    trending: boolean;
    views: number;
    clicks: number;
    createdAt?: Date;
    updatedAt?: Date;
    freshness?: "new" | "trending" | null;
    keyStrength?: string;
    limitation?: string;
    metadata?: any;
    learning?: any;
    source?: string;
}

export interface ToolGroup {
    free: Tool[];
    freemium: Tool[];
    paid: Tool[];
    openSource: Tool[];
}

export interface ResearchResults {
    tools: ToolGroup;
    summary: string;
    recommendation: string;
    suggested_followups?: string[];
}

export interface Message {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    toolData?: ResearchResults;
    timestamp: number;
}

export interface Conversation {
    id: string;
    messages: Message[];
    title: string;
    createdAt: number;
    updatedAt: number;
}

export interface UserIntent {
    category: string;
    budget: "free_only" | "paid_ok" | "no_preference";
    skillLevel: string;
    urgency: string;
    requirements: string[];
}

export interface ResearchResult {
    title: string;
    url: string;
    content: string;
    source: "google" | "github" | "reddit" | "producthunt";
}
