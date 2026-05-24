interface OperationSelectorProps {
  value: 'add' | 'subtract' | 'divide';
  onChange: (operation: 'add' | 'subtract' | 'divide') => void;
}

const operations = [
  { key: 'add', label: '+', description: 'Add' },
  { key: 'subtract', label: '−', description: 'Subtract' },
  { key: 'divide', label: '÷', description: 'Divide' }
] as const;

export default function OperationSelector({ value, onChange }: OperationSelectorProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-soft">
      <div className="mb-3 text-sm uppercase tracking-[0.24em] text-slate-400">Operation</div>
      <div className="grid grid-cols-3 gap-3">
        {operations.map((operation) => {
          const active = value === operation.key;
          return (
            <button
              key={operation.key}
              type="button"
              onClick={() => onChange(operation.key)}
              className={`rounded-3xl border p-5 text-2xl font-semibold transition ${
                active
                  ? 'border-accent bg-accent text-slate-950 shadow-xl shadow-violet-500/20'
                  : 'border-white/10 bg-slate-950/70 text-slate-200 hover:border-white/20 hover:bg-slate-900/90'
              }`}
              aria-label={operation.description}
            >
              {operation.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
