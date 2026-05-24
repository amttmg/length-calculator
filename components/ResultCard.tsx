interface ResultCardProps {
  displayValue: string;
  expression: string;
  error?: string;
  status: string;
}

export default function ResultCard({ displayValue, expression, error, status }: ResultCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-700 bg-[#0b1220] p-4 shadow-inner shadow-black/35">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate font-mono text-xs text-slate-500">{expression}</p>
        <p className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
          {status}
        </p>
      </div>
      <div className="mt-4 min-h-[88px] rounded-[20px] border border-slate-800 bg-[#111827] px-4 py-5 text-right font-mono text-[clamp(1.75rem,8vw,2.65rem)] font-semibold leading-tight text-emerald-200 shadow-inner shadow-black/40">
        {error ? <span className="text-xl text-rose-300">{error}</span> : displayValue}
      </div>
    </div>
  );
}
