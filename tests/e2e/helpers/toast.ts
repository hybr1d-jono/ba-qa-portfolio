import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Wait for the success toast after a save.
 *
 * Uses a web-first assertion with a realistic timeout instead of a fixed
 * 1 second wait. A short hard-coded timeout in one shared helper can make
 * every test that uses it flaky at once. See docs/mr-writeups.md, MR 2.
 */
export async function expectSuccessToast(page: Page, message: string | RegExp, timeout = 10_000) {
  const toast = page.getByTestId('toast-success');
  await expect(toast).toBeVisible({ timeout });
  await expect(toast).toHaveText(message);
}
