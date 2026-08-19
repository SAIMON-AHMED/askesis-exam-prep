import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Exam Prep Courses | SAT, ACT, GRE, GMAT, SHSAT, Regents - Askesis",
  description: "Browse our comprehensive exam prep courses. Choose from SAT, ACT, GRE, GMAT, SHSAT, and Regents. Adaptive learning for every test.",
  keywords: ["exam prep", "SAT", "ACT", "GRE", "GMAT", "SHSAT", "Regents", "standardized tests"],
  openGraph: {
    title: "Exam Prep Courses | Askesis",
    description: "Browse SAT, ACT, GRE, GMAT prep courses with adaptive learning.",
    url: "https://askesisprep.com/exams",
    type: "website",
  },
};

export default function ExamsLayout({ children }: { children: ReactNode }) {
  return children;
}
