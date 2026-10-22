import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { CurrencyLabel } from '@/components/atoms/CurrencyLabel/CurrencyLabel';

const BOX =
  'rounded border px-1.5 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

type EditableLabelProps = {
  label: string;
  value: number;
  onCommit: (value: number) => void;
};

export function EditableLabel({ label, value, onCommit }: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (!isEditing && returnFocus.current) {
      returnFocus.current = false;
      buttonRef.current?.focus();
    }
  }, [isEditing]);

  function startEditing() {
    setDraft(String(value));
    setIsEditing(true);
  }

  function commit() {
    const parsed = Number(draft.trim().replace(',', '.'));
    if (draft.trim() !== '' && Number.isFinite(parsed)) onCommit(parsed);
    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' && event.key !== 'Escape') return;
    event.preventDefault();
    returnFocus.current = true;
    if (event.key === 'Enter') commit();
    else setIsEditing(false);
  }

  if (isEditing) {
    return (
      <input
        className={`${BOX} w-20 min-w-10 border-current tabular-nums supports-[field-sizing:content]:w-auto supports-[field-sizing:content]:field-sizing-content`}
        type="text"
        inputMode="decimal"
        aria-label={label}
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
      />
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${BOX} cursor-text border-transparent hover:border-current`}
      onClick={startEditing}
    >
      <span className="sr-only">Edit {label.toLowerCase()}: </span>
      <CurrencyLabel value={value} />
    </button>
  );
}
