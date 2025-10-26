export function validateServiceApiKey(headerKey: string | null): boolean {
    const expected = process.env.SERVICE_API_KEY || null;
    if (!expected) return false; // no service key configured
    if (!headerKey) return false;
    return headerKey === expected;
}

export function getApiKeyFromRequest(request: Request): string | null {
    // Looking for header `x-api-key`
    // NextRequest has .headers accessible in route handlers; adapt callers accordingly
    // Here we accept either Node Request or NextRequest-like headers
    try {
        // @ts-ignore
        const h = request.headers?.get?.('x-api-key');
        return h ?? null;
    } catch (e) {
        return null;
    }
}
