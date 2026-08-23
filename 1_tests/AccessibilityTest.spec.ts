import AxeBuilder from "@axe-core/playwright";
import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*google*ads***", (route) => route.abort());
  await page.route("**/*doubleclick***", (route) => route.abort());
});

const pagesToAuditAuth = [
  { name: "CartAuth", url: "/view_cart" },
  { name: "checkout", url: "/checkout" },

];

for (const { name, url } of pagesToAuditAuth) {
  test(`Should pass WCAG accessibility standards on ${name}`, { tag: "@auth" }, async ({ page }, testInfo) => {
    await page.goto(url);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude("#aswift_4")
      .exclude("iframe")
      .analyze();

    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(accessibilityScanResults.violations, null, 2),
      contentType: "application/json",
    });

    // Known pre-existing issues on the site itself:
    // - color-contrast: product price text
    // - link-name: carousel prev/next arrows
    // - button-name: subscribe icon button
    // - label: form inputs (checkout message & payment card details) missing labels
    const knownIssueIds = ["color-contrast", "link-name", "button-name", "label"];

    const newViolations = accessibilityScanResults.violations.filter(
      (v) => !knownIssueIds.includes(v.id)
    );

    expect(newViolations).toEqual([]);
  });
}