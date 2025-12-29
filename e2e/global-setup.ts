import { execSync } from "node:child_process";

function isLocalSupabase(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    const port = parsed.port;
    return (host === "localhost" || host === "127.0.0.1") && port === "54321";
  } catch {
    return false;
  }
}

function run(command: string): void {
  execSync(command, {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });
}

export default async function globalSetup(): Promise<void> {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    // Playwright config already guards this; keeping setup resilient.
    return;
  }

  // Only manage local Supabase automatically. For hosted projects, migrations are managed outside tests.
  if (!isLocalSupabase(supabaseUrl)) {
    return;
  }

  try {
    run("npx supabase status");
  } catch {
    run("npx supabase start");
  }

  // Ensure DB schema is up-to-date (includes RPCs needed by registration).
  run("npx supabase migration up");
}
