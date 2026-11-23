import { createFileRoute } from "@tanstack/react-router";

const PURGE_BATCH_LIMIT = 50;

export const Route = createFileRoute("/api/public/hooks/purge-deleted-accounts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Only the scheduled job may call this: it sends a private token
        // stored in a service-role-only table. The public anon key is NOT accepted.
        const providedKey = request.headers.get("x-cron-token") || "";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: tok } = await supabaseAdmin
          .from("internal_cron_tokens" as never)
          .select("token")
          .eq("name", "purge-deleted-accounts")
          .maybeSingle();
        const expected = (tok as { token?: string } | null)?.token ?? "";
        if (!providedKey || !expected || providedKey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { enqueueTransactionalEmail } = await import("@/lib/email/enqueue.server");

        const nowIso = new Date().toISOString();
        const { data: due, error: fetchErr } = await supabaseAdmin
          .from("account_deletion_requests")
          .select("user_id, email, purge_after")
          .eq("status", "pending")
          .lte("purge_after", nowIso)
          .limit(PURGE_BATCH_LIMIT);

        if (fetchErr) {
          console.error("[purge-deleted-accounts] fetch error", fetchErr);
          return Response.json({ ok: false, error: fetchErr.message }, { status: 500 });
        }

        const results: Array<{ user_id: string; ok: boolean; error?: string }> = [];

        for (const row of due ?? []) {
          const userId = row.user_id;
          const email = row.email;

          // Enqueue the confirmation email BEFORE deleting the auth user.
          try {
            await enqueueTransactionalEmail({
              templateName: "account-deletion-confirmed",
              recipientEmail: email,
              idempotencyKey: `deletion-confirmed-${userId}`,
              bypassSuppression: true,
              templateData: {
                email,
                deletedAt: new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              },
            });
          } catch (e) {
            console.error("[purge-deleted-accounts] email enqueue failed", { userId, e });
          }

          // Delete the auth user — FK cascades remove profiles/user_roles/etc.
          const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
          if (delErr) {
            console.error("[purge-deleted-accounts] delete failed", { userId, delErr });
            results.push({ user_id: userId, ok: false, error: delErr.message });
            continue;
          }

          // account_deletion_requests row cascades on auth.users delete, but
          // the ON DELETE CASCADE removes the audit trail. Instead we mark it
          // purged first so the row survives briefly for reporting — but the
          // FK will drop it after delete. That's acceptable: history lives in
          // logs. Skip the UPDATE.
          results.push({ user_id: userId, ok: true });
        }

        return Response.json({ ok: true, purged: results.length, results });
      },
    },
  },
});
