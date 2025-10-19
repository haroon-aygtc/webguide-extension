"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pageAnalyzer } from '@/lib/page-analyzer';
import { voiceService } from '@/lib/voice-service';
import { translationService, LanguageCode } from '@/lib/translation-service';

interface AssistantContextType {
  isActive: boolean;
  currentLanguage: LanguageCode;
  isListening: boolean;
  isSpeaking: boolean;
  highlightedElement: Element | null;
  toggleAssistant: () => void;
  setLanguage: (lang: LanguageCode) => void;
  startVoiceCommand: () => void;
  stopVoiceCommand: () => void;
  speakText: (text: string) => Promise<void>;
  highlightElement: (element: Element | null) => void;
  analyzeCurrentPage: () => Promise<void>;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('assistantLanguage') as LanguageCode;
      if (savedLang) {
        setCurrentLanguage(savedLang);
      }
    }
  }, []);

  const toggleAssistant = () => {
    setIsActive(prev => !prev);
  };

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    voiceService.setLanguage(translationService.getLanguageByCode(lang)?.voiceLang || 'en-US');
    if (typeof window !== 'undefined') {
      localStorage.setItem('assistantLanguage', lang);
    }
  };

  const startVoiceCommand = async () => {
    setIsListening(true);
    
    await voiceService.startListening(
      async (transcript) => {
        setIsListening(false);
        
        const pageContext = pageAnalyzer.getPageText();
        
        try {
          const response = await fetch('/api/voice-command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: transcript, pageContext }),
          });
          
          const result = await response.json();
          
          if (result.response) {
            await speakText(result.response);
          }
          
          if (result.action && result.target) {
            executeAction(result.action, result.target);
          }
        } catch (error) {
          console.error('Voice command error:', error);
        }
      },
      (error) => {
        console.error('Voice recognition error:', error);
        setIsListening(false);
      }
    );
  };

  const stopVoiceCommand = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const speakText = async (text: string) => {
    setIsSpeaking(true);
    try {
      const lang = translationService.getLanguageByCode(currentLanguage);
      await voiceService.speak(text, lang?.voiceLang || 'en-US');
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const highlightElement = (element: Element | null) => {
    setHighlightedElement(element);
  };

  const analyzeCurrentPage = async () => {
    try {
      const html = pageAnalyzer.getPageHTML();
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });
      
      const analysis = await response.json();
      return analysis;
    } catch (error) {
      console.error('Page analysis error:', error);
    }
  };

  const executeAction = (action: string, target: string) => {
    const elements = document.querySelectorAll(target);
    if (elements.length > 0) {
      const element = elements[0] as HTMLElement;
      
      switch (action) {
        case 'click':
          element.click();
          break;
        case 'fill':
          if (element instanceof HTMLInputElement) {
            element.focus();
          }
          break;
        case 'navigate':
          if (element instanceof HTMLAnchorElement) {
            element.click();
          }
          break;
      }
      
      highlightElement(element);
    }
  };

  return (
    <AssistantContext.Provider
      value={{
        isActive,
        currentLanguage,
        isListening,
        isSpeaking,
        highlightedElement,
        toggleAssistant,
        setLanguage,
        startVoiceCommand,
        stopVoiceCommand,
        speakText,
        highlightElement,
        analyzeCurrentPage,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return context;
}
