# Project Architecture Rules

- Store public donation payment details in the `donate` row of `page_settings`, with safe display defaults in the Donate view, so staff can update them through the existing page editor.
- Treat `payid` as a valid donation-intent channel alongside bank transfer so donor references preserve the selected payment method.
- Read the homepage opening photo from `page_settings.home.hero.image`, because the existing admin page editor owns that selection.
- Keep footer resource link defaults and destination validation in a shared module, so the admin editor and public footer display the same links safely.- AI Gateway calls live in server-only `src/lib/ai/*.server.ts` helpers and are exposed only through staff/admin-gated server functions, so keys and prompts never reach the browser.
