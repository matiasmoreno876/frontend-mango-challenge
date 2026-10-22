import { render, screen } from '@testing-library/react';
import Exercise2Page from './page';

vi.mock('next/server', () => ({ connection: vi.fn() }));
vi.mock('@/services/range', () => ({ getRangeValues: vi.fn().mockResolvedValue([1.99, 5.99, 70.99]) }));

describe('Exercise 2 page', () => {
  it('renders a fixed values range with the values from the mock API', async () => {
    render(await Exercise2Page());

    expect(screen.getByRole('heading', { name: /fixed values range/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute('aria-valuenow', '1.99');
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute('aria-valuenow', '70.99');
  });
});
