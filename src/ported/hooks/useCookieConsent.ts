import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import React from "react";

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: 1;
}

const STORAGE_KEY = "mdf.cookieConsent";
const VERSION = 1;

interface Ctx {
  consent: CookieConsent | null;
  bannerOpen: boolean;
  save: (partial: { analytics: boolean; marketing: boolean }) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openPreferences: () => void;
  closeBanner: () => void;
}

const CookieConsentContext = createContext<Ctx | undefined>(undefined);

function readStored(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== VERSION) return null;
    return parsed as CookieConsent;
  } catch {
    return null;
  }
}

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    setConsent(stored);
    setBannerOpen(!stored);
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CookieConsent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setConsent(next);
    setBannerOpen(false);
  }, []);

  const save = useCallback(
    (partial: { analytics: boolean; marketing: boolean }) => {
      persist({
        necessary: true,
        analytics: !!partial.analytics,
        marketing: !!partial.marketing,
        updatedAt: new Date().toISOString(),
        version: VERSION,
      });
    },
    [persist],
  );

  const acceptAll = useCallback(() => save({ analytics: true, marketing: true }), [save]);
  const rejectAll = useCallback(() => save({ analytics: false, marketing: false }), [save]);
  const openPreferences = useCallback(() => setBannerOpen(true), []);
  const closeBanner = useCallback(() => setBannerOpen(false), []);

  const value: Ctx = {
    consent,
    bannerOpen: hydrated && bannerOpen,
    save,
    acceptAll,
    rejectAll,
    openPreferences,
    closeBanner,
  };

  return React.createElement(CookieConsentContext.Provider, { value }, children);
};

export function useCookieConsent(): Ctx {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}
