import type { PointerEventHandler, ReactNode, Ref } from 'react';

type TrackProps = {
  ref?: Ref<HTMLDivElement>;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  children?: ReactNode;
};

export function Track({ ref, onPointerDown, children }: TrackProps) {
  return (
    <div
      ref={ref}
      className="relative h-[3px] flex-1 cursor-pointer rounded-xs bg-current before:absolute before:inset-x-0 before:-inset-y-2.5"
      onPointerDown={onPointerDown}
    >
      {children}
    </div>
  );
}
