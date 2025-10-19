import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chrome, Github, Star } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl overflow-hidden border-2">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-12 text-center text-primary-foreground">
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to Transform Your Browsing?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of users who navigate the web with confidence
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                variant="secondary" 
                className="group h-12 px-8 text-base"
              >
                <Chrome className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Install Extension
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 border-2 border-primary-foreground bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-75">
              <Star className="h-4 w-4 fill-current" />
              <span>Free & Open Source</span>
              <span className="mx-2">•</span>
              <span>No Account Required</span>
              <span className="mx-2">•</span>
              <span>Privacy First</span>
            </div>
          </div>
        </Card>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Works on Chrome, Firefox, Edge, and other Chromium-based browsers
          </p>
        </div>
      </div>
    </section>
  );
}
