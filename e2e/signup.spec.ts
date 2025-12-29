import { expect, test } from "@playwright/test";

import { deleteSupabaseUserIfPossible } from "./supabase-admin";

test("user can create account and sign in", async ({ page }) => {
  const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `e2e+${unique}@example.com`;
  const password = "E2eTest!123456";

  try {
    await page.goto("/register");

    // Wait for React island hydration so submit handlers are attached.
    await page.locator('form[data-hydrated="true"]').waitFor({ timeout: 15_000 });

    await page.getByLabel("Email *").fill(email);
    await page.getByLabel("Password *", { exact: true }).fill(password);
    await page.getByLabel("Confirm Password *", { exact: true }).fill(password);

    await page.getByRole("button", { name: "Create Account" }).click();

    // Auth form redirects after success; depending on email confirmation settings
    // we may land on /login (no session) or / (already signed in).
    // If signup fails, we show a toast; fail fast with its content.
    const outcome = await Promise.race([
      page.waitForURL(/\/(login(\?|$)|$)/, { timeout: 15_000 }).then(() => "navigated" as const),
      page
        .locator("h4", { hasText: /^Błąd/ })
        .first()
        .waitFor({ timeout: 10_000 })
        .then(() => "error" as const),
    ]);

    if (outcome === "error") {
      const toastText = await page.locator(".fixed.top-4.right-4").innerText();
      throw new Error(`Signup failed: ${toastText}`);
    }

    // Ensure we can sign in with the newly created credentials.
    await page.goto("/login");

    await page.locator('form[data-hydrated="true"]').waitFor({ timeout: 15_000 });

    await page.getByLabel("Email *").fill(email);
    await page.getByLabel("Password *", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL("/", { timeout: 15_000 });
    await expect(page.locator("h1", { hasText: "Witaj w Foodzilla" })).toBeVisible();

    // Validate that cookie-based session works for protected pages.
    await page.goto("/products/add");
    await expect(page.locator("h1", { hasText: "Add Product" })).toBeVisible();
  } finally {
    await deleteSupabaseUserIfPossible({ email, password });
  }
});
