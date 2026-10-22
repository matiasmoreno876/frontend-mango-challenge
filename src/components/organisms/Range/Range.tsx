'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Handle } from '@/components/atoms/Handle/Handle';
import { Track } from '@/components/atoms/Track/Track';
import { EditableLabel } from '@/components/molecules/EditableLabel/EditableLabel';
import { formatCurrency } from '@/domain/currency';
import { moveHandle, nearestHandle, percentToValue, valueToPercent, type Handle as HandleName, type RangeValue } from '@/domain/range';

type RangeProps = {
  min: number;
  max: number;
  defaultValue?: RangeValue;
  onChange?: (value: RangeValue) => void;
};

const HANDLE_LABELS: Record<HandleName, string> = { lower: 'Minimum value', upper: 'Maximum value' };

// WAI-ARIA slider keys. Returns null for keys the slider does not handle.
function valueForKey(key: string, current: number, pageStep: number, lowest: number, highest: number): number | null {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return current + 1;
    case 'ArrowLeft':
    case 'ArrowDown':
      return current - 1;
    case 'PageUp':
      return current + pageStep;
    case 'PageDown':
      return current - pageStep;
    case 'Home':
      return lowest;
    case 'End':
      return highest;
    default:
      return null;
  }
}

export function Range({ min, max, defaultValue, onChange }: RangeProps) {
  const [positions, setPositions] = useState<RangeValue>(defaultValue ?? [min, max]);
  // 'either': pressed while both handles overlap; the first move decides which one is dragged.
  const [dragging, setDragging] = useState<HandleName | 'either' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [lower, upper] = positions;
  const pageStep = Math.max(1, Math.round((max - min) / 10));

  function update(handle: HandleName, next: number) {
    const nextValue = moveHandle(positions, handle, next, { min, max });
    if (nextValue[0] === lower && nextValue[1] === upper) return;
    setPositions(nextValue);
    onChange?.(nextValue);
  }

  function valueAtPointer(clientX: number): number {
    const { left, width } = trackRef.current!.getBoundingClientRect();
    return Math.round(percentToValue(((clientX - left) / width) * 100, min, max));
  }

  function handlePointerDown(handle: HandleName, event: PointerEvent<HTMLDivElement>) {
    // Capture keeps move/up events (and the grabbing cursor) on the handle even when the pointer leaves it.
    event.currentTarget.setPointerCapture(event.pointerId);
    // Overlapping handles: only the top one can be pressed, so let the drag direction pick.
    setDragging(lower === upper ? 'either' : handle);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const next = valueAtPointer(event.clientX);
    const handle = dragging === 'either' ? nearestHandle(positions, next) : dragging;
    if (handle !== dragging) setDragging(handle);
    update(handle, next);
  }

  function handleTrackPointerDown(event: PointerEvent<HTMLDivElement>) {
    // Presses on a handle bubble up here too; only bare clicks on the line move a handle.
    if (event.target !== event.currentTarget) return;
    const next = valueAtPointer(event.clientX);
    update(nearestHandle(positions, next), next);
  }

  function handleKeyDown(handle: HandleName, event: KeyboardEvent<HTMLDivElement>) {
    const isLower = handle === 'lower';
    const next = valueForKey(event.key, isLower ? lower : upper, pageStep, isLower ? min : lower, isLower ? upper : max);
    if (next === null) return;
    event.preventDefault();
    update(handle, next);
  }

  function renderHandle(handle: HandleName) {
    const isLower = handle === 'lower';
    const position = isLower ? lower : upper;
    return (
      <Handle
        label={HANDLE_LABELS[handle]}
        value={position}
        min={isLower ? min : lower}
        max={isLower ? upper : max}
        valueText={formatCurrency(position)}
        percent={valueToPercent(position, min, max)}
        isDragging={dragging === handle}
        onPointerDown={(event) => handlePointerDown(handle, event)}
        onKeyDown={(event) => handleKeyDown(handle, event)}
      />
    );
  }

  function renderLabel(handle: HandleName) {
    const position = handle === 'lower' ? lower : upper;
    return <EditableLabel label={HANDLE_LABELS[handle]} value={position} onCommit={(next) => update(handle, next)} />;
  }

  return (
    <div
      className="flex items-center gap-4 py-4 select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragging(null)}
      onPointerCancel={() => setDragging(null)}
    >
      {/* Fixed-width slots: label text changes width with the value ("1€" → "100€"); without this the line shifts. */}
      <div className="flex w-20 flex-none justify-end">{renderLabel('lower')}</div>
      <Track ref={trackRef} onPointerDown={handleTrackPointerDown}>
        {renderHandle('lower')}
        {renderHandle('upper')}
      </Track>
      <div className="flex w-20 flex-none">{renderLabel('upper')}</div>
    </div>
  );
}
