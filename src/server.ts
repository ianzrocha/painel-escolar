import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Nitro node-server preset uses h3 event handlers, not Cloudflare-style fetch exports.
// TanStack Start's SSR handler is exposed via the virtual module below, which Nitro
// resolves at build time from the tanstackStart.server.entry config in vite.config.ts.
export default defineEventHandler(async (event) => {
  try {
    // @ts-expect-error — virtual module resolved by Nitro/TanStack Start at build time
    const { default: handler } = await import("#tanstack-start-server");
    const response: Response = await handler.fetch(toWebRequest(event));
    return await normalizeCatastrophicSsrResponse(response);
  } catch (error) {
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});
