import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://askesisprep.com";
  const exams = ["sat", "act", "gre", "gmat", "shsat", "regents"];

  // Main routes
  const mainRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/exams`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/practice`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/subscription`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/study-plan`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/mock-test`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/analytics`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  ];

  // Exam-specific routes
  const examRoutes = exams.flatMap((exam) => [
    {
      url: `${baseUrl}/exams/${exam}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/exams/${exam}/curriculum`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/exams/${exam}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]);

  return [...mainRoutes, ...examRoutes];
}
