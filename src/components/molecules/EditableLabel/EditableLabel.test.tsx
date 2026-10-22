import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableLabel } from './EditableLabel';

function setup(onCommit = vi.fn()) {
  render(<EditableLabel label="Minimum value" value={10} onCommit={onCommit} />);
  return { onCommit, user: userEvent.setup() };
}

describe('EditableLabel', () => {
  it('shows the value as a button', () => {
    setup();

    expect(screen.getByRole('button', { name: /edit minimum value/i })).toHaveTextContent('10€');
  });

  it('turns into a focused input with the current value when clicked', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button'));

    const input = screen.getByRole('textbox', { name: 'Minimum value' });
    expect(input).toHaveFocus();
    expect(input).toHaveValue('10');
  });

  it('commits the typed number on Enter and returns focus to the button', async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole('button'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), '42{Enter}');

    expect(onCommit).toHaveBeenCalledWith(42);
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('accepts a comma as decimal separator', async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole('button'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), '5,99{Enter}');

    expect(onCommit).toHaveBeenCalledWith(5.99);
  });

  it('commits when the input loses focus', async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole('button'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), '42');
    await user.tab();

    expect(onCommit).toHaveBeenCalledWith(42);
  });

  it('cancels on Escape without committing', async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole('button'));
    await user.type(screen.getByRole('textbox'), '99{Escape}');

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveTextContent('10€');
  });

  it('ignores input that is not a number', async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole('button'));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'abc{Enter}');

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveTextContent('10€');
  });
});
