export function getAIKey(): string {
    const key = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    if (!key) {
        throw new Error('AI service not configured');
    }
    return key;
}

export function tryGetAIKey(): string | null {
    return process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || null;
}
