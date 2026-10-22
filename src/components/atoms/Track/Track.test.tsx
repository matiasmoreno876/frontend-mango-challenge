import { fireEvent, render, screen } from '@testing-library/react';
import { Track } from './Track';

describe('Track', () => {
  it('renders its children (the handles) on the line', () => {
    render(
      <Track>
        <span>handle</span>
      </Track>,
    );

    expect(screen.getByText('handle')).toBeInTheDocument();
  });

  it('exposes its element through ref so the range can measure it', () => {
    let element: HTMLDivElement | null = null;
    render(<Track ref={(node) => { element = node; }} />);

    expect(element).toBeInstanceOf(HTMLDivElement);
  });

  it('forwards pointer down so the range can react to clicks on the line', () => {
    const onPointerDown = vi.fn();
    render(<Track onPointerDown={onPointerDown}><span>handle</span></Track>);

    fireEvent.pointerDown(screen.getByText('handle').parentElement!);

    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });
});
