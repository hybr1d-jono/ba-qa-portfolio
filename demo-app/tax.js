// Invoice tax logic for the ClinicBill demo app.
// Tax is worked out per line and rounded to the cent, then summed.
// An optional invoice-level cap taxes only the first N dollars of the
// taxable total. The difference goes on a single adjustment line so the
// per-line tax figures (used by reports) never change.

export function round2(value) {
  // Round half away from zero to the nearest cent.
  const sign = Math.sign(value);
  return (sign * Math.round(Math.abs(value) * 100 + 1e-9)) / 100;
}

export function calculateInvoice(lines, { ratePercent, cap = null }) {
  const rate = ratePercent / 100;

  const pricedLines = lines.map((line) => {
    const net = round2(line.qty * line.unitPrice);
    return { ...line, net, tax: round2(net * rate) };
  });

  const subtotal = round2(pricedLines.reduce((sum, l) => sum + l.net, 0));
  const lineTax = round2(pricedLines.reduce((sum, l) => sum + l.tax, 0));

  let adjustment = 0;
  if (cap !== null && subtotal > cap) {
    adjustment = round2(round2(cap * rate) - lineTax);
  }

  const totalTax = round2(lineTax + adjustment);
  return {
    lines: pricedLines,
    subtotal,
    lineTax,
    adjustment,
    totalTax,
    total: round2(subtotal + totalTax),
  };
}
