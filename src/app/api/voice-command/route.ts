import { NextRequest, NextResponse } from 'next/server';
import { createAIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { command, pageContext } = await request.json();

    if (!command) {
      return NextResponse.json(
        { error: 'Missing voice command' },
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
