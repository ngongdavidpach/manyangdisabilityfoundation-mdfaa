export const NAV_ITEM_DEFS: { id: string; label: string; flag: string }[] = [
  { id: 'home', label: 'Home', flag: 'showHome' },
  { id: 'about', label: 'About Us', flag: 'showAbout' },
  { id: 'programs', label: 'Our Impact', flag: 'showPrograms' },
  { id: 'gallery', label: 'Gallery', flag: 'showGallery' },
  { id: 'request', label: 'Request Aid', flag: 'showRequest' },
  { id: 'news', label: 'News & Events', flag: 'showNews' },
  { id: 'get-involved', label: 'Get Involved', flag: 'showGetInvolved' },
];

const DEFAULT_ORDER = NAV_ITEM_DEFS.map((i) => i.id);

export function resolveNavOrder(order: unknown): string[] {
  const arr = Array.isArray(order)
    ? (order as string[]).filter((id) => DEFAULT_ORDER.includes(id))
    : [];
  const seen = new Set(arr);
  return [...arr, ...DEFAULT_ORDER.filter((id) => !seen.has(id))];
}
