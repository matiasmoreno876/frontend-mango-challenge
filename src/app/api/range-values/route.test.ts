import { GET } from './route';

describe('GET /api/range-values', () => {
  it('returns the allowed values of the fixed range', async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] });
  });
});
