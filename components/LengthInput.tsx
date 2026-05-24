interface LengthInputProps {
  label: string;
  feet: string;
  inches: string;
  onChange: (next: { feet: string; inches: string }) => void;
  error?: string;
  activePart?: 'feet' | 'inches';
  onFocusPart?: (part: 'feet' | 'inches') => void;
}

export default function LengthInput({
  label,
  feet,
  inches,
  onChange,
  error,
  activePart,
  onFocusPart
}: LengthInputProps) {
  return (
    <div className="space-y-2 rounded-[24px] border border-slate-800 bg-slate-950/45 p-3">
      <div className="flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        <span>{label}</span>
        {error ? <span className="text-rose-300">{error}</span> : null}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label
          className={`block rounded-[18px] border p-3 transition ${
            activePart === 'feet'
              ? 'border-amber-300 bg-amber-300/10 shadow-[0_0_0_1px_rgba(252,211,77,0.35)]'
              : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
          }`}
        >
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Feet</span>
          <input
            type="number"
            inputMode="decimal"
            step="1"
            min="0"
            value={feet}
            onFocus={() => onFocusPart?.('feet')}
            onChange={(event) => onChange({ feet: event.target.value, inches })}
            className="mt-1 w-full bg-transparent text-2xl font-semibold text-slate-50 outline-none"
            placeholder="0"
          />
        </label>
        <label
          className={`block rounded-[18px] border p-3 transition ${
            activePart === 'inches'
              ? 'border-amber-300 bg-amber-300/10 shadow-[0_0_0_1px_rgba(252,211,77,0.35)]'
              : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
          }`}
        >
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Inches</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.25"
            min="0"
            value={inches}
            onFocus={() => onFocusPart?.('inches')}
            onChange={(event) => onChange({ feet, inches: event.target.value })}
            className="mt-1 w-full bg-transparent text-2xl font-semibold text-slate-50 outline-none"
            placeholder="0"
          />
        </label>
      </div>
    </div>
  );
}
