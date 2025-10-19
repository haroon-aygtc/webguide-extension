import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AssistantProvider } from "@/contexts/assistant-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-Modal Navigation Assistant | AI-Powered Web Guide",
  description: "A sophisticated AI assistant overlay that helps users navigate websites by providing real-time guidance through visual cues, multiple languages, and voice interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AssistantProvider>
          {children}
        </AssistantProvider>
      </body>
    </html>
  );
}