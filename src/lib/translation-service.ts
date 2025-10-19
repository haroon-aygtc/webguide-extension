export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', voiceLang: 'en-US' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', voiceLang: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', voiceLang: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', voiceLang: 'de-DE' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', voiceLang: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', voiceLang: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', voiceLang: 'ko-KR' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', voiceLang: 'ar-SA' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voiceLang: 'hi-IN' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', voiceLang: 'pt-BR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', voiceLang: 'ru-RU' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', voiceLang: 'it-IT' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export class TranslationService {
  private cache: Map<string, string> = new Map();

  async translate(text: string, targetLang: LanguageCode, sourceLang: LanguageCode = 'en'): Promise<string> {
    const cacheKey = `${sourceLang}-${targetLang}-${text}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang, sourceLang }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      const translated = data.translatedText;
      
      this.cache.set(cacheKey, translated);
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async translateBatch(texts: string[], targetLang: LanguageCode, sourceLang: LanguageCode = 'en'): Promise<string[]> {
    return Promise.all(texts.map(text => this.translate(text, targetLang, sourceLang)));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getLanguageByCode(code: string) {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }
}

export const translationService = new TranslationService();
