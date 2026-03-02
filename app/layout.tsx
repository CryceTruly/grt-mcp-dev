import type { Metadata } from "next";
import "./globals.css";
import { baseURL } from "@/baseUrl";

export const metadata: Metadata = {
  title: "Promocodes.com",
  description: "Store coupons and deals — use in ChatGPT",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <NextChatSDKBootstrap baseUrl={baseURL} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

function NextChatSDKBootstrap({ baseUrl }: { baseUrl: string }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.innerBaseUrl = ${JSON.stringify(baseUrl)}`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__isChatGptApp = typeof window.openai !== "undefined";`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(" +
            (function () {
              let baseUrl = (window as any).innerBaseUrl;
              if (!baseUrl) baseUrl = window.location.origin;
              const htmlElement = document.documentElement;
              const observer = new MutationObserver((mutations: MutationRecord[]) => {
                mutations.forEach((mutation) => {
                  if (
                    mutation.type === "attributes" &&
                    mutation.target === htmlElement
                  ) {
                    const attrName = mutation.attributeName;
                    if (attrName && attrName !== "suppresshydrationwarning") {
                      htmlElement.removeAttribute(attrName);
                    }
                  }
                });
              });
              observer.observe(htmlElement, {
                attributes: true,
                attributeOldValue: true,
              });

              const originalReplaceState = history.replaceState;
              history.replaceState = function (
                s: unknown,
                unused: string,
                url?: string | URL
              ) {
                const u = new URL(url ?? "", window.location.href);
                const href = u.pathname + u.search + u.hash;
                originalReplaceState.call(history, s, unused, href);
              };

              const originalPushState = history.pushState;
              history.pushState = function (
                s: unknown,
                unused: string,
                url?: string | URL
              ) {
                const u = new URL(url ?? "", window.location.href);
                const href = u.pathname + u.search + u.hash;
                originalPushState.call(history, s, unused, href);
              };

              const appOrigin = new URL(baseUrl).origin;
              const isInIframe = window.self !== window.top;

              window.addEventListener(
                "click",
                (e: MouseEvent) => {
                  const a = (e?.target as HTMLElement)?.closest("a");
                  if (!a || !a.href) return;
                  const url = new URL(a.href, window.location.href);
                  if (
                    url.origin !== window.location.origin &&
                    url.origin !== appOrigin
                  ) {
                    try {
                      if ((window as any).openai) {
                        (window as any).openai?.openExternal({ href: a.href });
                        e.preventDefault();
                      }
                    } catch {
                      console.warn(
                        "openExternal failed, likely not in OpenAI client"
                      );
                    }
                  }
                },
                true
              );

              if (isInIframe && window.location.origin !== appOrigin) {
                const originalFetch = window.fetch;

                window.fetch = function (
                  input: URL | RequestInfo,
                  init?: RequestInit
                ) {
                  let url: URL;
                  if (typeof input === "string" || input instanceof URL) {
                    url = new URL(input, window.location.href);
                  } else {
                    url = new URL((input as Request).url, window.location.href);
                  }

                  if (url.origin === appOrigin) {
                    if (typeof input === "string" || input instanceof URL) {
                      input = url.toString();
                    } else {
                      input = new Request(url.toString(), input as Request);
                    }
                    return originalFetch.call(window, input, {
                      ...init,
                      mode: "cors",
                    });
                  }

                  if (url.origin === window.location.origin) {
                    const newUrl = new URL(baseUrl);
                    newUrl.pathname = url.pathname;
                    newUrl.search = url.search;
                    newUrl.hash = url.hash;
                    url = newUrl;

                    if (typeof input === "string" || input instanceof URL) {
                      input = url.toString();
                    } else {
                      input = new Request(url.toString(), input as Request);
                    }
                    return originalFetch.call(window, input, {
                      ...init,
                      mode: "cors",
                    });
                  }

                  return originalFetch.call(window, input, init);
                };
              }
            }).toString() +
            ")()",
        }}
      />
    </>
  );
}
