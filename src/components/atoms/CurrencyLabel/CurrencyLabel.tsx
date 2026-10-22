import { formatCurrency } from '@/domain/currency';

type CurrencyLabelProps = { value: number };

export function CurrencyLabel({ value }: CurrencyLabelProps) {
  return <span className="text-sm whitespace-nowrap tabular-nums">{formatCurrency(value)}</span>;
}
