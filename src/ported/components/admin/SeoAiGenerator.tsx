import React, { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { generateSeoMeta } from "@/lib/seoGenerator.functions";

export const SeoAiGenerator: React.FC<{
  pageKey: string;
  initialContent: string;
  onApply: (title: string, description: string) => void;
}> = ({ pageKey, initialContent, onApply }) => {
  const generate = useServerFn(generateSeoMeta);
  const [text, setText] = useState(initialContent);
  const [keywords, setKeywords] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ title: string; description: string } | null>(null);

  useEffect(() => { setText(initialContent); setResult(null); setError(""); }, [pageKey, initialContent]);

  const run = async () => {
    setBusy(true); setError(""); setResult(null);
    try {
      const r = await generate({ data: { pageKey, content: text, keywords } });
      if ("error" in r) setError(r.error); else setResult(r);
    } catch (e: any) {
      setError(e?.message?.includes("at least 20") ? "Add some page content first (at least 20 characters)." : "Couldn't generate suggestions. Please try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="md:col-span-2 border border-blue-200 bg-blue-50/50 rounded-lg p-4 space-y-3">
      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-600" /> Generate SEO title & description with AI</h4>
      <label className="block text-xs font-semibold text-slate-600">Page content
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white" />
      </label>
      <label className="block text-xs font-semibold text-slate-600">Target keywords (comma-separated)
        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g. disability charity, mobility aids" className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white" />
      </label>
      <button type="button" onClick={run} disabled={busy} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white text-sm font-medium px-4 py-2 rounded-md">
        {busy ? "Generating…" : result ? "Regenerate" : "Generate"}
      </button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {result && (
        <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2 text-sm">
          <p><span className="font-semibold">Title</span> <span className="text-xs text-slate-500">({result.title.length}/60)</span><br />{result.title}</p>
          <p><span className="font-semibold">Description</span> <span className="text-xs text-slate-500">({result.description.length}/160)</span><br />{result.description}</p>
          <button type="button" onClick={() => onApply(result.title, result.description)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-md">
            Use these (then Save changes)
          </button>
        </div>
      )}
    </div>
  );
};
