"use client";

import { useWidgetProps, useOpenExternal } from "../hooks";
import type { Coupon, Store } from "@/lib/promocodes-data";

type CouponsToolOutput = {
  store?: Store;
  coupons?: Coupon[];
  result?: { structuredContent?: { store?: Store; coupons?: Coupon[] } };
};

export default function CouponsPage() {
  const openExternal = useOpenExternal();
  const data = useWidgetProps<CouponsToolOutput>();

  const store = data?.store ?? data?.result?.structuredContent?.store;
  const coupons =
    data?.coupons ?? data?.result?.structuredContent?.coupons ?? [];

  if (!store && coupons.length === 0) {
    return (
      <main className="min-h-screen p-6 bg-[var(--background)]">
        <div className="mx-auto max-w-2xl">
          <p className="text-[var(--muted)]">
            Ask ChatGPT for store coupons, e.g. &quot;Dell coupons&quot; or
            &quot;Amazon coupons&quot;.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen p-6 bg-[var(--background)]"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-xl font-bold text-[var(--foreground)]">
          {store?.name ?? "Store"} — Coupons
        </h1>
        <ul className="space-y-3">
          {coupons.map((coupon) => (
            <li
              key={coupon.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-600/40 bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--foreground)]">
                  {coupon.title}
                </p>
                {coupon.code && (
                  <p className="mt-0.5 text-sm text-sky-400">
                    Code: <code className="rounded bg-slate-700 px-1.5 py-0.5">{coupon.code}</code>
                  </p>
                )}
                {coupon.expiry && (
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    Expires: {coupon.expiry}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => openExternal(coupon.offerUrl)}
                className="btn-primary shrink-0 text-sm"
              >
                Open offer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
