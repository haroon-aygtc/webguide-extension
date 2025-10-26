import { describe, it, expect, beforeEach } from 'vitest';
import { validateServiceApiKey } from '@/lib/auth';

describe('auth helper', () => {
    const OLD = process.env.SERVICE_API_KEY;

    beforeEach(() => {
        process.env.SERVICE_API_KEY = 'secret123';
    });

    it('returns true for matching key', () => {
        expect(validateServiceApiKey('secret123')).toBe(true);
    });

    it('returns false for missing key', () => {
        expect(validateServiceApiKey(null)).toBe(false);
        expect(validateServiceApiKey('wrong')).toBe(false);
    });

    afterEach(() => {
        process.env.SERVICE_API_KEY = OLD;
    });
});
