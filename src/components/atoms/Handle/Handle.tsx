import type { KeyboardEventHandler, PointerEventHandler } from 'react';

type HandleProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  valueText: string;
  percent: number;
  isDragging?: boolean;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
};

export function Handle({
  label,
  value,
  min,
  max,
  valueText,
  percent,
  isDragging = false,
  onPointerDown,
  onKeyDown,
}: HandleProps) {
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={valueText}
      data-dragging={isDragging || undefined}
      // before: invisible 24x24 hit area (WCAG 2.5.8). touch-none: Pointer Events drive dragging, so touch
      // scrolling must not steal the gesture.
      className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full bg-current transition-transform duration-120 ease-out before:absolute before:-inset-1 before:rounded-full hover:scale-140 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-current data-dragging:scale-140 data-dragging:cursor-grabbing motion-reduce:transition-none"
      style={{ left: `${percent}%` }}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    />
  );
}
