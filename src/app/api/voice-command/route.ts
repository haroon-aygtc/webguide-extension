import { NextRequest, NextResponse } from 'next/server';
import { createAIService } from '@/lib/ai-service';
import { getAIKey } from '@/lib/ai-config';
import { getApiKeyFromRequest, validateServiceApiKey } from '@/lib/auth';
import { allowRequest } from '@/lib/rateLimiter';
import { incr } from '@/lib/metrics';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { command, pageContext } = await request.json();

    if (!command) {
      return NextResponse.json(
        { error: 'Missing voice command' },
        { status: 400 }
      );
    }

    const headerKey = request.headers.get('x-api-key');
    if (!validateServiceApiKey(headerKey)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limiterKey = headerKey || 'unknown';
    if (!allowRequest(limiterKey)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    incr('requests_voice');

    let apiKey: string;
    try {
      apiKey = getAIKey();
    } catch (e: any) {
      logger.error('AI key missing: %s', e?.message ?? e);
      return NextResponse.json({ error: e?.message ?? 'AI service not configured' }, { status: 500 });
    }

    const aiService = createAIService(apiKey);
    const result = await aiService.processVoiceCommand(command, pageContext || '');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Voice command API error:', error);
    return NextResponse.json(
      { error: 'Command processing failed' },
      { status: 500 }
    );
  }
}
