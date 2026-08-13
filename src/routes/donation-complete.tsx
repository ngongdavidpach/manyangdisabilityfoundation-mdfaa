import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Heart, Loader2 } from "lucide-react";
import { getDonationCheckoutResult } from "@/lib/payments/stripe.functions";

type Search = { session_id?: string };

export const Route = createFileRoute("/donation-complete")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Donation complete — Manyang Disability Foundation" },
      {
        name: "description",
        content:
          "Thank you for supporting mobility aids, rehabilitation and inclusive education for people with disabilities.",
      },
      { property: "og:title", content: "Donation complete — Manyang Disability Foundation" },
      {
        property: "og:description",
        content: "Your gift funds wheelchairs, therapy and inclusive classrooms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DonationCompletePage,
});

function DonationCompletePage() {
  const { session_id } = Route.useSearch();
  const lookup = useServerFn(getDonationCheckoutResult);
  const [state, setState] = useState<
    | { loading: true }
    | {
        loading: false;
        status: string;
        amountTotal: number | null;
        currency: string;
        mode: string;
      }
  >({ loading: true });

  useEffect(() => {
    if (!session_id) {
      setState({ loading: false, status: "unknown", amountTotal: null, currency: "AUD", mode: "payment" });
      return;
    }
    let cancelled = false;
    lookup({ data: { sessionId: session_id } })
      .then((result) => {
        if (!cancelled) setState({ loading: false, ...result });
      })
      .catch(() => {
        if (!cancelled)
          setState({
            loading: false,
            status: "unknown",
            amountTotal: null,
            currency: "AUD",
            mode: "payment",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [session_id, lookup]);

  const paid = !state.loading && state.status === "paid";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="bg-blue-900 text-white p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-white text-blue-900 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 fill-blue-900" />
          </div>
          <h1 className="text-2xl font-bold">Thank you for your donation</h1>
          <p className="text-blue-200 text-xs mt-1">Manyang Disability Foundation</p>
        </div>

        <div className="p-8 space-y-5 text-center">
          {state.loading ? (
            <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Confirming your payment…
            </p>
          ) : (
            <>
              {state.amountTotal ? (
                <p className="text-4xl font-extrabold text-slate-900">
                  {state.currency} {(state.amountTotal / 100).toFixed(2)}
                  {state.mode === "subscription" ? (
                    <span className="text-xs font-normal text-slate-500"> / month</span>
                  ) : null}
                </p>
              ) : null}
              <p className="text-sm text-slate-600 leading-relaxed">
                {paid || state.mode === "subscription" ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Payment received
                  </span>
                ) : (
                  "Your payment is being processed. We'll email your receipt as soon as it settles."
                )}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                A confirmation email with your payment details is on its way. A formal tax receipt
                follows from our finance team.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              to="/"
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-lg text-xs text-center"
            >
              Back to home
            </Link>
            <Link
              to="/programs"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs text-center"
            >
              See our programs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
