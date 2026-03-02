import { mcpHandler } from "@/lib/mcp-server";

// GET returns text/event-stream (SSE) for ChatGPT connector.
export const GET = mcpHandler;
export const POST = mcpHandler;
