import { render, screen } from '@testing-library/react';
import { CurrencyLabel } from './CurrencyLabel';

describe('CurrencyLabel', () => {
  it('renders the value as currency', () => {
    render(<CurrencyLabel value={70.99} />);

    expect(screen.getByText('70.99€')).toBeInTheDocument();
  });
});
