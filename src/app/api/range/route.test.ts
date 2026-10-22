import { GET } from './route';

describe('GET /api/range', () => {
  it('returns the min and max of the normal range', async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ min: 1, max: 100 });
  });
});
