"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useWidgetProps,
  useMaxHeight,
  useDisplayMode,
  useRequestDisplayMode,
  useIsChatGptApp,
  useOpenExternal,
  useSendMessage,
} from "./hooks";

export default function Home() {
  const toolOutput = useWidgetProps<{
    name?: string;
    result?: { structuredContent?: { name?: string } };
  }>();
  const maxHeight = useMaxHeight() ?? undefined;
  const displayMode = useDisplayMode();
  const requestDisplayMode = useRequestDisplayMode();
  const isChatGptApp = useIsChatGptApp();
  const openExternal = useOpenExternal();
  const sendMessage = useSendMessage();

  const name =
    toolOutput?.result?.structuredContent?.name ??
    (toolOutput as { name?: string })?.name;

  const [count, setCount] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const handleExpand = async () => {
    await requestDisplayMode("fullscreen");
    setLastAction("Requested fullscreen");
  };

  const handleAskChat = () => {
    sendMessage("Tell me more about this app and what I can do with it.");
    setLastAction("Sent follow-up to ChatGPT");
  };

  return (
    <main
      className="min-h-screen p-6"
      style={{ maxHeight: maxHeight ?? undefined, overflow: "auto" }}
    >
      <div className="mx-auto max-w-2xl space-y-8">
        {displayMode !== "fullscreen" && (
          <button
            type="button"
            onClick={handleExpand}
            className="btn-primary w-full sm:w-auto"
          >
            Expand to fullscreen
          </button>
        )}

        {!isChatGptApp && (
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-200">
            <p className="font-medium">Not running in ChatGPT</p>
            <p className="mt-1 text-sm text-amber-200/80">
              Connect this app as an MCP server in ChatGPT to see tool data and
              use openExternal for links.
            </p>
          </div>
        )}

        <section className="rounded-xl bg-[var(--card)] p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            ChatGPT App — Interactive demo
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Name from tool: <strong className="text-[var(--foreground)]">{name ?? "…"}</strong>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Buttons that work</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setCount((c) => c + 1);
                setLastAction("Counter +1");
              }}
              className="btn-primary"
            >
              Count: {count}
            </button>
            <button
              type="button"
              onClick={() => {
                setCount(0);
                setLastAction("Counter reset");
              }}
              className="btn-secondary"
            >
              Reset counter
            </button>
            <button
              type="button"
              onClick={handleAskChat}
              className="btn-ghost"
            >
              Ask ChatGPT for more
            </button>
          </div>
          {lastAction && (
            <p className="text-sm text-[var(--muted)]">Last action: {lastAction}</p>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">List</h2>
          <ul className="space-y-3 rounded-lg border border-slate-600/50 bg-slate-800/20 p-3">
            {[
              {
                img: "https://picsum.photos/64/64?random=1",
                title: "MCP server",
                desc: "Endpoint at /mcp",
                btn: "Open docs",
                onClick: () => openExternal("https://modelcontextprotocol.io"),
              },
              {
                img: "https://picsum.photos/64/64?random=2",
                title: "Show Content tool",
                desc: "Widget rendering in ChatGPT",
                btn: "Learn more",
                onClick: () => sendMessage("How does the Show Content tool work?"),
              },
              {
                img: "https://picsum.photos/64/64?random=3",
                title: "Internal & external links",
                desc: "Link and openExternal",
                btn: "Open SDK",
                onClick: () => openExternal("https://developers.openai.com/apps-sdk"),
              },
              {
                img: "https://picsum.photos/64/64?random=4",
                title: "Interactive buttons",
                desc: "Counter, expand, ask ChatGPT",
                btn: "Try it",
                onClick: () => setCount((c) => c + 1),
              },
              {
                img: "https://picsum.photos/64/64?random=5",
                title: "Custom page",
                desc: "Client-side navigation",
                btn: "Visit page",
                href: "/custom-page",
              },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-4 rounded-lg border border-slate-600/30 bg-slate-800/40 p-3"
              >
                <img
                  src={item.img}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  width={64}
                  height={64}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--foreground)]">{item.title}</p>
                  <p className="text-sm text-[var(--muted)]">{item.desc}</p>
                </div>
                {"href" in item ? (
                  <Link
                    href={item.href as string}
                    className="btn-primary shrink-0 text-sm"
                  >
                    {item.btn}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="btn-primary shrink-0 text-sm"
                  >
                    {item.btn}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Links that work</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/custom-page"
                className="link-external"
              >
                Visit another page (internal)
              </Link>
            </li>
            <li>
              <a
                href="https://developers.openai.com/apps-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="link-external"
              >
                OpenAI Apps SDK docs (external)
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openExternal("https://vercel.com")}
                className="btn-ghost p-0 text-left"
              >
                Open Vercel (via button + openExternal)
              </button>
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-slate-600/50 bg-slate-800/30 px-4 py-3 text-sm text-[var(--muted)]">
          <p>MCP server: <code className="text-sky-400">/mcp</code></p>
          <p className="mt-1">
            In ChatGPT, add this app as a connector to use the &quot;Show Content&quot; tool and see this UI as a widget.
          </p>
        </section>
      </div>
    </main>
  );
}
