import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import logger from './logger';
import { incr } from './metrics';

export class AIService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async analyzePageStructure(html: string): Promise<{
    elements: Array<{
      type: string;
      selector: string;
      purpose: string;
      helpText: string;
    }>;
    formFields: Array<{
      name: string;
      type: string;
      required: boolean;
      validation: string;
      helpText: string;
    }>;
  }> {
    if (!this.genAI) {
      throw new Error('AI service not initialized');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this HTML and identify all interactive elements, forms, and their purposes. Return JSON with elements and formFields arrays.

HTML:
${html.substring(0, 5000)}

Return format:
{
  "elements": [{"type": "button", "selector": "#submit", "purpose": "Submit form", "helpText": "Click to submit"}],
  "formFields": [{"name": "email", "type": "email", "required": true, "validation": "Valid email required", "helpText": "Enter your email address"}]
}`;

    incr('ai_calls');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const schema = z.object({
      elements: z.array(z.object({
        type: z.string(),
        selector: z.string(),
        purpose: z.string(),
        helpText: z.string(),
      })),
      formFields: z.array(z.object({
        name: z.string(),
        type: z.string(),
        required: z.boolean(),
        validation: z.string(),
        helpText: z.string(),
      })),
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const validated = schema.parse(parsed);
        return validated;
      }
      logger.warn('analyzePageStructure: no JSON found in AI response');
    } catch (e: any) {
      logger.error({ err: e }, 'Failed to parse/validate AI response');
    }

    return { elements: [], formFields: [] };
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('AI service not initialized');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Translate the following text to ${targetLanguage}. Return only the translation, no explanations:

${text}`;

    incr('ai_calls');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }

  async processVoiceCommand(command: string, pageContext: string): Promise<{
    action: string;
    target?: string;
    response: string;
  }> {
    if (!this.genAI) {
      throw new Error('AI service not initialized');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `User voice command: "${command}"
Page context: ${pageContext.substring(0, 1000)}

Determine the action to take. Return JSON:
{
  "action": "click|fill|navigate|explain|read",
  "target": "selector or element description",
  "response": "Natural language response to user"
}`;

    incr('ai_calls');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const schema = z.object({
      action: z.string(),
      target: z.string().optional(),
      response: z.string(),
    });

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const validated = schema.parse(parsed);
        return validated;
      }
      logger.warn('processVoiceCommand: no JSON found in AI response');
    } catch (e: any) {
      logger.error({ err: e }, 'Failed to parse/validate AI response');
    }

    return {
      action: 'explain',
      response: 'I can help you navigate this page. Try asking me to fill a form or click a button.'
    };
  }

  async generateFormHelp(fieldName: string, fieldType: string, context: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('AI service not initialized');
    }

    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate helpful guidance for a form field:
Field name: ${fieldName}
Field type: ${fieldType}
Context: ${context}

Provide a brief, helpful explanation (1-2 sentences) about what to enter.`;

    incr('ai_calls');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }
}

export const createAIService = (apiKey?: string) => new AIService(apiKey);
