function getProductionBaseUrl(): string {
  // Vercel (auto-set)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL) {
    return (
      "https://" +
      (process.env.VERCEL_ENV === "production"
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL)
    );
  }
  // DigitalOcean, Railway, etc.: set NEXT_PUBLIC_APP_URL or APP_URL to your app URL (e.g. https://next-mcp-imo6a.ondigitalocean.app)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (appUrl) return appUrl.replace(/\/$/, "");
  // Unknown host: same-origin so CSS/JS load from the same domain
  return "";
}

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : getProductionBaseUrl();
