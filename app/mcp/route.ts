import { mcpHandler } from "@/lib/mcp-server";

// GET: optional discovery response (streamable HTTP uses POST only).
export async function GET() {
  return new Response(
    JSON.stringify({
      protocol: "mcp",
      transport: "streamable_http",
      message: "Use POST for MCP requests. For SSE use /sse",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export const POST = mcpHandler;
