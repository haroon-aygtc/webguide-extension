import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Languages, Mic, FileText, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Smart Visual Guidance",
    description: "Animated highlights, tooltips, and step-by-step tutorials that understand form fields and page elements.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Languages,
    title: "Multi-language Support",
    description: "Real-time translation of labels, errors and content with support for 11+ languages.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Mic,
    title: "Voice Interface",
    description: "Natural language voice commands and text-to-speech explanations for accessibility.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: FileText,
    title: "Form Assistance",
    description: "Field explanations, validation help, and smart autofill suggestions.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Zero Integration",
    description: "Works across websites without requiring integration from site owners.",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All processing happens locally in your browser. Your data never leaves your device.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export default function Features() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to navigate websites with confidence and ease
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <CardHeader>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
