import { getRange, getRangeValues } from './range';

function mockFetch(body: unknown, ok = true) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(body), { status: ok ? 200 : 500 }));
}

afterEach(() => vi.restoreAllMocks());

describe('range service', () => {
  it('fetches the normal range from the mock API', async () => {
    const fetchSpy = mockFetch({ min: 1, max: 100 });

    await expect(getRange()).resolves.toEqual({ min: 1, max: 100 });
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:8080/api/range');
  });

  it('fetches the fixed values from the mock API', async () => {
    const fetchSpy = mockFetch({ rangeValues: [1.99, 5.99] });

    await expect(getRangeValues()).resolves.toEqual([1.99, 5.99]);
    expect(fetchSpy).toHaveBeenCalledWith('http://localhost:8080/api/range-values');
  });

  it('fails loudly when the API answers with an error', async () => {
    mockFetch({}, false);

    await expect(getRange()).rejects.toThrow('Request to /api/range failed with status 500');
  });
});
