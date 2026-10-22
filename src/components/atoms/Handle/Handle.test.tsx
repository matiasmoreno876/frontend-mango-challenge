import { fireEvent, render, screen } from '@testing-library/react';
import { Handle } from './Handle';

const baseProps = {
  label: 'Minimum price',
  value: 25,
  min: 1,
  max: 80,
  valueText: '25€',
  percent: 25,
};

describe('Handle', () => {
  it('is a focusable slider exposing its value to assistive technologies', () => {
    render(<Handle {...baseProps} />);

    const slider = screen.getByRole('slider', { name: 'Minimum price' });
    expect(slider).toHaveAttribute('tabindex', '0');
    expect(slider).toHaveAttribute('aria-valuenow', '25');
    expect(slider).toHaveAttribute('aria-valuemin', '1');
    expect(slider).toHaveAttribute('aria-valuemax', '80');
    expect(slider).toHaveAttribute('aria-valuetext', '25€');
  });

  it('is positioned on the line by its percentage', () => {
    render(<Handle {...baseProps} />);

    expect(screen.getByRole('slider')).toHaveStyle({ left: '25%' });
  });

  it('marks itself while being dragged (drives the dragging cursor)', () => {
    const { rerender } = render(<Handle {...baseProps} />);
    expect(screen.getByRole('slider')).not.toHaveAttribute('data-dragging');

    rerender(<Handle {...baseProps} isDragging />);
    expect(screen.getByRole('slider')).toHaveAttribute('data-dragging', 'true');
  });

  it('forwards pointer and keyboard events to its owner', () => {
    const onPointerDown = vi.fn();
    const onKeyDown = vi.fn();
    render(<Handle {...baseProps} onPointerDown={onPointerDown} onKeyDown={onKeyDown} />);

    const slider = screen.getByRole('slider');
    fireEvent.pointerDown(slider);
    fireEvent.keyDown(slider, { key: 'ArrowRight' });

    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });
});
