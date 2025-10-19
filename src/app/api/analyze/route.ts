import { NextRequest, NextResponse } from 'next/server';
import { createAIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'Missing HTML content' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
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
