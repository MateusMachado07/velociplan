import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Mark Puppeteer and Chromium as server-only packages so Next.js doesn't
  // try to bundle them for the browser (they only run on the server for PDF generation)
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium", "stripe", "puppeteer"],

  // Fix: tell Turbopack the correct workspace root (avoids the lockfile warning
  // that appears when there is another package-lock.json in a parent folder)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
