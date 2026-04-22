import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/staff", "/staff/*", "/api/*"],
    },
    sitemap: "https://tmfnigeria.com/sitemap.xml",
    host: "https://tmfnigeria.com",
  };
}
