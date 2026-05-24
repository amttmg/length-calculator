'use client';

import { useMemo, useState } from 'react';
import LengthInput from './LengthInput';
import ResultCard from './ResultCard';

type Operation = 'add' | 'subtract';
type ActivePart = 'feet' | 'inches';
type Term = {
  operation: Operation;
  label: string;
  totalInches: number;
};

const digitKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3'] as const;

const parseValue = (value: string) => {
  if (value.trim() === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const normalizeLength = (totalInches: number) => {
  const negative = totalInches < 0;
  const absolute = Math.abs(totalInches);
  const feet = Math.floor(absolute / 12);
  let inches = Number((absolute % 12).toFixed(2));
  if (inches >= 12) {
    inches = 0;
    return { feet: feet + 1, inches, negative };
  }
  return { feet, inches, negative };
};

const formatLength = (totalInches: number) => {
  const { feet, inches, negative } = normalizeLength(totalInches);
  const sign = negative ? '-' : '';
  const inchLabel = inches === 1 ? 'inch' : 'inches';
  const footLabel = feet === 1 ? 'ft' : 'ft';
  return `${sign}${feet} ${footLabel} ${inches.toFixed(2).replace(/\.00$/, '')} ${inchLabel}`;
};

const formatRawLength = (feetValue: string, inchesValue: string) => {
  const feet = feetValue.trim() === '' ? '0' : feetValue;
  const inches = inchesValue.trim() === '' ? '0' : inchesValue;
  return `${feet} ft ${inches} in`;
};

const lengthToInches = (feetValue: string, inchesValue: string) => {
  const feet = parseValue(feetValue);
  const inches = parseValue(inchesValue);
  if (Number.isNaN(feet) || Number.isNaN(inches) || feet < 0 || inches < 0) {
    return NaN;
  }
  return feet * 12 + inches;
};

export default function CalculatorPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [pendingOperation, setPendingOperation] = useState<Operation>('add');
  const [currentFeet, setCurrentFeet] = useState('');
  const [currentInches, setCurrentInches] = useState('');
  const [activePart, setActivePart] = useState<ActivePart>('feet');
  const [result, setResult] = useState<string | undefined>();
  const [resultTotalInches, setResultTotalInches] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [justCalculated, setJustCalculated] = useState(false);

  const hasCurrentValue = currentFeet.trim() !== '' || currentInches.trim() !== '';

  const expression = useMemo(() => {
    const committed = terms
      .map((term, index) => {
        const operator = index === 0 ? '' : term.operation === 'add' ? '+ ' : '- ';
        return `${operator}${term.label}`;
      })
      .join(' ');

    if (justCalculated) {
      return committed || 'Result';
    }

    if (hasCurrentValue) {
      const currentLabel = formatRawLength(currentFeet, currentInches);
      if (committed === '') return currentLabel;
      return `${committed} ${pendingOperation === 'add' ? '+ ' : '- '}${currentLabel}`;
    }

    if (committed !== '') {
      return `${committed} ${pendingOperation === 'add' ? '+' : '-'}`;
    }

    return '0 ft 0 in';
  }, [currentFeet, currentInches, hasCurrentValue, justCalculated, pendingOperation, terms]);

  const displayValue = justCalculated && result ? result : formatRawLength(currentFeet, currentInches);
  const activeLabel = activePart === 'feet' ? 'Feet' : 'Inches';
  const activeValue = activePart === 'feet' ? currentFeet : currentInches;
  const status = justCalculated ? 'Total' : activeLabel;

  const resetCalculator = () => {
    setTerms([]);
    setPendingOperation('add');
    setCurrentFeet('');
    setCurrentInches('');
    setActivePart('feet');
    setResult(undefined);
    setResultTotalInches(undefined);
    setError(undefined);
    setJustCalculated(false);
  };

  const prepareForNewInput = () => {
    if (!justCalculated) return;
    setTerms([]);
    setPendingOperation('add');
    setResult(undefined);
    setResultTotalInches(undefined);
    setError(undefined);
    setJustCalculated(false);
  };

  const buildCurrentTerm = (): Term | undefined => {
    const totalInches = lengthToInches(currentFeet, currentInches);
    if (Number.isNaN(totalInches)) {
      setError('Use positive feet and inches.');
      return undefined;
    }

    return {
      operation: terms.length === 0 ? 'add' : pendingOperation,
      label: formatRawLength(currentFeet, currentInches),
      totalInches
    };
  };

  const commitCurrentTerm = () => {
    if (!hasCurrentValue) return true;

    const term = buildCurrentTerm();
    if (!term) return false;

    setTerms((previousTerms) => [...previousTerms, term]);
    setCurrentFeet('');
    setCurrentInches('');
    setResult(undefined);
    setResultTotalInches(undefined);
    setJustCalculated(false);
    setError(undefined);
    return true;
  };

  const calculateTerms = (nextTerms: Term[]) =>
    nextTerms.reduce((total, term, index) => {
      if (index === 0) return total + term.totalInches;
      return term.operation === 'add' ? total + term.totalInches : total - term.totalInches;
    }, 0);

  const chooseOperation = (nextOperation: Operation) => {
    setError(undefined);

    if (justCalculated && resultTotalInches !== undefined) {
      setTerms([{ operation: 'add', label: formatLength(resultTotalInches), totalInches: resultTotalInches }]);
      setCurrentFeet('');
      setCurrentInches('');
      setJustCalculated(false);
      setResult(undefined);
      setPendingOperation(nextOperation);
      setActivePart('feet');
      return;
    }

    if (!commitCurrentTerm()) return;

    setPendingOperation(nextOperation);
    setActivePart('feet');
  };

  const pressEquals = () => {
    setError(undefined);
    const nextTerms = [...terms];

    if (hasCurrentValue) {
      const term = buildCurrentTerm();
      if (!term) return;
      nextTerms.push(term);
    }

    const total = calculateTerms(nextTerms);
    setTerms(nextTerms);
    setCurrentFeet('');
    setCurrentInches('');
    setResult(formatLength(total));
    setResultTotalInches(total);
    setJustCalculated(true);
    setPendingOperation('add');
    setActivePart('feet');
  };

  const pressKey = (key: string) => {
    if (key === 'AC') {
      resetCalculator();
      return;
    }

    if (key === 'feet' || key === 'inches') {
      setActivePart(key);
      return;
    }

    if (key === 'backspace') {
      if (justCalculated) {
        resetCalculator();
        return;
      }
      if (activePart === 'feet') {
        setCurrentFeet((value) => value.slice(0, -1));
      } else {
        setCurrentInches((value) => value.slice(0, -1));
      }
      setError(undefined);
      return;
    }

    prepareForNewInput();

    const currentValue = activePart === 'feet' ? currentFeet : currentInches;

    if (key === '.' && currentValue.includes('.')) {
      return;
    }

    const nextValue = currentValue === '0' && key !== '.' ? key : `${currentValue}${key}`;
    if (activePart === 'feet') {
      setCurrentFeet(nextValue);
    } else {
      setCurrentInches(nextValue);
    }
    setError(undefined);
  };

  const handleCurrentChange = (next: { feet: string; inches: string }) => {
    prepareForNewInput();
    setCurrentFeet(next.feet);
    setCurrentInches(next.inches);
    setResult(undefined);
    setResultTotalInches(undefined);
    setError(undefined);
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center">
        <section className="w-full rounded-[34px] border border-slate-700/80 bg-[#171d29] p-4 shadow-[0_28px_80px_rgba(2,6,23,0.42)] sm:p-5">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Length</p>
              <h1 className="mt-1 text-xl font-semibold text-slate-50">Calculator</h1>
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 font-mono text-xs text-emerald-200">
              ft / in
            </div>
          </div>

          <ResultCard displayValue={displayValue} expression={expression} error={error} status={status} />

          <div className="mt-3 space-y-2">
            <LengthInput
              label="Current entry"
              feet={currentFeet}
              inches={currentInches}
              activePart={activePart}
              onFocusPart={setActivePart}
              onChange={handleCurrentChange}
            />

            <div className="max-h-28 space-y-1 overflow-y-auto rounded-[20px] border border-slate-800 bg-slate-950/45 p-3">
              {terms.length === 0 ? (
                <div className="font-mono text-xs text-slate-600">0 ft 0 in</div>
              ) : (
                terms.map((term, index) => (
                  <div key={`${term.label}-${index}`} className="flex items-center justify-between gap-3 font-mono text-xs text-slate-400">
                    <span>{index === 0 ? '=' : term.operation === 'add' ? '+' : '-'}</span>
                    <span className="truncate">{term.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 rounded-[28px] border border-slate-800 bg-slate-950/60 p-2.5">
            <div className="mb-2 flex items-center justify-between px-2 font-mono text-xs text-slate-500">
              <span>{activeLabel}</span>
              <span>{activeValue || '0'}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button type="button" className="calculator-key calculator-key-muted" onClick={() => pressKey('AC')}>
                AC
              </button>
              <button type="button" className="calculator-key calculator-key-muted" onClick={() => pressKey('backspace')}>
                DEL
              </button>
              <button
                type="button"
                className={`calculator-key calculator-key-unit ${activePart === 'feet' ? 'calculator-key-active' : ''}`}
                onClick={() => pressKey('feet')}
              >
                ft
              </button>
              <button
                type="button"
                className={`calculator-key calculator-key-unit ${activePart === 'inches' ? 'calculator-key-active' : ''}`}
                onClick={() => pressKey('inches')}
              >
                in
              </button>

              {digitKeys.slice(0, 3).map((key) => (
                <button key={key} type="button" className="calculator-key" onClick={() => pressKey(key)}>
                  {key}
                </button>
              ))}
              <button
                type="button"
                className={`calculator-key calculator-key-operator ${pendingOperation === 'add' ? 'calculator-key-active' : ''}`}
                onClick={() => chooseOperation('add')}
                aria-label="Add"
              >
                +
              </button>

              {digitKeys.slice(3, 6).map((key) => (
                <button key={key} type="button" className="calculator-key" onClick={() => pressKey(key)}>
                  {key}
                </button>
              ))}
              <button
                type="button"
                className={`calculator-key calculator-key-operator ${
                  pendingOperation === 'subtract' ? 'calculator-key-active' : ''
                }`}
                onClick={() => chooseOperation('subtract')}
                aria-label="Subtract"
              >
                -
              </button>

              {digitKeys.slice(6, 9).map((key) => (
                <button key={key} type="button" className="calculator-key" onClick={() => pressKey(key)}>
                  {key}
                </button>
              ))}
              <button
                type="button"
                className="calculator-key calculator-key-equals"
                onClick={pressEquals}
                aria-label="Equals"
              >
                =
              </button>

              <button type="button" className="calculator-key col-span-2" onClick={() => pressKey('0')}>
                0
              </button>
              <button type="button" className="calculator-key col-span-2" onClick={() => pressKey('.')}>
                .
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
