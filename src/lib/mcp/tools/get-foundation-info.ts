import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_foundation_info",
  title: "Get foundation info",
  description:
    "Return public information about the Manyang Disability Foundation — mission, focus areas, and contact details.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    let dbInfo: unknown = null;
    if (supabaseUrl && key) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/foundation_info?select=*&limit=1`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        });
        if (res.ok) dbInfo = (await res.json())?.[0] ?? null;
      } catch {
        // ignore, return static fallback
      }
    }
    const payload = dbInfo ?? {
      name: "Manyang Disability Foundation",
      url: "https://manyangdisabilityfoundation.org",
      mission:
        "Support persons with disabilities through mobility aids, healthcare access, inclusive education, and sustainable livelihoods.",
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { info: payload },
    };
  },
});
