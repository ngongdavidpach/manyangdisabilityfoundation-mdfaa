import { useState } from "react";
import { Share2 } from "lucide-react";

const ORIGIN = "https://manyangdisabilityfoundation.org";

export function ShareButton({ title, path }: { title: string; path: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = `${ORIGIN}${path}`;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
  ];
  const onClick = async () => {
    if (typeof navigator !== "undefined" && navigator.share && matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ title, url }); return; } catch { return; }
    }
    setOpen((o) => !o);
  };
  return (
    <div className="relative inline-block">
      <button type="button" onClick={onClick} aria-label="Share this page"
        className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted">
        <Share2 className="h-4 w-4" /> Share
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-2 w-44 rounded-md border border-border bg-popover p-1 text-left shadow-lg">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="block rounded px-3 py-2 text-sm text-popover-foreground hover:bg-muted">{l.label}</a>
          ))}
          <button type="button" className="block w-full rounded px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted"
            onClick={async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
