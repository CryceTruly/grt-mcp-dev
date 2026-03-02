// SSE endpoint disabled (required Redis). Use GET/POST /mcp for the connector.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Use /mcp for MCP connector (GET returns SSE, POST for protocol)." },
    { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Use POST /mcp for MCP protocol." },
    { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
