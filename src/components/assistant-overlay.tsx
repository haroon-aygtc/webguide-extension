"use client";

import { useEffect, useState } from 'react';
import { useAssistant } from '@/contexts/assistant-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, X, Languages, Eye } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/lib/translation-service';

export default function AssistantOverlay() {
  const {
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
  } = useAssistant();

  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  if (!isActive) {
    return (
      <Button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      <Card
        className="fixed z-50 w-80 border-2 shadow-2xl"
        style={{ left: position.x, top: position.y }}
      >
        <div
          className="flex cursor-move items-center justify-between border-b bg-primary p-3 text-primary-foreground"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">AI Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={toggleAssistant}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Languages className="h-4 w-4" />
              Language
            </label>
            <Select value={currentLanguage} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Mic className="h-4 w-4" />
              Voice Commands
            </label>
            <div className="flex gap-2">
              <Button
                variant={isListening ? 'destructive' : 'default'}
                className="flex-1"
                onClick={isListening ? stopVoiceCommand : startVoiceCommand}
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Listen
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => speakText('How can I help you navigate this page?')}
                disabled={isSpeaking}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {isListening && (
            <div className="animate-pulse rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-sm font-medium">🎤 Listening...</p>
            </div>
          )}

          <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">Try saying:</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">Fill email</Badge>
              <Badge variant="secondary" className="text-xs">Click submit</Badge>
              <Badge variant="secondary" className="text-xs">Read page</Badge>
              <Badge variant="secondary" className="text-xs">Help me</Badge>
            </div>
          </div>
        </div>
      </Card>

      {highlightedElement && (
        <div
          className="pointer-events-none fixed z-40 animate-pulse border-4 border-primary bg-primary/10"
          style={{
            left: highlightedElement.getBoundingClientRect().left - 4,
            top: highlightedElement.getBoundingClientRect().top - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
          }}
        />
      )}
    </>
  );
}
