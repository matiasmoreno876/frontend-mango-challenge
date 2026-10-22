import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('links to both exercises', () => {
    render(<Home />);

    expect(screen.getByRole('link', { name: /exercise 1/i })).toHaveAttribute('href', '/exercise1');
    expect(screen.getByRole('link', { name: /exercise 2/i })).toHaveAttribute('href', '/exercise2');
  });
});
