import { clamp, moveHandle, nearestHandle, percentToValue, valueToPercent } from './range';

describe('clamp', () => {
  it('keeps a value inside the bounds unchanged', () => {
    expect(clamp(50, 1, 100)).toBe(50);
  });

  it('never returns less than the minimum', () => {
    expect(clamp(-5, 1, 100)).toBe(1);
  });

  it('never returns more than the maximum', () => {
    expect(clamp(150, 1, 100)).toBe(100);
  });
});

describe('valueToPercent', () => {
  it('maps the bounds to 0 and 100', () => {
    expect(valueToPercent(1, 1, 100)).toBe(0);
    expect(valueToPercent(100, 1, 100)).toBe(100);
  });

  it('maps an inner value proportionally', () => {
    expect(valueToPercent(50, 0, 200)).toBe(25);
  });

  it('returns 0 when min equals max instead of dividing by zero', () => {
    expect(valueToPercent(10, 10, 10)).toBe(0);
  });
});

describe('percentToValue', () => {
  it('maps a percentage back to a value', () => {
    expect(percentToValue(25, 0, 200)).toBe(50);
  });

  it('clamps percentages outside 0..100 (pointer dragged past the track)', () => {
    expect(percentToValue(-20, 1, 100)).toBe(1);
    expect(percentToValue(120, 1, 100)).toBe(100);
  });
});

describe('moveHandle', () => {
  const bounds = { min: 1, max: 100 };

  it('moves the lower handle within its range', () => {
    expect(moveHandle([10, 80], 'lower', 30, bounds)).toEqual([30, 80]);
  });

  it('moves the upper handle within its range', () => {
    expect(moveHandle([10, 80], 'upper', 60, bounds)).toEqual([10, 60]);
  });

  it('stops the lower handle at the upper handle (they can touch, never cross)', () => {
    expect(moveHandle([10, 80], 'lower', 95, bounds)).toEqual([80, 80]);
  });

  it('stops the upper handle at the lower handle (they can touch, never cross)', () => {
    expect(moveHandle([10, 80], 'upper', 5, bounds)).toEqual([10, 10]);
  });

  it('never moves a handle outside the bounds', () => {
    expect(moveHandle([10, 80], 'lower', -50, bounds)).toEqual([1, 80]);
    expect(moveHandle([10, 80], 'upper', 500, bounds)).toEqual([10, 100]);
  });
});

describe('nearestHandle', () => {
  it('picks the handle closest to the value', () => {
    expect(nearestHandle([20, 60], 30)).toBe('lower');
    expect(nearestHandle([20, 60], 50)).toBe('upper');
  });

  it('picks the handle that can move there when both handles overlap', () => {
    expect(nearestHandle([50, 50], 10)).toBe('lower');
    expect(nearestHandle([50, 50], 90)).toBe('upper');
  });
});
