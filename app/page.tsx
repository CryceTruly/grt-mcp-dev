"use client";

import { useMaxHeight } from "./hooks";
import { stores } from "@/lib/promocodes-data";

export default function Home() {
  const maxHeight = useMaxHeight() ?? undefined;

  return (
    <main
      className="min-h-screen p-6"
      style={{ maxHeight: maxHeight ?? undefined, overflow: "auto" }}
    >
      <div className="mx-auto max-w-2xl space-y-8">
        <section className="rounded-xl bg-[var(--card)] p-8 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Promocodes.com
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Store coupons and deals. Use in ChatGPT: add this app as a connector, then ask e.g. &quot;Dell coupons&quot; or &quot;Amazon coupons&quot; to see a list with <strong className="text-[var(--foreground)]">Open offer</strong> buttons.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Example prompts in ChatGPT</h2>
          <ul className="flex flex-wrap gap-2">
            {stores.map((store) => (
              <li
                key={store.id}
                className="rounded-lg border border-slate-600/40 bg-[var(--card)] px-4 py-2 font-medium text-[var(--foreground)]"
              >
                &quot;{store.name} coupons&quot;
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-slate-600/50 bg-slate-800/30 px-4 py-3 text-sm text-[var(--muted)]">
          <p>
            Connector URL: <code className="text-sky-400">/mcp</code>
          </p>
          <p className="mt-1">
            In ChatGPT: Settings → Connectors → Create → add your app URL with <code className="text-sky-400">/mcp</code>, then ask for any store coupons above.
          </p>
        </section>
      </div>
    </main>
  );
}
