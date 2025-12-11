import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/pro/dashboard",
          "/pro/analytics",
          "/pro/availability",
          "/pro/settings",
          "/my-bookings",
          "/my-favorites",
          "/bookings/",
          "/client/dashboard",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}












