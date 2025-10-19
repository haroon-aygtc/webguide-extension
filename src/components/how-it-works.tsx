import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MousePointer, Sparkles, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Install Extension",
    description: "Add the browser extension to Chrome, Firefox, or Edge in seconds",
    icon: MousePointer,
  },
  {
    number: "02",
    title: "Navigate Any Site",
    description: "Visit any website and the AI automatically analyzes the page structure",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Get Instant Help",
    description: "Receive visual cues, translations, and voice guidance as you browse",
    icon: CheckCircle,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4">
            Simple Setup
          </Badge>
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in three simple steps
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="group h-full border-2 transition-all hover:border-primary/50 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-5xl font-bold text-primary/20">
                          {step.number}
                        </span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  
                  {index < steps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                      <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
