import Hero from "@/components/hero";
import Features from "@/components/features";
import DemoSection from "@/components/demo-section";
import HowItWorks from "@/components/how-it-works";
import CTASection from "@/components/cta-section";
import AssistantOverlay from "@/components/assistant-overlay";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Hero />
      <Features />
      <DemoSection />
      <HowItWorks />
      <CTASection />
      <AssistantOverlay />
    </div>
  );
}