import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats decimals with a euro suffix, as in the design', () => {
    expect(formatCurrency(5.99)).toBe('5.99€');
  });

  it('omits decimals for whole numbers', () => {
    expect(formatCurrency(1)).toBe('1€');
    expect(formatCurrency(10000)).toBe('10000€');
  });

  it('rounds to at most two decimals', () => {
    expect(formatCurrency(33.3333)).toBe('33.33€');
  });
});
