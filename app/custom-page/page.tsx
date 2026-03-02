"use client";

import Link from "next/link";

export default function CustomPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Custom page</h1>
        <p className="text-[var(--muted)]">
          This is a client-side page. Navigation from the home page works via
          Next.js <code className="text-sky-400">Link</code> (and works inside
          the ChatGPT iframe thanks to the SDK bootstrap).
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
