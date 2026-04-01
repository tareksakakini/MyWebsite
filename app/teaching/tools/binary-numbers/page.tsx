'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

function BitToggle({ index, value, onToggle }: { index: number; value: number; onToggle: (i: number) => void }) {
  const placeValue = Math.pow(2, index);
  return (
    <button
      onClick={() => onToggle(index)}
      className={`flex flex-col items-center gap-1 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer select-none ${
        value
          ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-105'
          : 'bg-white border-gray-300 text-gray-400 hover:border-gray-500'
      }`}
    >
      <span className="text-2xl sm:text-3xl font-bold">{value}</span>
      <span className={`text-xs font-medium ${value ? 'text-gray-300' : 'text-gray-400'}`}>
        2<sup>{index}</sup> = {placeValue}
      </span>
    </button>
  );
}

type QuizQuestion = {
  type: 'to-decimal' | 'to-binary';
  binary: number[];
  decimal: number;
};

function generateQuiz(bitCount: number): QuizQuestion {
  const max = Math.pow(2, bitCount);
  const decimal = Math.floor(Math.random() * max);
  const binary = Array.from({ length: bitCount }, (_, i) =>
    (decimal >> (bitCount - 1 - i)) & 1
  );
  const type = Math.random() > 0.5 ? 'to-decimal' : 'to-binary';
  return { type, binary, decimal };
}

export default function BinaryNumbers() {
  const [bits, setBits] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [bitCount, setBitCount] = useState(8);

  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizBits, setQuizBits] = useState<number[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const decimalValue = bits.reduce((acc, bit, i) => {
    const power = bits.length - 1 - i;
    return acc + bit * Math.pow(2, power);
  }, 0);

  const toggleBit = useCallback((reversedIndex: number) => {
    setBits(prev => {
      const actualIndex = prev.length - 1 - reversedIndex;
      const next = [...prev];
      next[actualIndex] = next[actualIndex] ? 0 : 1;
      return next;
    });
  }, []);

  const handleBitCountChange = (count: number) => {
    setBitCount(count);
    setBits(Array(count).fill(0));
  };

  const resetBits = () => setBits(Array(bitCount).fill(0));

  const setRandomValue = () => {
    const max = Math.pow(2, bitCount);
    const val = Math.floor(Math.random() * max);
    setBits(
      Array.from({ length: bitCount }, (_, i) =>
        (val >> (bitCount - 1 - i)) & 1
      )
    );
  };

  const startQuiz = () => {
    const q = generateQuiz(bitCount);
    setQuiz(q);
    setQuizAnswer('');
    setQuizBits(Array(bitCount).fill(0));
    setQuizFeedback(null);
  };

  const checkAnswer = () => {
    if (!quiz) return;
    let correct = false;

    if (quiz.type === 'to-decimal') {
      correct = parseInt(quizAnswer, 10) === quiz.decimal;
    } else {
      const userDecimal = quizBits.reduce((acc, bit, i) => {
        const power = quizBits.length - 1 - i;
        return acc + bit * Math.pow(2, power);
      }, 0);
      correct = userDecimal === quiz.decimal;
    }

    setScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }));
    setQuizFeedback({
      correct,
      message: correct
        ? 'Correct!'
        : quiz.type === 'to-decimal'
          ? `The answer is ${quiz.decimal}.`
          : `The correct binary is ${quiz.decimal.toString(2).padStart(bitCount, '0')}.`,
    });
  };

  const toggleQuizBit = (reversedIndex: number) => {
    setQuizBits(prev => {
      const actualIndex = prev.length - 1 - reversedIndex;
      const next = [...prev];
      next[actualIndex] = next[actualIndex] ? 0 : 1;
      return next;
    });
    setQuizFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/teaching" className="hover:text-gray-900 transition-colors">Teaching</Link>
        <span className="mx-2">/</span>
        <Link href="/teaching/tools" className="hover:text-gray-900 transition-colors">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Binary Numbers</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Binary Numbers</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Learn how binary (base-2) numbers work. Toggle bits on and off to see how
          each position contributes to the decimal value.
        </p>
      </div>

      {/* Bit-count selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of bits</label>
        <div className="flex gap-2">
          {[4, 8].map(n => (
            <button
              key={n}
              onClick={() => handleBitCountChange(n)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                bitCount === n
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {n}-bit
            </button>
          ))}
        </div>
      </div>

      {/* Interactive bit toggles */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
          {bits.map((bit, i) => {
            const reversedIndex = bits.length - 1 - i;
            return (
              <BitToggle
                key={i}
                index={reversedIndex}
                value={bit}
                onToggle={toggleBit}
              />
            );
          })}
        </div>

        {/* Decimal result */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Decimal Value</p>
          <p className="text-5xl font-bold text-gray-900">{decimalValue}</p>
          <p className="text-sm text-gray-400 mt-2 font-mono">
            0b{bits.join('')} = {decimalValue}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-12">
        <button
          onClick={resetBits}
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How Binary Works</h2>
        <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
          <p>
            Binary is a <strong>base-2</strong> number system that uses only two digits: <strong>0</strong> and <strong>1</strong>.
            Each digit is called a <strong>bit</strong>. Every bit position represents a power of 2, starting from 2<sup>0</sup> on the right.
          </p>
          <p>
            To convert binary to decimal, multiply each bit by its place value and add them up. For example:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <p>1 0 1 1 (binary)</p>
            <p>= 1×2³ + 0×2² + 1×2¹ + 1×2⁰</p>
            <p>= 8 + 0 + 2 + 1</p>
            <p>= <strong>11</strong> (decimal)</p>
          </div>
          <p>
            With <strong>{bitCount} bits</strong>, you can represent values from <strong>0</strong> to <strong>{Math.pow(2, bitCount) - 1}</strong> ({Math.pow(2, bitCount)} unique values).
          </p>
        </div>
      </div>

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
            <p className="text-gray-600 mb-4">Test your understanding of binary numbers.</p>
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
                  What is the <strong>decimal</strong> value of this binary number?
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {quiz.binary.map((bit, i) => (
                    <span
                      key={i}
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg text-xl font-bold ${
                        bit ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {bit}
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
                  Set the bits to represent the decimal number <strong className="text-2xl">{quiz.decimal}</strong>
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {quizBits.map((bit, i) => {
                    const reversedIndex = quizBits.length - 1 - i;
                    return (
                      <BitToggle
                        key={i}
                        index={reversedIndex}
                        value={bit}
                        onToggle={toggleQuizBit}
                      />
                    );
                  })}
                </div>
                <p className="text-center text-sm text-gray-500 mb-4 font-mono">
                  Current value: {quizBits.reduce((acc, bit, i) => acc + bit * Math.pow(2, quizBits.length - 1 - i), 0)}
                </p>
              </div>
            )}

            {/* Feedback */}
            {quizFeedback && (
              <div className={`text-center p-3 rounded-lg mb-4 ${
                quizFeedback.correct
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {quizFeedback.message}
              </div>
            )}

            {/* Quiz actions */}
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
