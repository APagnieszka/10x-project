import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

function loadEnvFile(fileName: string): void {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!key) continue;
    if (value.length === 0) continue;

    // Don't override env already provided by shell/CI.
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

// E2E env precedence: dedicated file first, then fallback to local `.env`.
loadEnvFile(".env.e2e.local");
loadEnvFile(".env");

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_KEY for E2E. Create .env.e2e.local (gitignored) and set both variables, or export them in your shell/CI."
  );
}

if (supabaseKey.startsWith("sb_publishable_")) {
  throw new Error(
    "PUBLIC_SUPABASE_KEY looks like a publishable key (sb_publishable_*). For Supabase Auth you need the anon public key (JWT starting with eyJ...). Update .env.e2e.local / environment variables."
  );
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PUBLIC_SUPABASE_URL: supabaseUrl,
      PUBLIC_SUPABASE_KEY: supabaseKey,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
