import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export type Line = { description: string; qty: number; unitPrice: number };

/**
 * Page object for the invoice screen.
 * Every locator uses a stable data-testid. No force clicks, no positional
 * picks on ambiguous matches, so tests fail for product reasons, not layout changes.
 */
export class InvoicePage {
  readonly page: Page;
  readonly taxRate: Locator;
  readonly taxCap: Locator;
  readonly lines: Locator;
  readonly subtotal: Locator;
  readonly adjustment: Locator;
  readonly totalTax: Locator;
  readonly invoiceTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taxRate = page.getByTestId('tax-rate');
    this.taxCap = page.getByTestId('tax-cap');
    this.lines = page.getByTestId('invoice-line');
    this.subtotal = page.getByTestId('subtotal');
    this.adjustment = page.getByTestId('tax-adjustment');
    this.totalTax = page.getByTestId('total-tax');
    this.invoiceTotal = page.getByTestId('invoice-total');
  }

  async goto() {
    await this.page.goto('/');
  }

  async setTax(ratePercent: number, cap?: number) {
    await this.taxRate.fill(String(ratePercent));
    await this.taxCap.fill(cap === undefined ? '' : String(cap));
  }

  async addLine({ description, qty, unitPrice }: Line) {
    const before = await this.lines.count();
    await this.page.getByTestId('line-description').fill(description);
    await this.page.getByTestId('line-qty').fill(String(qty));
    await this.page.getByTestId('line-price').fill(String(unitPrice));
    await this.page.getByTestId('add-line').click();
    // Confirm the line landed before moving on, rather than sleeping.
    await expect(this.lines).toHaveCount(before + 1);
  }

  lineTax(index: number) {
    return this.lines.nth(index).locator('td').nth(3);
  }

  async save() {
    await this.page.getByTestId('save-invoice').click();
  }
}
