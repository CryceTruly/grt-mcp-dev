"use client";

import { useMaxHeight } from "./hooks";
import { stores } from "@/lib/promocodes-data";
import type { Store } from "@/lib/promocodes-data";

const PROMOCODES_BASE = "https://www.promocodes.com";

/** Preview of how the coupons widget looks (dummy store + sample coupon). */
function WidgetPreview({ store }: { store: Store }) {
  const previewCoupons = store.coupons.slice(0, 2);

  return (
    <div className="rounded-xl border border-slate-600/40 bg-[var(--card)] p-4 shadow-sm">
      <header className="mb-4 border-b border-slate-600/40 pb-4">
        <h3 className="text-xl font-bold text-[var(--foreground)]">
          {store.name} Coupons
        </h3>
        <p className="mt-0.5 text-sm text-[var(--muted)]">
          {store.coupons.length} offers validated
        </p>
      </header>
      <ul className="space-y-2">
        {previewCoupons.map((coupon) => (
          <li
            key={coupon.id}
            className="rounded-lg border border-slate-600/40 bg-[var(--background)] p-3"
          >
            <p className="font-medium text-[var(--foreground)]">{coupon.title}</p>
            {coupon.description && (
              <p className="mt-0.5 text-sm text-[var(--muted)]">{coupon.description}</p>
            )}
            <span className="mt-2 inline-block rounded bg-[var(--promo)] px-3 py-1 text-xs font-semibold text-white">
              {coupon.code ? "Use code" : "Get deal"}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-xs text-[var(--muted)]">
        In ChatGPT you’ll see the full list with working buttons.
      </p>
    </div>
  );
}

export default function Home() {
  const maxHeight = useMaxHeight() ?? undefined;

  return (
    <main
      className="min-h-screen p-6 bg-[var(--background)]"
      style={{ maxHeight: maxHeight ?? undefined, overflow: "auto" }}
    >
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Hero — aligns with main site "Today's Top Coupons" tone */}
        <section className="rounded-2xl border border-slate-600/40 bg-[var(--card)] p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Promocodes.com
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            Store coupons and deals in ChatGPT. Add this app as a connector, then
            ask for any store — e.g. &quot;Dell coupons&quot; or &quot;Amazon
            coupons&quot; — to see offers with <strong className="text-[var(--foreground)]">Use Coupon</strong> buttons.
          </p>
          <a
            href={PROMOCODES_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-medium text-[var(--promo)] hover:underline"
          >
            Visit Promocodes.com →
          </a>
        </section>

        {/* Widget preview — how the list will look in ChatGPT */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            How it looks in ChatGPT
          </h2>
          <WidgetPreview store={stores[0]} />
        </section>

        {/* Example prompts — card-style like main site store links */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Try in ChatGPT
          </h2>
          <ul className="flex flex-wrap gap-2">
            {stores.map((store) => (
              <li key={store.id}>
                <span className="inline-flex rounded-xl border border-slate-600/40 bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm">
                  &quot;{store.name} coupons&quot;
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Connector setup */}
        <section className="rounded-xl border border-slate-600/50 bg-slate-800/30 px-4 py-4 text-sm text-[var(--muted)]">
          <p className="font-medium text-[var(--foreground)]">
            Connector URL: <code className="rounded bg-slate-700/80 px-1.5 py-0.5 text-[var(--promo)]">/mcp</code>
          </p>
          <p className="mt-2">
            In ChatGPT: Settings → Connectors → Create → enter your app URL
            with <code className="rounded bg-slate-700/80 px-1.5 py-0.5">/mcp</code>, then ask for any store coupons above.
          </p>
        </section>

        <p className="text-center text-xs text-[var(--muted)]">
          Powered by{" "}
          <a
            href={PROMOCODES_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--promo)] hover:underline"
          >
            Promocodes.com
          </a>
        </p>
      </div>
    </main>
  );
}
