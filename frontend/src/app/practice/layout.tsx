import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Practice Questions | Adaptive Exam Prep - Askesis",
  description: "Practice with adaptive questions tailored to your skill level. Master exam topics with instant feedback and detailed explanations.",
  keywords: ["practice questions", "adaptive quiz", "exam practice", "test prep"],
  openGraph: {
    title: "Practice Questions | Askesis",
    description: "Adaptive practice questions with detailed explanations.",
    url: "https://askesisprep.com/practice",
    type: "website",
  },
};

export default function PracticeLayout({ children }: { children: ReactNode }) {
  return children;
}
