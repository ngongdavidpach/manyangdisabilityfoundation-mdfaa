# AI SEO title and description generator (admin)

## What admins get
In Admin Dashboard → Site Content, each page that has SEO fields (Home, About, Programs, Gallery, News, Get Involved, Donate) gets a "Generate with AI" panel above the SEO fields:
- **Page content** box — pre-filled with the page's saved heading/intro text, editable or pasteable.
- **Target keywords** box — comma-separated.
- **Generate** button — shows a suggested title (aim under 60 characters) and description (aim under 160 characters) with live character counts.
- **Use these** button copies the suggestions into the SEO title/description fields; nothing is saved until the admin clicks Save changes as today. Admins can regenerate or edit freely.
- Clear messages for rate limits, out-of-credits, and other failures.

## Technical details
- Install `ai` and `@ai-sdk/openai`; copy the gateway helpers (provider setup, run-ID fetch, Responses helper) into server-only modules under `src/lib/ai/`.
- New `src/lib/seoGenerator.functions.ts`: `createServerFn` POST with `requireStaffOrAdmin` middleware; Zod-validated input (pageKey, content up to ~8k chars, keywords). Calls `openai/gpt-6-astra` via `/v1/responses` with `streamText` + `Output.object({ title, description })`, the required `providerOptions.openai` block (reasoning low, store false), awaiting the final output server-side. Limits stated in the prompt and clamped in code; falls back to parsing raw text on schema errors. Maps 402/403/429 to friendly messages.
- New `SeoAiGenerator` component used inside `PageSettingsEditor` for `seo: true` pages; writes results via the existing `set(content, "seo.title" | "seo.description")`.
- Record the AI module rule in `AGENTS.md`.
- Verify with a real call through the server function and inspect the result.
