import { describe, it, expect } from 'vitest';
import { tryGetAIKey, getAIKey } from '@/lib/ai-config';

describe('ai-config', () => {
    const OLD = process.env.GOOGLE_AI_API_KEY;

    it('tryGetAIKey returns null when not set', () => {
        process.env.GOOGLE_AI_API_KEY = '';
        expect(tryGetAIKey()).toBeNull();
    });

    it('getAIKey throws when not set', () => {
        process.env.GOOGLE_AI_API_KEY = '';
        expect(() => getAIKey()).toThrow();
    });

    it('getAIKey returns value when set', () => {
        process.env.GOOGLE_AI_API_KEY = 'abc';
        expect(getAIKey()).toBe('abc');
    });

    process.env.GOOGLE_AI_API_KEY = OLD;
});
