// Matches the design: "5.99€", "1€", "10000€" (no grouping, up to 2 decimals, euro suffix).
const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, useGrouping: false });

export function formatCurrency(value: number): string {
  return `${numberFormat.format(value)}€`;
}
