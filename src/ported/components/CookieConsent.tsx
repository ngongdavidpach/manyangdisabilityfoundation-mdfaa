import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "../hooks/useCookieConsent";

export const CookieConsent: React.FC = () => {
  const { bannerOpen, consent, save, acceptAll, rejectAll, closeBanner } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-slate-900">We value your privacy</h2>
            <p className="mt-1 text-sm text-slate-600">
              We use strictly necessary cookies to keep the site secure and to remember your
              sign-in. With your consent, we may add analytics or marketing cookies in the future.
              You can change your choice at any time from the footer.{" "}
              <Link to="/privacy" className="text-blue-700 hover:underline">
                Read our Privacy Policy
              </Link>
              .
            </p>

            {showDetails && (
              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                <CategoryRow
                  title="Strictly necessary"
                  desc="Auth and session cookies required to sign in and keep pages working. Always on."
                  checked
                  disabled
                />
                <CategoryRow
                  title="Analytics"
                  desc="Anonymous usage measurement to help us improve the site. Not currently active."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <CategoryRow
                  title="Marketing"
                  desc="Used for personalised outreach or ads. Not currently active."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!showDetails ? (
                <>
                  <button
                    onClick={acceptAll}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    Accept all
                  </button>
                  <button
                    onClick={rejectAll}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    Reject non-essential
                  </button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-slate-700 hover:text-slate-900 text-sm font-medium px-3 py-2"
                  >
                    Customize
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => save({ analytics, marketing })}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    Save preferences
                  </button>
                  <button
                    onClick={acceptAll}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    Accept all
                  </button>
                  <button
                    onClick={rejectAll}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    Reject non-essential
                  </button>
                  {consent && (
                    <button
                      onClick={closeBanner}
                      className="text-slate-700 hover:text-slate-900 text-sm font-medium px-3 py-2"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CategoryRow({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 ${disabled ? "opacity-70" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-900">{title}</span>
        <span className="block text-xs text-slate-600 mt-0.5">{desc}</span>
      </span>
    </label>
  );
}
