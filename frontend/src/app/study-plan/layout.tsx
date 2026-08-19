import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Personalized Study Plans | Custom Learning Path - Askesis",
  description: "Get a personalized study plan tailored to your pace and goals. Track progress and stay focused on exam prep with Askesis.",
  keywords: ["study plan", "learning path", "exam prep schedule", "personalized learning"],
  openGraph: {
    title: "Personalized Study Plans | Askesis",
    description: "Custom study plans for effective exam preparation.",
    url: "https://askesisprep.com/study-plan",
    type: "website",
  },
};

export default function StudyPlanLayout({ children }: { children: ReactNode }) {
  return children;
}
