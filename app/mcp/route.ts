import { mcpHandler } from "@/lib/mcp-server";

// Keep under DigitalOcean/common 60s request timeout so "Add connector" doesn't time out
export const maxDuration = 60;

const SSE_KEEPALIVE_MS = 15_000; // every 15s
const SSE_MAX_AGE_MS = 55_000;   // close after 55s (under 60s platform limit)

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
