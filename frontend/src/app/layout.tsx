import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import AppFrame from "@/components/AppFrame";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import { ExamProvider } from "@/context/ExamContext";
import { AssistantProvider } from "@/context/AssistantContext";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Askesis - Adaptive Exam Prep for SAT, ACT, GRE, GMAT & More",
  description: "Master standardized exams with AI-adaptive learning, full-length simulations, and personalized study plans for SAT, ACT, GRE, GMAT, SHSAT, and Regents.",
  keywords: ["SAT prep", "ACT prep", "GRE prep", "GMAT prep", "exam preparation", "adaptive learning", "study plan", "practice tests"],
  authors: [{ name: "Askesis" }],
  creator: "Askesis",
  publisher: "Askesis",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://askesisprep.com",
    siteName: "Askesis",
    title: "Askesis - Adaptive Exam Prep",
    description: "Master SAT, ACT, GRE, GMAT with AI-adaptive learning and personalized study plans.",
    images: [
      {
        url: "https://askesisprep.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Askesis - Adaptive Exam Prep Platform",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Askesis - Adaptive Exam Prep",
    description: "Master standardized exams with AI-adaptive learning.",
    images: ["https://askesisprep.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://askesisprep.com",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Askesis",
    description: "Adaptive exam preparation platform for standardized tests",
    url: "https://askesisprep.com",
    logo: "https://askesisprep.com/logo.png",
    sameAs: [
      "https://twitter.com/askesis",
      "https://www.linkedin.com/company/askesis"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://askesisprep.com"
    }
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ExamProvider>
          <NotificationProvider>
            <AssistantProvider>
              <AppFrame>{children}</AppFrame>
              <AIAssistantPanel />
            </AssistantProvider>
          </NotificationProvider>
        </ExamProvider>
        <Analytics />
      </body>
    </html>
  );
}
