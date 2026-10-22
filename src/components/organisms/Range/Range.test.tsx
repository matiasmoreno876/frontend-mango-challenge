import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Range } from './Range';

const lower = () => screen.getByRole('slider', { name: 'Minimum value' });
const upper = () => screen.getByRole('slider', { name: 'Maximum value' });

// jsdom has no layout: give the track a 0..100px box so clientX maps 1:1 to percent.
function mockTrackBox() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 0, width: 100, top: 0, height: 4, right: 100, bottom: 4, x: 0, y: 0, toJSON: () => ({}),
  });
}

afterEach(() => vi.restoreAllMocks());

describe('Range (normal mode)', () => {
  it('starts with the handles at the bounds and shows both values as labels', () => {
    render(<Range min={1} max={100} />);

    expect(lower()).toHaveAttribute('aria-valuenow', '1');
    expect(upper()).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('1€')).toBeInTheDocument();
    expect(screen.getByText('100€')).toBeInTheDocument();
  });

  it('starts from defaultValue when given', () => {
    render(<Range min={1} max={100} defaultValue={[20, 70]} />);

    expect(lower()).toHaveAttribute('aria-valuenow', '20');
    expect(upper()).toHaveAttribute('aria-valuenow', '70');
  });

  it('limits each handle by the other one for assistive technologies (multi-thumb pattern)', () => {
    render(<Range min={1} max={100} defaultValue={[20, 70]} />);

    expect(lower()).toHaveAttribute('aria-valuemin', '1');
    expect(lower()).toHaveAttribute('aria-valuemax', '70');
    expect(upper()).toHaveAttribute('aria-valuemin', '20');
    expect(upper()).toHaveAttribute('aria-valuemax', '100');
  });

  describe('keyboard', () => {
    it('moves a handle by 1 with the arrow keys', () => {
      render(<Range min={1} max={100} defaultValue={[20, 70]} />);

      fireEvent.keyDown(lower(), { key: 'ArrowRight' });
      fireEvent.keyDown(upper(), { key: 'ArrowDown' });

      expect(lower()).toHaveAttribute('aria-valuenow', '21');
      expect(upper()).toHaveAttribute('aria-valuenow', '69');
    });

    it('moves a handle by 10% of the range with PageUp/PageDown', () => {
      render(<Range min={0} max={100} defaultValue={[20, 70]} />);

      fireEvent.keyDown(lower(), { key: 'PageUp' });
      fireEvent.keyDown(upper(), { key: 'PageDown' });

      expect(lower()).toHaveAttribute('aria-valuenow', '30');
      expect(upper()).toHaveAttribute('aria-valuenow', '60');
    });

    it('jumps to the furthest allowed value with Home/End', () => {
      render(<Range min={1} max={100} defaultValue={[20, 70]} />);

      fireEvent.keyDown(lower(), { key: 'Home' });
      fireEvent.keyDown(upper(), { key: 'End' });

      expect(lower()).toHaveAttribute('aria-valuenow', '1');
      expect(upper()).toHaveAttribute('aria-valuenow', '100');
    });

    it('never goes outside the bounds', () => {
      render(<Range min={1} max={100} />);

      fireEvent.keyDown(lower(), { key: 'ArrowLeft' });
      fireEvent.keyDown(upper(), { key: 'ArrowRight' });

      expect(lower()).toHaveAttribute('aria-valuenow', '1');
      expect(upper()).toHaveAttribute('aria-valuenow', '100');
    });

    it('stops a handle at the other one instead of crossing it', () => {
      render(<Range min={1} max={100} defaultValue={[20, 70]} />);

      fireEvent.keyDown(lower(), { key: 'End' });

      expect(lower()).toHaveAttribute('aria-valuenow', '70');
      expect(upper()).toHaveAttribute('aria-valuenow', '70');
    });
  });

  describe('pointer drag', () => {
    it('moves the dragged handle to the pointer position, rounded to an integer', () => {
      mockTrackBox();
      render(<Range min={0} max={100} />);

      fireEvent.pointerDown(upper(), { pointerId: 1, clientX: 100 });
      fireEvent.pointerMove(upper(), { pointerId: 1, clientX: 42.4 });

      expect(upper()).toHaveAttribute('aria-valuenow', '42');
    });

    it('marks the handle as dragging until the pointer is released', () => {
      mockTrackBox();
      render(<Range min={0} max={100} />);

      fireEvent.pointerDown(lower(), { pointerId: 1, clientX: 0 });
      expect(lower()).toHaveAttribute('data-dragging', 'true');

      fireEvent.pointerUp(lower(), { pointerId: 1 });
      expect(lower()).not.toHaveAttribute('data-dragging');
    });

    it('ignores pointer moves when no handle is being dragged', () => {
      mockTrackBox();
      render(<Range min={0} max={100} />);

      fireEvent.pointerMove(lower(), { pointerId: 1, clientX: 50 });

      expect(lower()).toHaveAttribute('aria-valuenow', '0');
    });

    it('drags the handle that can move when both overlap (the bottom one is unreachable)', () => {
      mockTrackBox();
      render(<Range min={0} max={100} defaultValue={[50, 50]} />);

      // The upper handle is rendered on top, so it is the one that receives the press.
      fireEvent.pointerDown(upper(), { pointerId: 1, clientX: 50 });
      fireEvent.pointerMove(upper(), { pointerId: 1, clientX: 30 });

      expect(lower()).toHaveAttribute('aria-valuenow', '30');
      expect(upper()).toHaveAttribute('aria-valuenow', '50');
    });

    it('keeps the dragged lower handle stopped at the upper one when the pointer keeps going right', () => {
      mockTrackBox();
      render(<Range min={0} max={100} defaultValue={[20, 60]} />);

      fireEvent.pointerDown(lower(), { pointerId: 1, clientX: 20 });
      fireEvent.pointerMove(lower(), { pointerId: 1, clientX: 60 });
      fireEvent.pointerMove(lower(), { pointerId: 1, clientX: 80 });

      expect(lower()).toHaveAttribute('aria-valuenow', '60');
      expect(upper()).toHaveAttribute('aria-valuenow', '60');
    });

    it('keeps the dragged upper handle stopped at the lower one when the pointer keeps going left', () => {
      mockTrackBox();
      render(<Range min={0} max={100} defaultValue={[20, 60]} />);

      fireEvent.pointerDown(upper(), { pointerId: 1, clientX: 60 });
      fireEvent.pointerMove(upper(), { pointerId: 1, clientX: 20 });
      fireEvent.pointerMove(upper(), { pointerId: 1, clientX: 5 });

      expect(lower()).toHaveAttribute('aria-valuenow', '20');
      expect(upper()).toHaveAttribute('aria-valuenow', '20');
    });

    it('stops the dragged handle at the other one instead of crossing it', () => {
      mockTrackBox();
      render(<Range min={0} max={100} defaultValue={[20, 60]} />);

      fireEvent.pointerDown(lower(), { pointerId: 1, clientX: 20 });
      fireEvent.pointerMove(lower(), { pointerId: 1, clientX: 90 });

      expect(lower()).toHaveAttribute('aria-valuenow', '60');
    });
  });

  it('notifies changes through onChange', () => {
    const onChange = vi.fn();
    render(<Range min={1} max={100} defaultValue={[20, 70]} onChange={onChange} />);

    fireEvent.keyDown(lower(), { key: 'ArrowRight' });

    expect(onChange).toHaveBeenCalledWith([21, 70]);
  });

  it('does not notify when a key leaves the value unchanged', () => {
    const onChange = vi.fn();
    render(<Range min={1} max={100} onChange={onChange} />);

    fireEvent.keyDown(lower(), { key: 'ArrowLeft' });
    fireEvent.keyDown(lower(), { key: 'Tab' });

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Range (normal mode) editable labels', () => {
  async function editLabel(name: RegExp, text: string) {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), `${text}{Enter}`);
  }

  it('moves a handle to the value typed in its label', async () => {
    render(<Range min={1} max={100} defaultValue={[20, 70]} />);

    await editLabel(/edit minimum value/i, '30');

    expect(lower()).toHaveAttribute('aria-valuenow', '30');
  });

  it('never sets a typed value outside the bounds', async () => {
    render(<Range min={1} max={100} />);

    await editLabel(/edit maximum value/i, '500');

    expect(upper()).toHaveAttribute('aria-valuenow', '100');
  });

  it('never lets a typed value cross the other handle', async () => {
    render(<Range min={1} max={100} defaultValue={[20, 70]} />);

    await editLabel(/edit minimum value/i, '90');

    expect(lower()).toHaveAttribute('aria-valuenow', '70');
  });
});

describe('Range click on the line (single-pointer alternative to dragging)', () => {
  const track = () => lower().parentElement!;

  it('moves the nearest handle to the clicked position', () => {
    mockTrackBox();
    render(<Range min={0} max={100} defaultValue={[20, 60]} />);

    fireEvent.pointerDown(track(), { pointerId: 1, clientX: 90 });
    fireEvent.pointerDown(track(), { pointerId: 1, clientX: 10 });

    expect(upper()).toHaveAttribute('aria-valuenow', '90');
    expect(lower()).toHaveAttribute('aria-valuenow', '10');
  });

  it('does not jump when the press starts on a handle', () => {
    mockTrackBox();
    render(<Range min={0} max={100} defaultValue={[20, 60]} />);

    fireEvent.pointerDown(lower(), { pointerId: 1, clientX: 23 });

    expect(lower()).toHaveAttribute('aria-valuenow', '20');
  });
});
