import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireStaffOrAdmin } from "@/integrations/supabase/admin-middleware";

const Input = z.object({
  pageKey: z.string().max(60),
  content: z.string().trim().min(20, "Add some page content first (at least 20 characters).").max(8000),
  keywords: z.string().max(500),
});

export type SeoSuggestion = { title: string; description: string } | { error: string };

function clamp(s: string, n: number) {
  s = s.replace(/\s+/g, " ").trim();
  return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
}

export const generateSeoMeta = createServerFn({ method: "POST" })
  .middleware([requireStaffOrAdmin])
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }): Promise<SeoSuggestion> => {
    const { generateTextViaGateway, GatewayError } = await import("./ai/gateway.server");
    try {
      const text = await generateTextViaGateway([
        {
          role: "system",
          content:
            "You write SEO metadata for the Manyang Disability Foundation website. Return ONLY JSON: {\"title\":\"...\",\"description\":\"...\"}. Title: at most 60 characters, compelling, include the main keyword naturally. Description: 140-160 characters, plain sentence(s), include keywords naturally, end with a soft call to action. No quotes around keywords, no emojis.",
        },
        {
          role: "user",
          content: `Page: ${data.pageKey}\nTarget keywords: ${data.keywords || "(none given)"}\n\nPage content:\n${data.content}`,
        },
      ]);
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : null;
      if (!parsed?.title || !parsed?.description) return { error: "The AI returned an unexpected answer. Please try again." };
      return { title: clamp(String(parsed.title), 60), description: clamp(String(parsed.description), 160) };
    } catch (err) {
      console.error("[seo-generator]", err);
      if (err instanceof GatewayError) {
        if (err.status === 429) return { error: "Too many requests right now. Please wait a minute and try again." };
        if (err.status === 402) return { error: err.message || "AI credits have run out. Add credits in workspace settings." };
        if (err.status === 403) return { error: err.message || "AI access is blocked for this workspace." };
        if (err.status === 401) return { error: "AI is not configured for this site." };
      }
      return { error: "Couldn't generate suggestions. Please try again." };
    }
  });
