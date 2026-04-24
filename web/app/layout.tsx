import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fira_Code } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/AppShell/TopNav";
import { Sidebar } from "@/components/AppShell/Sidebar";
import { Footer } from "@/components/AppShell/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AGENT_ARCHIVE // Outskill Agent Showcase",
  description:
    "30 CrewAI mini-projects across beginner, intermediate, and advanced tiers. From your first resume screener to a full hiring pipeline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${inter.variable} ${firaCode.variable}`}>
      <body className="bg-night text-ink font-body min-h-screen">
        <TopNav />
        <Sidebar />
        <main className="lg:pl-64 pt-16 min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
