import {
  Accessibility,
  Scale,
  BookOpen,
  HeartPulse,
  Trophy,
  Handshake,
  Coins,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface FocusArea {
  title: string;
  description?: string;
  icon?: string;
}

export const FOCUS_AREA_ICONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "Scale", label: "Advocacy / Rights", Icon: Scale },
  { id: "BookOpen", label: "Culture & Language", Icon: BookOpen },
  { id: "HeartPulse", label: "Health", Icon: HeartPulse },
  { id: "Trophy", label: "Sport & Talent", Icon: Trophy },
  { id: "Handshake", label: "Liaison / Partnership", Icon: Handshake },
  { id: "Coins", label: "Fundraising", Icon: Coins },
  { id: "Accessibility", label: "Disability support", Icon: Accessibility },
  { id: "Sparkles", label: "General", Icon: Sparkles },
];

export function focusAreaIcon(id?: string): LucideIcon {
  return FOCUS_AREA_ICONS.find((i) => i.id === id)?.Icon ?? Sparkles;
}

export function normalizeFocusAreas(value: unknown): FocusArea[] {
  if (!Array.isArray(value)) return [];
  return (value as FocusArea[])
    .filter((a) => a && typeof a.title === "string" && a.title.trim())
    .map((a) => ({
      title: a.title.trim(),
      description: typeof a.description === "string" ? a.description : "",
      icon: typeof a.icon === "string" ? a.icon : "Sparkles",
    }));
}
