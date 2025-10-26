import { NextRequest, NextResponse } from 'next/server';
import { createAIService } from '@/lib/ai-service';
import { getAIKey } from '@/lib/ai-config';
import { getApiKeyFromRequest, validateServiceApiKey } from '@/lib/auth';
import { allowRequest } from '@/lib/rateLimiter';
import { incr } from '@/lib/metrics';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'Missing HTML content' },
        { status: 400 }
      );
    }

    // Authenticate client using a service API key header
    const headerKey = request.headers.get('x-api-key');
    if (!validateServiceApiKey(headerKey)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting per API key
    const limiterKey = headerKey || 'unknown';
    if (!allowRequest(limiterKey)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    incr('requests_analyze');

    let apiKey: string;
    try {
      apiKey = getAIKey();
    } catch (e: any) {
      logger.error('AI key missing: %s', e?.message ?? e);
      return NextResponse.json({ error: e?.message ?? 'AI service not configured' }, { status: 500 });
    }

    const aiService = createAIService(apiKey);
    const analysis = await aiService.analyzePageStructure(html);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Page analysis API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
