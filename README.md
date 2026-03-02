# ChatGPT App (Next.js + MCP)

A [ChatGPT Apps SDK](https://developers.openai.com/apps-sdk) compatible app built with the [vercel-labs/chatgpt-apps-sdk-nextjs-starter](https://github.com/vercel-labs/chatgpt-apps-sdk-nextjs-starter). It includes an MCP server and a widget UI with **working buttons and links**.

## What works

- **Buttons**: Counter, reset, “Ask ChatGPT”, expand to fullscreen.
- **Links**: Internal Next.js `Link` (e.g. to `/custom-page`) and external links (OpenAI Docs, Vercel). In ChatGPT, external links use `openExternal` when available.
- **MCP tool**: `show_content` — call it from ChatGPT with a name to render the homepage in a widget.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connect to ChatGPT

1. Deploy the app (e.g. [Vercel](https://vercel.com), DigitalOcean).
2. In ChatGPT: **Settings → Connectors → Create** and add your MCP server URL:  
   `https://your-app.example.com/mcp`  
   (GET returns minimal SSE for validation; MCP runs over POST.)

Requires [developer mode](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt) for MCP.

## Deploy to DigitalOcean / other hosts

On non-Vercel hosts the app uses **same-origin** assets by default, so CSS and JS load correctly. Optional: set `NEXT_PUBLIC_APP_URL` (or `APP_URL`) to your full app URL (e.g. `https://next-mcp-imo6a.ondigitalocean.app`) if you need a fixed base URL for widgets.

## Project layout

- `app/page.tsx` — Home: buttons (counter, expand, ask ChatGPT) and links.
- `app/custom-page/page.tsx` — Second page (internal link target).
- `app/mcp/route.ts` — MCP endpoint (GET = minimal SSE for connector validation, POST = streamable HTTP).
- `lib/mcp-server.ts` — Shared MCP server setup (tools + widget).
- `app/layout.tsx` — SDK bootstrap for iframe/history/fetch.
- `app/hooks/` — ChatGPT SDK hooks (`useWidgetProps`, `useOpenExternal`, etc.).

## References

- [OpenAI Apps SDK](https://developers.openai.com/apps-sdk)
- [MCP Server Guide](https://developers.openai.com/apps-sdk/build/mcp-server)
- [Starter repo](https://github.com/vercel-labs/chatgpt-apps-sdk-nextjs-starter)
