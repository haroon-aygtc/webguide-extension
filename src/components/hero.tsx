import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Chrome, Download } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="container relative mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Navigation Assistant
          </Badge>
          
          {/* Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Navigate Any Website with
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {" "}AI Guidance
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl lg:text-2xl">
            A sophisticated browser extension that provides real-time visual cues, 
            multi-language support, and voice interactions to help you navigate 
            any website effortlessly.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group h-12 px-8 text-base">
              <Chrome className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Add to Chrome
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              <Download className="mr-2 h-5 w-5" />
              Download Extension
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
            <div>
              <div className="text-3xl font-bold">11+</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Free & Open</div>
            </div>
            <div>
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm text-muted-foreground">Websites</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
