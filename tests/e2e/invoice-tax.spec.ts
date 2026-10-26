import { test, expect } from '@playwright/test';
import { InvoicePage } from './pages/InvoicePage.ts';
import { expectSuccessToast } from './helpers/toast.ts';

/**
 * Characterisation tests: lock in how invoice tax behaves today, so any
 * change (like adding a tax cap) shows exactly what it changes.
 */
test.describe('Invoice tax', () => {
  let invoice: InvoicePage;

  test.beforeEach(async ({ page }) => {
    invoice = new InvoicePage(page);
    await invoice.goto();
  });

  test('tax is calculated per line and summed into the invoice total', async () => {
    await invoice.setTax(6);
    await invoice.addLine({ description: 'Annual check-up', qty: 1, unitPrice: 400 });
    await invoice.addLine({ description: 'Vaccination', qty: 1, unitPrice: 300 });

    await expect(invoice.lineTax(0)).toHaveText('24.00');
    await expect(invoice.lineTax(1)).toHaveText('18.00');
    await expect(invoice.totalTax).toHaveText('42.00');
    await expect(invoice.invoiceTotal).toHaveText('742.00');
  });

  test('a negative quantity line reduces tax', async () => {
    await invoice.setTax(6);
    await invoice.addLine({ description: 'Flea treatment', qty: 2, unitPrice: 50 });
    await invoice.addLine({ description: 'Flea treatment (returned)', qty: -1, unitPrice: 50 });

    await expect(invoice.lineTax(1)).toHaveText('-3.00');
    await expect(invoice.totalTax).toHaveText('3.00');
  });

  test('saving shows a success toast', async () => {
    await invoice.addLine({ description: 'Consult', qty: 1, unitPrice: 85 });
    await invoice.save();
    await expectSuccessToast(invoice.page, 'Invoice saved');
  });
});

test.describe('Invoice tax cap', () => {
  const scenarios = [
    { name: 'under the cap', prices: [100, 200], adjustment: '0.00', totalTax: '18.00' },
    { name: 'over the cap', prices: [400, 300], adjustment: '-12.00', totalTax: '30.00' },
    { name: 'exactly on the cap', prices: [500], adjustment: '0.00', totalTax: '30.00' },
  ];

  for (const s of scenarios) {
    test(`6% capped at $500: ${s.name}`, async ({ page }) => {
      const invoice = new InvoicePage(page);
      await invoice.goto();
      await invoice.setTax(6, 500);
      for (const [i, price] of s.prices.entries()) {
        await invoice.addLine({ description: `Item ${i + 1}`, qty: 1, unitPrice: price });
      }
      await expect(invoice.adjustment).toHaveText(s.adjustment);
      await expect(invoice.totalTax).toHaveText(s.totalTax);
    });
  }
});
