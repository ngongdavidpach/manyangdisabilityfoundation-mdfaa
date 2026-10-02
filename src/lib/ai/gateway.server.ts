import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";
const GATEWAY = "https://ai.gateway.lovable.dev/v1";
export const DEFAULT_MODEL = "openai/gpt-6-astra";

export class GatewayError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Streams a Responses call server-side and resolves with the final text. */
export async function generateTextViaGateway(messages: ModelMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new GatewayError(401, "AI is not configured for this site.");
  let runId: string | undefined;
  let failure: { status: number; body: string } | undefined;
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      const res = await fetch(input, { ...init, headers });
      runId ??= res.headers.get(RUN_ID_HEADER)?.trim() || undefined;
      if (!res.ok) failure = { status: res.status, body: await res.clone().text().catch(() => "") };
      return res;
    },
  });
  const result = streamText({
    model: provider.responses(DEFAULT_MODEL),
    messages,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  try {
    return await result.text;
  } catch (err) {
    if (failure) {
      let msg = "";
      try { msg = JSON.parse(failure.body)?.message || JSON.parse(failure.body)?.error?.message || ""; } catch {}
      throw new GatewayError(failure.status, msg);
    }
    throw err;
  }
}
