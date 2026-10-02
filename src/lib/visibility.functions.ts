import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type VisibilityFlags = { csrVisible: boolean; showPartnership: boolean };

/** Public read of admin visibility switches. Unset values count as "on". */
export const getVisibilityFlags = createServerFn({ method: "GET" }).handler(
  async (): Promise<VisibilityFlags> => {
    try {
      const supabase = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!,
        { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
      );
      const { data } = await supabase
        .from("page_settings")
        .select("page_key, content")
        .in("page_key", ["csr-sponsorship"]);
      const get = (k: string) => (data?.find((r) => r.page_key === k)?.content ?? {}) as any;
      return {
        csrVisible: get("csr-sponsorship").visible !== false,
        showPartnership: get("csr-sponsorship").showPartnership !== false,
      };
    } catch {
      return { csrVisible: true, showPartnership: true };
    }
  },
);
