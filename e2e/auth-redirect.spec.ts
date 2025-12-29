import { expect, test } from "@playwright/test";

test("unauthenticated user is redirected to login", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/login(\?|$)/);
  await expect(page.locator('[data-slot="card-title"]', { hasText: "Sign In" })).toBeVisible();
  await expect(page.getByLabel("Email *")).toBeVisible();
});
