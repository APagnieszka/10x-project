import path from "node:path";

import { expect, test } from "@playwright/test";

import { deleteSupabaseUserIfPossible } from "./supabase-admin";

test("barcode scanner can decode from gallery image", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const email = `e2e+${unique}@example.com`;
  const password = "E2eTest!123456";

  const fixturePath = path.join(process.cwd(), "e2e/fixtures/testye2e.png");

  try {
    // Create account
    await page.goto("/register");
    await page.locator('form[data-hydrated="true"]').waitFor({ timeout: 15_000 });

    await page.getByLabel("Email *").fill(email);
    await page.getByLabel("Password *", { exact: true }).fill(password);
    await page.getByLabel("Confirm Password *", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();

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

    // Sign in
    await page.goto("/login");
    await page.locator('form[data-hydrated="true"]').waitFor({ timeout: 15_000 });

    await page.getByLabel("Email *").fill(email);
    await page.getByLabel("Password *", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL("/", { timeout: 15_000 });

    // Go to add product page
    await page.goto("/products/add");
    await page.locator('div[data-hydrated="true"]').first().waitFor({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: /Skanuj kod kreskowy/ })).toBeVisible({ timeout: 15_000 });

    // Stub Open Food Facts lookup to avoid flaky network calls.
    await page.route(/https:\/\/world\.openfoodfacts\.org\/api\/v2\/product\/.*\.json/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: 0,
          status_verbose: "product not found",
        }),
      });
    });

    // Open barcode scanner
    await page.getByRole("button", { name: /Skanuj kod kreskowy/ }).click();

    // Wait until scanner is mounted (file input exists), then choose gallery.
    const fileInput = page.locator('input[type="file"][aria-label="Wybierz zdjęcie z galerii"]');
    await fileInput.waitFor({ state: "attached", timeout: 15_000 });

    // Select gallery mode and upload fixture image
    await page.getByRole("button", { name: /Wybierz z galerii/ }).click();
    await fileInput.setInputFiles(fixturePath);

    // Draw a central ROI to help decoding (real-world photos often include lots of background).
    const roiOverlay = page.getByLabel("Zaznacz obszar kodu kreskowego");
    await expect(roiOverlay).toBeVisible({ timeout: 15_000 });

    const roiBox = await roiOverlay.boundingBox();
    if (!roiBox) {
      await page.screenshot({ path: testInfo.outputPath("roi-overlay-missing.png"), fullPage: true });
      throw new Error("ROI overlay bounding box is not available.");
    }

    await page.mouse.move(roiBox.x + roiBox.width * 0.05, roiBox.y + roiBox.height * 0.35);
    await page.mouse.down();
    await page.mouse.move(roiBox.x + roiBox.width * 0.95, roiBox.y + roiBox.height * 0.65);
    await page.mouse.up();

    await page.getByRole("button", { name: "Skanuj zaznaczenie" }).click();

    const detected = page.locator("p", { hasText: "Kod kreskowy wykryty:" });

    try {
      await expect(detected).toBeVisible({ timeout: 30_000 });
    } catch {
      await page.screenshot({ path: testInfo.outputPath("barcode-decode-failed.png"), fullPage: true });
      throw new Error("Barcode was not detected from gallery image within timeout.");
    }

    const detectedText = await detected.innerText();
    const match = detectedText.match(/Kod kreskowy wykryty:\s*(\d+)/);
    if (!match) {
      await page.screenshot({ path: testInfo.outputPath("barcode-parse-failed.png"), fullPage: true });
      throw new Error(`Could not parse barcode from text: ${detectedText}`);
    }

    const barcode = match[1];

    // Apply barcode and ensure it populates the form
    await page.getByRole("button", { name: /Zastosuj kod kreskowy/ }).click();

    await expect(page.getByText("Szybkie akcje")).toBeVisible({ timeout: 15_000 });

    const barcodeInput = page.getByLabel("Kod kreskowy");
    await expect(barcodeInput).toHaveValue(barcode, { timeout: 15_000 });
  } finally {
    await deleteSupabaseUserIfPossible({ email, password });
  }
});
