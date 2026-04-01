'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const HEX_CHARS = '0123456789ABCDEF';

function digitToDisplay(digit: number): string {
  return HEX_CHARS[digit] ?? String(digit);
}

function formatInBase(value: number, base: number, padTo: number): string {
  if (value === 0) return '0'.padStart(padTo, '0');
  let result = '';
  let v = value;
  while (v > 0) {
    result = digitToDisplay(v % base) + result;
    v = Math.floor(v / base);
  }
  return result.padStart(padTo, '0');
}

const BASE_PREFIXES: Record<number, string> = { 2: '0b', 8: '0o', 16: '0x' };
const BASE_NAMES: Record<number, string> = {
  2: 'Binary',
  3: 'Ternary',
  4: 'Quaternary',
  5: 'Quinary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
};

function DigitControl({
  position,
  digit,
  base,
  onChange,
}: {
  position: number;
  digit: number;
  base: number;
  onChange: (position: number, newDigit: number) => void;
}) {
  const placeValue = Math.pow(base, position);
  const isActive = digit > 0;
  const intensity = digit / (base - 1);

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => onChange(position, (digit + 1) % base)}
        className="w-8 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Increment digit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <button
        onClick={() => onChange(position, (digit + 1) % base)}
        className={`flex flex-col items-center gap-1 w-16 sm:w-20 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer select-none ${
          isActive
            ? 'border-gray-900 text-white shadow-lg'
            : 'bg-white border-gray-300 text-gray-400 hover:border-gray-500'
        }`}
        style={
          isActive
            ? { backgroundColor: `rgba(17, 24, 39, ${0.15 + intensity * 0.85})` }
            : undefined
        }
      >
        <span className="text-2xl sm:text-3xl font-bold font-mono">
          {digitToDisplay(digit)}
        </span>
        <span className={`text-[10px] font-medium ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
          {base}<sup>{position}</sup>={placeValue}
        </span>
      </button>

      <button
        onClick={() => onChange(position, (digit - 1 + base) % base)}
        className="w-8 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
        aria-label="Decrement digit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

type QuizQuestion = {
  type: 'to-decimal' | 'from-decimal';
  digits: number[];
  decimal: number;
};

function generateQuiz(base: number, digitCount: number): QuizQuestion {
  const max = Math.pow(base, digitCount);
  const decimal = Math.floor(Math.random() * max);
  const digits: number[] = [];
  let v = decimal;
  for (let i = digitCount - 1; i >= 0; i--) {
    const pv = Math.pow(base, i);
    digits.push(Math.floor(v / pv));
    v = v % pv;
  }
  const type = Math.random() > 0.5 ? 'to-decimal' : 'from-decimal';
  return { type, digits, decimal };
}

function digitsToDecimal(digits: number[], base: number): number {
  return digits.reduce((acc, d, i) => acc + d * Math.pow(base, digits.length - 1 - i), 0);
}

const AVAILABLE_BASES = [2, 3, 4, 5, 8, 10, 16];
const DIGIT_COUNT_OPTIONS = [4, 8];

export default function NumberBases() {
  const [base, setBase] = useState(2);
  const [digitCount, setDigitCount] = useState(8);
  const [digits, setDigits] = useState<number[]>(() => Array(8).fill(0));

  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizDigits, setQuizDigits] = useState<number[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const decimalValue = useMemo(() => digitsToDecimal(digits, base), [digits, base]);

  const baseName = BASE_NAMES[base] ?? `Base-${base}`;
  const prefix = BASE_PREFIXES[base] ?? '';

  const handleBaseChange = (newBase: number) => {
    setBase(newBase);
    setDigits(Array(digitCount).fill(0));
    setQuiz(null);
    setQuizFeedback(null);
    setScore({ correct: 0, total: 0 });
  };

  const handleDigitCountChange = (count: number) => {
    setDigitCount(count);
    setDigits(Array(count).fill(0));
  };

  const handleDigitChange = (position: number, newDigit: number) => {
    setDigits(prev => {
      const actualIndex = prev.length - 1 - position;
      const next = [...prev];
      next[actualIndex] = newDigit;
      return next;
    });
  };

  const resetDigits = () => setDigits(Array(digitCount).fill(0));

  const setRandomValue = () => {
    const max = Math.pow(base, digitCount);
    const val = Math.floor(Math.random() * max);
    const newDigits: number[] = [];
    let v = val;
    for (let i = digitCount - 1; i >= 0; i--) {
      const pv = Math.pow(base, i);
      newDigits.push(Math.floor(v / pv));
      v = v % pv;
    }
    setDigits(newDigits);
  };

  const startQuiz = () => {
    const q = generateQuiz(base, digitCount);
    setQuiz(q);
    setQuizAnswer('');
    setQuizDigits(Array(digitCount).fill(0));
    setQuizFeedback(null);
  };

  const checkAnswer = () => {
    if (!quiz) return;
    let correct = false;

    if (quiz.type === 'to-decimal') {
      correct = parseInt(quizAnswer, 10) === quiz.decimal;
    } else {
      correct = digitsToDecimal(quizDigits, base) === quiz.decimal;
    }

    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    setQuizFeedback({
      correct,
      message: correct
        ? 'Correct!'
        : quiz.type === 'to-decimal'
          ? `The answer is ${quiz.decimal}.`
          : `The correct representation is ${prefix}${formatInBase(quiz.decimal, base, digitCount)}.`,
    });
  };

  const handleQuizDigitChange = (position: number, newDigit: number) => {
    setQuizDigits(prev => {
      const actualIndex = prev.length - 1 - position;
      const next = [...prev];
      next[actualIndex] = newDigit;
      return next;
    });
    setQuizFeedback(null);
  };

  const exampleDigits = base === 2 ? [1, 0, 1, 1] : base <= 5 ? [1, 2, 0, 1] : base <= 10 ? [3, 5, 1, 2] : [2, 10, 0, 15];
  const exampleDecimal = exampleDigits.reduce((acc, d, i) => acc + d * Math.pow(base, exampleDigits.length - 1 - i), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/teaching" className="hover:text-gray-900 transition-colors">Teaching</Link>
        <span className="mx-2">/</span>
        <Link href="/teaching/tools" className="hover:text-gray-900 transition-colors">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Number Bases</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Number Bases</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Explore how positional number systems work. Pick a base, adjust digits at
          each position, and see how they contribute to the decimal value.
        </p>
      </div>

      {/* Base selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_BASES.map(b => (
            <button
              key={b}
              onClick={() => handleBaseChange(b)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                base === b
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {b}
              <span className="ml-1 text-xs opacity-70">({BASE_NAMES[b]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Digit-count selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of digits</label>
        <div className="flex gap-2">
          {DIGIT_COUNT_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => handleDigitCountChange(n)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                digitCount === n
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {n} digits
            </button>
          ))}
        </div>
      </div>

      {/* Interactive digit controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {digits.map((digit, i) => {
            const position = digits.length - 1 - i;
            return (
              <DigitControl
                key={i}
                position={position}
                digit={digit}
                base={base}
                onChange={handleDigitChange}
              />
            );
          })}
        </div>

        {/* Decimal result */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Decimal (Base-10) Value</p>
          <p className="text-5xl font-bold text-gray-900">{decimalValue}</p>
          <p className="text-sm text-gray-400 mt-2 font-mono">
            {prefix}{digits.map(d => digitToDisplay(d)).join('')}
            <sub>{base}</sub> = {decimalValue}<sub>10</sub>
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-12">
        <button
          onClick={resetDigits}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={setRandomValue}
          className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Random
        </button>
      </div>

      {/* How it works */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How {baseName} (Base-{base}) Works</h2>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
          <p>
            {baseName} is a <strong>base-{base}</strong> number system that uses {base} digits:{' '}
            <strong>{Array.from({ length: base }, (_, i) => digitToDisplay(i)).join(', ')}</strong>.
            Each digit position represents a power of {base}, starting
            from {base}<sup>0</sup> on the right.
          </p>
          <p>
            To convert to decimal, multiply each digit by its place value and add them up:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <p>{exampleDigits.map(d => digitToDisplay(d)).join('  ')} ({baseName.toLowerCase()})</p>
            <p>
              ={' '}
              {exampleDigits
                .map((d, i) => `${digitToDisplay(d)}×${base}${superscript(exampleDigits.length - 1 - i)}`)
                .join(' + ')}
            </p>
            <p>
              ={' '}
              {exampleDigits
                .map((d, i) => d * Math.pow(base, exampleDigits.length - 1 - i))
                .join(' + ')}
            </p>
            <p>
              = <strong>{exampleDecimal}</strong> (decimal)
            </p>
          </div>
          <p>
            With <strong>{digitCount} digits</strong> in base {base}, you can represent values
            from <strong>0</strong> to{' '}
            <strong>{(Math.pow(base, digitCount) - 1).toLocaleString()}</strong>{' '}
            ({Math.pow(base, digitCount).toLocaleString()} unique values).
          </p>
        </div>
      </div>

      {/* Decimal-to-Base Division Converter */}
      <DivisionConverter key={base} base={base} />

      {/* Quiz Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Practice Quiz</h2>
          {score.total > 0 && (
            <span className="text-sm text-gray-500">
              Score: {score.correct}/{score.total}
            </span>
          )}
        </div>

        {!quiz ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Test your understanding of {baseName.toLowerCase()} numbers.</p>
            <button
              onClick={startQuiz}
              className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div>
            {quiz.type === 'to-decimal' ? (
              <div>
                <p className="text-gray-700 mb-4">
                  What is the <strong>decimal</strong> value of this {baseName.toLowerCase()} number?
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {quiz.digits.map((d, i) => (
                    <span
                      key={i}
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg text-xl font-bold font-mono ${
                        d > 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {digitToDisplay(d)}
                    </span>
                  ))}
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  <input
                    type="number"
                    value={quizAnswer}
                    onChange={e => { setQuizAnswer(e.target.value); setQuizFeedback(null); }}
                    onKeyDown={e => { if (e.key === 'Enter' && quizAnswer) checkAnswer(); }}
                    placeholder="Enter decimal..."
                    className="w-48 px-4 py-2 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-4">
                  Set the digits to represent the decimal number{' '}
                  <strong className="text-2xl">{quiz.decimal}</strong>{' '}
                  in {baseName.toLowerCase()}
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4">
                  {quizDigits.map((d, i) => {
                    const position = quizDigits.length - 1 - i;
                    return (
                      <DigitControl
                        key={i}
                        position={position}
                        digit={d}
                        base={base}
                        onChange={handleQuizDigitChange}
                      />
                    );
                  })}
                </div>
                <p className="text-center text-sm text-gray-500 mb-4 font-mono">
                  Current value: {digitsToDecimal(quizDigits, base)}
                </p>
              </div>
            )}

            {quizFeedback && (
              <div className={`text-center p-3 rounded-lg mb-4 ${
                quizFeedback.correct
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {quizFeedback.message}
              </div>
            )}

            <div className="flex justify-center gap-3">
              {!quizFeedback && (
                <button
                  onClick={checkAnswer}
                  disabled={quiz.type === 'to-decimal' && !quizAnswer}
                  className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              )}
              {quizFeedback && (
                <button
                  onClick={startQuiz}
                  className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type DivisionStep = {
  dividend: number;
  quotient: number;
  remainder: number;
};

function computeDivisionSteps(decimal: number, base: number): DivisionStep[] {
  if (decimal === 0) return [{ dividend: 0, quotient: 0, remainder: 0 }];
  const steps: DivisionStep[] = [];
  let current = decimal;
  while (current > 0) {
    const quotient = Math.floor(current / base);
    const remainder = current % base;
    steps.push({ dividend: current, quotient, remainder });
    current = quotient;
  }
  return steps;
}

function DivisionConverter({ base }: { base: number }) {
  const [inputValue, setInputValue] = useState('');
  const [decimalToConvert, setDecimalToConvert] = useState<number | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allSteps, setAllSteps] = useState<DivisionStep[]>([]);
  const [finished, setFinished] = useState(false);

  const baseName = BASE_NAMES[base] ?? `Base-${base}`;
  const prefix = BASE_PREFIXES[base] ?? '';

  const startConversion = (value: number) => {
    const steps = computeDivisionSteps(value, base);
    setDecimalToConvert(value);
    setAllSteps(steps);
    setCurrentStepIndex(0);
    setFinished(steps.length === 1 && value === 0);
  };

  const handleStart = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val) || val < 0) return;
    startConversion(val);
  };

  const handleRandom = () => {
    const val = Math.floor(Math.random() * 500) + 1;
    setInputValue(String(val));
    startConversion(val);
  };

  const advanceStep = () => {
    if (currentStepIndex < allSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setDecimalToConvert(null);
    setCurrentStepIndex(0);
    setAllSteps([]);
    setFinished(false);
  };

  const visibleSteps = allSteps.slice(0, currentStepIndex + 1);
  const collectedRemainders = visibleSteps.map(s => s.remainder);
  const resultSoFar = [...collectedRemainders].reverse();
  const isLastStepVisible = currentStepIndex >= allSteps.length - 1;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Decimal → {baseName} Converter
      </h2>
      <p className="text-gray-600 mb-6">
        Convert a decimal number to {baseName.toLowerCase()} by repeatedly dividing by {base}.
        Step through each division to see how the remainders build the result from right to left.
      </p>

      {decimalToConvert === null ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && inputValue) handleStart(); }}
              placeholder="Enter a decimal number..."
              className="w-56 px-4 py-2 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleStart}
              disabled={!inputValue || isNaN(parseInt(inputValue, 10)) || parseInt(inputValue, 10) < 0}
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start
            </button>
            <button
              onClick={handleRandom}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Random
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <span className="text-sm text-gray-500">Converting</span>
            <span className="mx-2 text-2xl font-bold text-gray-900">{decimalToConvert}</span>
            <span className="text-sm text-gray-500">to {baseName.toLowerCase()}</span>
          </div>

          {/* Division steps table */}
          <div className="overflow-x-auto mb-6">
            <table className="mx-auto text-sm sm:text-base">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-3 py-2 text-center">Step</th>
                  <th className="px-3 py-2 text-center">Dividend</th>
                  <th className="px-3 py-2 text-center">÷</th>
                  <th className="px-3 py-2 text-center">Base</th>
                  <th className="px-3 py-2 text-center">=</th>
                  <th className="px-3 py-2 text-center">Quotient</th>
                  <th className="px-3 py-2 text-center">Remainder</th>
                </tr>
              </thead>
              <tbody>
                {visibleSteps.map((step, i) => (
                  <tr
                    key={i}
                    className={`transition-all duration-300 ${
                      i === currentStepIndex ? 'bg-gray-50' : ''
                    }`}
                  >
                    <td className="px-3 py-2 text-center text-gray-400 font-mono">{i + 1}</td>
                    <td className="px-3 py-2 text-center font-bold font-mono text-gray-900">{step.dividend}</td>
                    <td className="px-3 py-2 text-center text-gray-400">÷</td>
                    <td className="px-3 py-2 text-center font-mono text-gray-600">{base}</td>
                    <td className="px-3 py-2 text-center text-gray-400">=</td>
                    <td className="px-3 py-2 text-center font-mono text-gray-700">{step.quotient}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-900 text-white font-bold font-mono">
                        {digitToDisplay(step.remainder)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Result so far */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-2">
              {finished ? 'Final result (read remainders bottom → top):' : 'Remainders collected so far (bottom → top):'}
            </p>
            <div className="flex justify-center gap-1">
              {resultSoFar.map((r, i) => (
                <span
                  key={i}
                  className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-md font-bold font-mono text-lg transition-all duration-300 ${
                    finished
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {digitToDisplay(r)}
                </span>
              ))}
            </div>
            {finished && (
              <p className="mt-3 text-lg font-mono text-gray-700">
                {decimalToConvert}<sub>10</sub> = {prefix}{resultSoFar.map(d => digitToDisplay(d)).join('')}<sub>{base}</sub>
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!finished && (
              <button
                onClick={advanceStep}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                {isLastStepVisible ? 'Show Result' : 'Next Step'}
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Try Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const SUPERSCRIPTS: Record<string, string> = {
  '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3',
  '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077',
  '8': '\u2078', '9': '\u2079',
};

function superscript(n: number): string {
  return String(n).split('').map(c => SUPERSCRIPTS[c] ?? c).join('');
}
