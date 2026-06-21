import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://manyangdisabilityfoundation.org";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/programs", changefreq: "monthly", priority: "0.8" },
          { path: "/gallery", changefreq: "monthly", priority: "0.6" },
          { path: "/news", changefreq: "weekly", priority: "0.7" },
          { path: "/get-involved", changefreq: "monthly", priority: "0.7" },
          { path: "/donate", changefreq: "monthly", priority: "0.9" },
          { path: "/request", changefreq: "monthly", priority: "0.7" },
          { path: "/guides/free-medical-equipment", changefreq: "monthly", priority: "0.7" },
          { path: "/guides/donate-supplies", changefreq: "monthly", priority: "0.7" },
        ];

        // News articles
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const client = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
          );
          const { data } = await client
            .from("news_articles")
            .select("slug")
            .eq("status", "published");
          for (const a of (data as Array<{ slug: string }>) || []) {
            entries.push({ path: `/news/${a.slug}`, changefreq: "monthly", priority: "0.6" });
          }
        } catch {}

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
