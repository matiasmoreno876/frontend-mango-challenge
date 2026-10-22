'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Handle } from '@/components/atoms/Handle/Handle';
import { Track } from '@/components/atoms/Track/Track';
import { CurrencyLabel } from '@/components/atoms/CurrencyLabel/CurrencyLabel';
import { EditableLabel } from '@/components/molecules/EditableLabel/EditableLabel';
import { formatCurrency } from '@/domain/currency';
import { moveHandle, nearestHandle, percentToValue, valueToPercent, type Handle as HandleName, type RangeValue } from '@/domain/range';

type NormalRangeProps = { min: number; max: number; defaultValue?: RangeValue; values?: never };
type FixedRangeProps = { values: readonly number[]; min?: never; max?: never; defaultValue?: never };
type RangeProps = (NormalRangeProps | FixedRangeProps) & { onChange?: (value: RangeValue) => void };

const HANDLE_LABELS: Record<HandleName, string> = { lower: 'Minimum value', upper: 'Maximum value' };

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

export function Range(props: RangeProps) {
  const { values, onChange } = props;
  const min = values ? 0 : props.min;
  const max = values ? values.length - 1 : props.max;
  const toValue = (position: number) => (values ? values[position] : position);

  const [positions, setPositions] = useState<RangeValue>(props.defaultValue ?? [min, max]);
  const [dragging, setDragging] = useState<HandleName | 'either' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [lower, upper] = positions;
  const pageStep = Math.max(1, Math.round((max - min) / 10));

  function update(handle: HandleName, next: number) {
    const nextValue = moveHandle(positions, handle, next, { min, max });
    if (nextValue[0] === lower && nextValue[1] === upper) return;
    setPositions(nextValue);
    onChange?.([toValue(nextValue[0]), toValue(nextValue[1])]);
  }

  function valueAtPointer(clientX: number): number {
    const { left, width } = trackRef.current!.getBoundingClientRect();
    return Math.round(percentToValue(((clientX - left) / width) * 100, min, max));
  }

  function handlePointerDown(handle: HandleName, event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
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
        value={toValue(position)}
        min={toValue(isLower ? min : lower)}
        max={toValue(isLower ? upper : max)}
        valueText={formatCurrency(toValue(position))}
        percent={valueToPercent(position, min, max)}
        isDragging={dragging === handle}
        onPointerDown={(event) => handlePointerDown(handle, event)}
        onKeyDown={(event) => handleKeyDown(handle, event)}
      />
    );
  }

  function renderLabel(handle: HandleName) {
    const position = handle === 'lower' ? lower : upper;
    if (values) return <CurrencyLabel value={toValue(position)} />;
    return <EditableLabel label={HANDLE_LABELS[handle]} value={position} onCommit={(next) => update(handle, next)} />;
  }

  return (
    <div
      className="flex items-center gap-4 py-4 select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragging(null)}
      onPointerCancel={() => setDragging(null)}
    >
      <div className="flex w-20 flex-none justify-end">{renderLabel('lower')}</div>
      <Track ref={trackRef} onPointerDown={handleTrackPointerDown}>
        {renderHandle('lower')}
        {renderHandle('upper')}
      </Track>
      <div className="flex w-20 flex-none">{renderLabel('upper')}</div>
    </div>
  );
}
