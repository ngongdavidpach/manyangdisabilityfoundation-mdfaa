export const DEFAULT_FOOTER_RESOURCES = [
  { id: "csr", label: "CSR Sponsorship", href: "/csr-sponsorship", visible: true },
  { id: "coordinators", label: "Coordinator Portal (East Africa)", href: "/portal/coordinators", visible: true },
  { id: "fundraisers", label: "Fundraiser Sign-up (AU)", href: "/portal/fundraisers", visible: true },
  { id: "mobility", label: "Mobility Aid Grants", href: "/guides/mobility-aid-grants", visible: true },
  { id: "faq", label: "Donation FAQ", href: "/faq/donations", visible: true },
  { id: "events", label: "Events Calendar", href: "/events", visible: true },
  { id: "contact", label: "Contact & Partnerships", href: "/contact", visible: true },
] as const;

export type FooterResource = { id: string; label: string; href: string; visible: boolean };

export function safeResourceHref(value: string): string | null {
  const href = value.trim();
  if (/^\/(?!\/)[^?#\s]*(?:[?#][^\s]*)?$/.test(href)) return href;
  if (/^https:\/\//i.test(href)) {
    try {
      const url = new URL(href);
      if (url.protocol === "https:" && !url.username && !url.password) return href;
    } catch { /* Invalid URL. */ }
  }
  return null;
}

export function normalizeFooterResources(value: unknown): FooterResource[] {
  const saved = Array.isArray(value) ? value : [];
  return DEFAULT_FOOTER_RESOURCES.map((item) => {
    const override = saved.find((row) => row && typeof row === "object" && row.id === item.id);
    return {
      id: item.id,
      label: typeof override?.label === "string" ? override.label : item.label,
      href: typeof override?.href === "string" ? override.href : item.href,
      visible: override?.visible !== false,
    };
  });
}