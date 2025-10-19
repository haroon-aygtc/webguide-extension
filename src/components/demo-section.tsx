"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Info } from "lucide-react";

export default function DemoSection() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showTooltip, setShowTooltip] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "ar", name: "العربية" },
    { code: "hi", name: "हिन्दी" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
  ];

  return (
    <section className="bg-secondary/30 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            See It In Action
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience how our AI assistant makes web navigation effortless
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="visual">Visual Guide</TabsTrigger>
              <TabsTrigger value="language">Languages</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="form">Form Help</TabsTrigger>
            </TabsList>

            {/* Visual Guidance Demo */}
            <TabsContent value="visual" className="mt-6">
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 dark:from-blue-950/20 dark:to-cyan-950/20">
                  <div className="relative mx-auto max-w-2xl">
                    <div className="rounded-lg border-2 border-dashed border-primary/50 bg-background p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Sample Form</h3>
                        <Badge variant="secondary" className="animate-pulse">
                          <Sparkles className="mr-1 h-3 w-3" />
                          AI Active
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="relative">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Input 
                              id="email" 
                              placeholder="Enter your email"
                              className="border-2 border-primary/50 shadow-lg shadow-primary/20"
                              onFocus={() => setShowTooltip(true)}
                              onBlur={() => setShowTooltip(false)}
                            />
                            {showTooltip && (
                              <div className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 translate-x-full animate-in fade-in slide-in-from-left-2">
                                <div className="ml-4 rounded-lg border bg-popover p-3 shadow-lg">
                                  <div className="flex items-start gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    <div className="text-sm">
                                      <p className="font-medium">Email field</p>
                                      <p className="text-muted-foreground">Enter a valid email address</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" placeholder="Enter password" />
                        </div>
                        
                        <Button className="w-full">Submit</Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                      <p>👆 Hover over the email field to see AI guidance</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Language Support Demo */}
            <TabsContent value="language" className="mt-6">
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="mx-auto max-w-2xl space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Select Your Language</h3>
                      <Badge variant="secondary">11+ Languages</Badge>
                    </div>
                    
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="rounded-lg border bg-background p-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Original Text:</p>
                          <p className="text-lg font-medium">Welcome! Please fill out this form.</p>
                        </div>
                        <div className="border-t pt-4">
                          <p className="text-sm text-muted-foreground">Translated ({languages.find(l => l.code === selectedLanguage)?.name}):</p>
                          <p className="text-lg font-medium text-primary">
                            {selectedLanguage === "es" && "¡Bienvenido! Por favor complete este formulario."}
                            {selectedLanguage === "fr" && "Bienvenue! Veuillez remplir ce formulaire."}
                            {selectedLanguage === "de" && "Willkommen! Bitte füllen Sie dieses Formular aus."}
                            {selectedLanguage === "zh" && "欢迎！请填写此表格。"}
                            {selectedLanguage === "ja" && "ようこそ！このフォームに記入してください。"}
                            {selectedLanguage === "en" && "Welcome! Please fill out this form."}
                            {!["es", "fr", "de", "zh", "ja", "en"].includes(selectedLanguage) && "Translation available in real-time..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Voice Interface Demo */}
            <TabsContent value="voice" className="mt-6">
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 dark:from-orange-950/20 dark:to-red-950/20">
                  <div className="mx-auto max-w-2xl space-y-6">
                    <div className="text-center">
                      <h3 className="mb-2 text-lg font-semibold">Voice Commands</h3>
                      <p className="text-sm text-muted-foreground">
                        Use your voice to navigate and get help
                      </p>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button
                        size="lg"
                        variant={isListening ? "destructive" : "default"}
                        className="h-24 w-24 rounded-full"
                        onClick={() => setIsListening(!isListening)}
                      >
                        {isListening ? (
                          <MicOff className="h-8 w-8" />
                        ) : (
                          <Mic className="h-8 w-8" />
                        )}
                      </Button>
                      
                      <Button
                        size="lg"
                        variant={isSpeaking ? "destructive" : "outline"}
                        className="h-24 w-24 rounded-full"
                        onClick={() => setIsSpeaking(!isSpeaking)}
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-8 w-8" />
                        ) : (
                          <Volume2 className="h-8 w-8" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="rounded-lg border bg-background p-6">
                      <p className="mb-4 text-sm font-medium text-muted-foreground">Try saying:</p>
                      <div className="space-y-2">
                        <Badge variant="secondary" className="mr-2">"Fill in my email"</Badge>
                        <Badge variant="secondary" className="mr-2">"What does this button do?"</Badge>
                        <Badge variant="secondary" className="mr-2">"Navigate to checkout"</Badge>
                        <Badge variant="secondary">"Read this page to me"</Badge>
                      </div>
                    </div>
                    
                    {isListening && (
                      <div className="animate-pulse text-center">
                        <p className="text-sm font-medium text-primary">🎤 Listening...</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Form Assistance Demo */}
            <TabsContent value="form" className="mt-6">
              <Card className="overflow-hidden border-2">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 dark:from-green-950/20 dark:to-emerald-950/20">
                  <div className="mx-auto max-w-2xl space-y-6">
                    <div className="text-center">
                      <h3 className="mb-2 text-lg font-semibold">Smart Form Assistance</h3>
                      <p className="text-sm text-muted-foreground">
                        Get contextual help and validation as you type
                      </p>
                    </div>
                    
                    <div className="space-y-4 rounded-lg border bg-background p-6">
                      <div>
                        <Label htmlFor="card">Credit Card Number</Label>
                        <Input 
                          id="card" 
                          placeholder="1234 5678 9012 3456"
                          className="font-mono"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          ✓ AI suggests: Format as XXXX XXXX XXXX XXXX
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                          <p className="mt-1 text-xs text-muted-foreground">
                            ✓ Format: MM/YY
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" maxLength={3} />
                          <p className="mt-1 text-xs text-muted-foreground">
                            ℹ️ 3 digits on back
                          </p>
                        </div>
                      </div>
                      
                      <div className="rounded-md bg-primary/10 p-3">
                        <p className="text-sm">
                          <span className="font-medium">💡 AI Tip:</span> Your card information is encrypted and secure
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
