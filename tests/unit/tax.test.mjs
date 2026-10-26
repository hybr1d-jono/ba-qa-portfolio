import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateInvoice, round2 } from '../../demo-app/tax.js';

const sixPercent = { ratePercent: 6 };

test('tax is worked out per line, then summed', () => {
  const r = calculateInvoice(
    [{ description: 'A', qty: 1, unitPrice: 400 }, { description: 'B', qty: 1, unitPrice: 300 }],
    sixPercent,
  );
  assert.deepEqual(r.lines.map((l) => l.tax), [24, 18]);
  assert.equal(r.totalTax, 42);
});

test('a negative quantity line carries negative tax', () => {
  const r = calculateInvoice(
    [{ description: 'A', qty: 2, unitPrice: 50 }, { description: 'Return', qty: -1, unitPrice: 50 }],
    sixPercent,
  );
  assert.equal(r.lines[1].tax, -3);
  assert.equal(r.totalTax, 3);
});

test('half a cent rounds away from zero', () => {
  assert.equal(round2(0.125), 0.13);
  assert.equal(round2(-0.125), -0.13);
});

// The cap scenarios from docs/discovery-invoice-tax-cap.md
test('cap: invoice under the cap is unchanged', () => {
  const r = calculateInvoice(
    [{ description: 'A', qty: 1, unitPrice: 100 }, { description: 'B', qty: 1, unitPrice: 200 }],
    { ...sixPercent, cap: 500 },
  );
  assert.equal(r.adjustment, 0);
  assert.equal(r.totalTax, 18);
});

test('cap: invoice over the cap only taxes the first $500', () => {
  const r = calculateInvoice(
    [{ description: 'A', qty: 1, unitPrice: 400 }, { description: 'B', qty: 1, unitPrice: 300 }],
    { ...sixPercent, cap: 500 },
  );
  assert.equal(r.lineTax, 42);
  assert.equal(r.adjustment, -12);
  assert.equal(r.totalTax, 30);
});

test('cap: invoice exactly on the cap is not adjusted', () => {
  const r = calculateInvoice([{ description: 'A', qty: 1, unitPrice: 500 }], { ...sixPercent, cap: 500 });
  assert.equal(r.adjustment, 0);
  assert.equal(r.totalTax, 30);
});
