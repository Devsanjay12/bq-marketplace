import { Conversation, Message } from "@/types";

const STORAGE_KEY = "bq-conversations";

export const getConversations = (): Conversation[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const saveConversation = (conversation: Conversation) => {
    if (typeof window === "undefined") return;
    const conversations = getConversations();
    const index = conversations.findIndex((c) => c.id === conversation.id);

    if (index >= 0) {
        conversations[index] = conversation;
    } else {
        conversations.unshift(conversation);
    }

    // Limit to 50 messages per conversation to save space
    if (conversation.messages.length > 50) {
        conversation.messages = conversation.messages.slice(-50);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
};

export const deleteConversation = (id: string) => {
    if (typeof window === "undefined") return;
    const conversations = getConversations().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
};

export const clearAllConversations = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
};

export const createConversation = (initialMessage?: Message): Conversation => {
    const conversation: Conversation = {
        id: crypto.randomUUID(),
        messages: initialMessage ? [initialMessage] : [],
        title: "New Chat",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    return conversation;
};
