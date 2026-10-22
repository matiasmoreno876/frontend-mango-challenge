const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, useGrouping: false });

export function formatCurrency(value: number): string {
  return `${numberFormat.format(value)}€`;
}
