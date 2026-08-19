import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Performance Analytics | Track Your Progress - Askesis",
  description: "Monitor your exam prep progress with detailed analytics. Identify weak areas, track improvements, and optimize your study strategy.",
  keywords: ["analytics", "progress tracking", "performance metrics", "exam analysis"],
  openGraph: {
    title: "Performance Analytics | Askesis",
    description: "Track your exam prep progress with detailed analytics.",
    url: "https://askesisprep.com/analytics",
    type: "website",
  },
};

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return children;
}
