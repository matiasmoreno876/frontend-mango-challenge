import { render, screen } from '@testing-library/react';
import Exercise1Page from './page';

vi.mock('next/server', () => ({ connection: vi.fn() }));
vi.mock('@/services/range', () => ({ getRange: vi.fn().mockResolvedValue({ min: 1, max: 100 }) }));

describe('Exercise 1 page', () => {
  it('renders a normal range with the bounds from the mock API', async () => {
    render(await Exercise1Page());

    expect(screen.getByRole('heading', { name: /normal range/i })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute('aria-valuenow', '100');
  });
});
