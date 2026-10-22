// The mock API lives in this same app; a real backend would only change API_BASE_URL.
const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:8080';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`Request to ${path} failed with status ${response.status}`);
  return response.json();
}

export function getRange(): Promise<{ min: number; max: number }> {
  return getJson('/api/range');
}

export async function getRangeValues(): Promise<number[]> {
  const { rangeValues } = await getJson<{ rangeValues: number[] }>('/api/range-values');
  return rangeValues;
}
