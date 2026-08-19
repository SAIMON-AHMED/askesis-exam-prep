import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Full-Length Practice Exams | Mock Tests - Askesis",
  description: "Take full-length, timed practice exams under realistic conditions. Get score predictions and detailed performance analytics.",
  keywords: ["mock test", "full-length exam", "practice test", "score prediction"],
  openGraph: {
    title: "Full-Length Practice Exams | Askesis",
    description: "Timed practice exams with realistic conditions and scoring.",
    url: "https://askesisprep.com/mock-test",
    type: "website",
  },
};

export default function MockTestLayout({ children }: { children: ReactNode }) {
  return children;
}
