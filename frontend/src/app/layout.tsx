import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import AppFrame from "@/components/AppFrame";
import AIAssistantPanel from "@/components/AIAssistantPanel";
import { ExamProvider } from "@/context/ExamContext";
import { AssistantProvider } from "@/context/AssistantContext";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Askesis - Adaptive Exam Prep for SAT, ACT, GRE, GMAT & More",
  description: "Master standardized exams with AI-adaptive learning, full-length simulations, and personalized study plans for SAT, ACT, GRE, GMAT, SHSAT, and Regents.",
  keywords: "SAT prep, ACT prep, GRE prep, GMAT prep, exam preparation, adaptive learning, study plan, practice tests",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://askesisprep.com",
    siteName: "Askesis",
    title: "Askesis - Adaptive Exam Prep",
    description: "Master SAT, ACT, GRE, GMAT with AI-adaptive learning and personalized study plans.",
    images: "https://askesisprep.com/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Askesis - Adaptive Exam Prep",
    description: "Master standardized exams with AI-adaptive learning.",
    images: "https://askesisprep.com/og-image.jpg",
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
      email: "contact@askesisprep.com",
      url: "https://askesisprep.com"
    }
  };

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Script
          key="schema-ld-json"
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          strategy="afterInteractive"
        />
        <Script
          key="google-gsi"
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
        />
        <ExamProvider>
          <NotificationProvider>
            <AssistantProvider>
              <AppFrame>{children}</AppFrame>
              <AIAssistantPanel />
            </AssistantProvider>
          </NotificationProvider>
        </ExamProvider>
      </body>
    </html>
  );
}
