export type RangeValue = readonly [lower: number, upper: number];
export type Handle = 'lower' | 'upper';
export type Bounds = { min: number; max: number };

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function valueToPercent(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

export function percentToValue(percent: number, min: number, max: number): number {
  return min + (clamp(percent, 0, 100) / 100) * (max - min);
}

export function moveHandle(range: RangeValue, handle: Handle, next: number, { min, max }: Bounds): RangeValue {
  const [lower, upper] = range;
  return handle === 'lower' ? [clamp(next, min, upper), upper] : [lower, clamp(next, lower, max)];
}

export function nearestHandle([lower, upper]: RangeValue, value: number): Handle {
  if (value < lower) return 'lower';
  if (value > upper) return 'upper';
  return value - lower < upper - value ? 'lower' : 'upper';
}
