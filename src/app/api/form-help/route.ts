import { NextRequest, NextResponse } from 'next/server';
import { createAIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { fieldName, fieldType, context } = await request.json();

    if (!fieldName || !fieldType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
    const helpText = await aiService.generateFormHelp(fieldName, fieldType, context || '');

    return NextResponse.json({ helpText });
  } catch (error) {
    console.error('Form help API error:', error);
    return NextResponse.json(
      { error: 'Help generation failed' },
      { status: 500 }
    );
  }
}
