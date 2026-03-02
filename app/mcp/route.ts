import { mcpHandler } from "@/lib/mcp-server";

// Allow long-lived SSE and MCP POST (avoid platform timeout)
export const maxDuration = 300; // 5 min (Vercel Pro; reduce if on Hobby)

const SSE_KEEPALIVE_MS = 20_000;
const SSE_MAX_AGE_MS = 4 * 60 * 1000; // 4 min (under common platform limits)

// GET: SSE with keep-alive so ChatGPT backend doesn't timeout. MCP protocol runs over POST.
export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      controller.enqueue(enc.encode(": connected\n\n"));

      const keepalive = setInterval(() => {
        try {
          controller.enqueue(enc.encode(": keepalive\n\n"));
        } catch {
          clearInterval(keepalive);
        }
      }, SSE_KEEPALIVE_MS);

      const maxAge = setTimeout(() => {
        clearInterval(keepalive);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }, SSE_MAX_AGE_MS);

      request.signal?.addEventListener?.("abort", () => {
        clearInterval(keepalive);
        clearTimeout(maxAge);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export const POST = mcpHandler;
