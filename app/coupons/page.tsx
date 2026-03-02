"use client";

import { useWidgetProps, useOpenExternal } from "../hooks";
import type { Coupon, Store } from "@/lib/promocodes-data";

type CouponsToolOutput = {
  store?: Store;
  coupons?: Coupon[];
  structuredContent?: { store?: Store; coupons?: Coupon[] };
  result?: { structuredContent?: { store?: Store; coupons?: Coupon[] } };
};

const PROMOCODES_BASE = "https://www.promocodes.com";

export default function CouponsPage() {
  const openExternal = useOpenExternal();
  const data = useWidgetProps<CouponsToolOutput>();

  const store =
    data?.store ?? data?.structuredContent?.store ?? data?.result?.structuredContent?.store;
  const coupons =
    data?.coupons ?? data?.structuredContent?.coupons ?? data?.result?.structuredContent?.coupons ?? [];

  if (!store && coupons.length === 0) {
    return (
      <main className="min-h-screen p-6 bg-[var(--background)]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[var(--muted)]">
            Ask ChatGPT for store coupons, e.g. &quot;Dell coupons&quot; or
            &quot;Amazon coupons&quot;.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
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

  const storeCouponsUrl = store?.slug
    ? `${PROMOCODES_BASE}/${store.slug}-coupons`
    : PROMOCODES_BASE;

  return (
    <main
      className="min-h-screen p-6 bg-[var(--background)]"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Store header — matches main site "X offers" / validated feel */}
        <header className="border-b border-slate-600/40 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {store?.name ?? "Store"} Coupons
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {coupons.length} offer{coupons.length !== 1 ? "s" : ""} validated
          </p>
        </header>

        {/* Coupon list — card style aligned with promocodes.com */}
        <ul className="space-y-3">
          {coupons.map((coupon, index) => (
            <li
              key={coupon.id}
              className={`rounded-xl border bg-[var(--card)] p-4 shadow-sm transition-shadow hover:shadow-md ${
                index === 0
                  ? "border-l-4 border-l-[var(--promo)] border-slate-600/40"
                  : "border-slate-600/40"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  {index === 0 && (
                    <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wide text-[var(--promo)]">
                      Top offer
                    </span>
                  )}
                  <p className="text-lg font-semibold leading-snug text-[var(--foreground)]">
                    {coupon.title}
                  </p>
                  {coupon.description && (
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {coupon.description}
                    </p>
                  )}
                  {coupon.code && (
                    <p className="mt-1.5 text-sm text-[var(--muted)]">
                      Code:{" "}
                      <code className="rounded bg-slate-600/60 px-2 py-0.5 font-mono text-[var(--foreground)]">
                        {coupon.code}
                      </code>
                    </p>
                  )}
                  {((coupon.clicks_count_today != null && coupon.clicks_count_today > 0) || coupon.expiry || (coupon.latest_savings != null && coupon.latest_savings > 0)) && (
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {[
                        coupon.clicks_count_today != null && coupon.clicks_count_today > 0 && "Working today",
                        coupon.expiry && `Expires ${coupon.expiry}`,
                        coupon.latest_savings != null && coupon.latest_savings > 0 && `A shopper recently saved $${Number(coupon.latest_savings).toLocaleString()}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
                <div className="shrink-0 sm:pl-4">
                  <button
                    type="button"
                    onClick={() => openExternal(coupon.offerUrl)}
                    className="btn-promo w-full whitespace-nowrap text-sm sm:w-auto"
                  >
                    {coupon.code ? "Use code" : "Get deal"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Link back to main site */}
        <footer className="pt-2 text-center">
          <a
            href={storeCouponsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--promo)] hover:underline"
          >
            View all {store?.name ?? "store"} coupons at Promocodes.com →
          </a>
        </footer>
      </div>
    </main>
  );
}
