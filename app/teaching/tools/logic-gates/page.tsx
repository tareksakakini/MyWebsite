'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Gate definitions
// ---------------------------------------------------------------------------

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

type GateInfo = {
  name: GateType;
  symbol: string;
  arity: 1 | 2;
  description: string;
  rule: string;
  compute: (inputs: number[]) => number;
};

const GATES: Record<GateType, GateInfo> = {
  AND: {
    name: 'AND',
    symbol: '∧',
    arity: 2,
    description: 'Outputs 1 only when all inputs are 1.',
    rule: 'Output is 1 if A and B are both 1.',
    compute: (inputs) => (inputs.every(v => v === 1) ? 1 : 0),
  },
  OR: {
    name: 'OR',
    symbol: '∨',
    arity: 2,
    description: 'Outputs 1 when at least one input is 1.',
    rule: 'Output is 1 if A or B (or both) is 1.',
    compute: (inputs) => (inputs.some(v => v === 1) ? 1 : 0),
  },
  NOT: {
    name: 'NOT',
    symbol: '¬',
    arity: 1,
    description: 'Inverts its single input.',
    rule: 'Output is 1 if A is 0, and 0 if A is 1.',
    compute: (inputs) => (inputs[0] === 1 ? 0 : 1),
  },
  NAND: {
    name: 'NAND',
    symbol: '⊼',
    arity: 2,
    description: 'NOT + AND. Outputs 0 only when all inputs are 1.',
    rule: 'Output is 0 if A and B are both 1 — otherwise 1.',
    compute: (inputs) => (inputs.every(v => v === 1) ? 0 : 1),
  },
  NOR: {
    name: 'NOR',
    symbol: '⊽',
    arity: 2,
    description: 'NOT + OR. Outputs 1 only when all inputs are 0.',
    rule: 'Output is 1 only if both A and B are 0.',
    compute: (inputs) => (inputs.some(v => v === 1) ? 0 : 1),
  },
  XOR: {
    name: 'XOR',
    symbol: '⊕',
    arity: 2,
    description: 'Exclusive OR. Outputs 1 when inputs differ.',
    rule: 'Output is 1 if exactly one of A or B is 1.',
    compute: (inputs) => (inputs[0] !== inputs[1] ? 1 : 0),
  },
  XNOR: {
    name: 'XNOR',
    symbol: '⊙',
    arity: 2,
    description: 'NOT + XOR. Outputs 1 when inputs are equal.',
    rule: 'Output is 1 if A and B have the same value.',
    compute: (inputs) => (inputs[0] === inputs[1] ? 1 : 0),
  },
};

const GATE_ORDER: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

// ---------------------------------------------------------------------------
// Gate SVG drawings (ANSI/MIL-STD style)
// ---------------------------------------------------------------------------

const HIGH_COLOR = '#10b981'; // emerald-500
const LOW_COLOR = '#cbd5e1';  // slate-300

function wireColor(value: number) {
  return value === 1 ? HIGH_COLOR : LOW_COLOR;
}

function GateBody({ gate }: { gate: GateType }) {
  const stroke = '#111827'; // gray-900
  const fill = '#ffffff';

  // All drawings sit in the box: body x from 100 to 220
  // Inputs at x=100, output around x=220 (or +bubble)
  switch (gate) {
    case 'AND':
    case 'NAND': {
      return (
        <>
          <path
            d="M 100 30 L 160 30 A 50 50 0 0 1 160 130 L 100 130 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          {gate === 'NAND' && (
            <circle cx={218} cy={80} r={8} fill={fill} stroke={stroke} strokeWidth={3} />
          )}
        </>
      );
    }
    case 'OR':
    case 'NOR':
    case 'XOR':
    case 'XNOR': {
      // OR body: concave left, curved front to tip
      const bodyPath =
        'M 100 30 Q 140 80 100 130 Q 170 130 215 80 Q 170 30 100 30 Z';
      return (
        <>
          {(gate === 'XOR' || gate === 'XNOR') && (
            <path
              d="M 88 30 Q 128 80 88 130"
              fill="none"
              stroke={stroke}
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}
          <path
            d={bodyPath}
            fill={fill}
            stroke={stroke}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          {(gate === 'NOR' || gate === 'XNOR') && (
            <circle cx={223} cy={80} r={8} fill={fill} stroke={stroke} strokeWidth={3} />
          )}
        </>
      );
    }
    case 'NOT': {
      return (
        <>
          <path
            d="M 100 30 L 100 130 L 205 80 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <circle cx={213} cy={80} r={8} fill={fill} stroke={stroke} strokeWidth={3} />
        </>
      );
    }
  }
}

function GateDisplay({
  gate,
  inputs,
  onToggle,
  interactive = true,
  labels,
}: {
  gate: GateType;
  inputs: number[];
  onToggle?: (index: number) => void;
  interactive?: boolean;
  labels?: string[];
}) {
  const info = GATES[gate];
  const output = info.compute(inputs);
  const inputNames = labels ?? (info.arity === 1 ? ['A'] : ['A', 'B']);

  // Layout
  const inputPinX = 100;
  const outputTipX = gate === 'NOT' ? 221 : gate === 'NAND' || gate === 'NOR' || gate === 'XNOR' ? 231 : gate === 'OR' || gate === 'XOR' ? 215 : 210;
  const outputWireEnd = 300;

  const inputYs = info.arity === 1 ? [80] : [50, 110];
  const inputWireStart = 10;
  const outputY = 80;

  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full max-w-md h-auto"
      role="img"
      aria-label={`${gate} gate`}
    >
      {/* Input wires */}
      {inputs.map((v, i) => {
        const y = inputYs[i];
        return (
          <g key={`in-${i}`}>
            <line
              x1={inputWireStart + 35}
              y1={y}
              x2={inputPinX}
              y2={y}
              stroke={wireColor(v)}
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Input toggle button */}
            <g
              onClick={interactive && onToggle ? () => onToggle(i) : undefined}
              style={{ cursor: interactive && onToggle ? 'pointer' : 'default' }}
            >
              <circle
                cx={inputWireStart + 18}
                cy={y}
                r={17}
                fill={v === 1 ? HIGH_COLOR : '#ffffff'}
                stroke={v === 1 ? HIGH_COLOR : '#9ca3af'}
                strokeWidth={2}
              />
              <text
                x={inputWireStart + 18}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontWeight="bold"
                fontSize={18}
                fill={v === 1 ? '#ffffff' : '#6b7280'}
              >
                {v}
              </text>
            </g>
            {/* Input label */}
            <text
              x={inputPinX - 8}
              y={y - 10}
              textAnchor="end"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
              fontSize={13}
              fill="#6b7280"
            >
              {inputNames[i]}
            </text>
          </g>
        );
      })}

      {/* Gate body */}
      <GateBody gate={gate} />

      {/* Output wire */}
      <line
        x1={outputTipX}
        y1={outputY}
        x2={outputWireEnd - 20}
        y2={outputY}
        stroke={wireColor(output)}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Output indicator */}
      <circle
        cx={outputWireEnd - 5}
        cy={outputY}
        r={15}
        fill={output === 1 ? HIGH_COLOR : '#ffffff'}
        stroke={output === 1 ? HIGH_COLOR : '#9ca3af'}
        strokeWidth={2}
      />
      <text
        x={outputWireEnd - 5}
        y={outputY + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontWeight="bold"
        fontSize={16}
        fill={output === 1 ? '#ffffff' : '#6b7280'}
      >
        {output}
      </text>
      <text
        x={outputTipX + 12}
        y={outputY - 10}
        fontFamily="ui-monospace, SFMono-Regular, monospace"
        fontSize={13}
        fill="#6b7280"
      >
        Y
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Boolean expression parser
// ---------------------------------------------------------------------------

type ASTNode =
  | { kind: 'lit'; value: 0 | 1 }
  | { kind: 'var'; name: string }
  | { kind: 'not'; arg: ASTNode }
  | { kind: 'bin'; op: 'AND' | 'OR' | 'XOR'; left: ASTNode; right: ASTNode };

type Token =
  | { type: 'VAR'; name: string }
  | { type: 'LIT'; value: 0 | 1 }
  | { type: 'NOT' }
  | { type: 'AND' }
  | { type: 'OR' }
  | { type: 'XOR' }
  | { type: 'LPAREN' }
  | { type: 'RPAREN' };

class ParseError extends Error {}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const src = input;
  while (i < src.length) {
    const c = src[i];

    if (/\s/.test(c)) {
      i++;
      continue;
    }

    if (c === '(') { tokens.push({ type: 'LPAREN' }); i++; continue; }
    if (c === ')') { tokens.push({ type: 'RPAREN' }); i++; continue; }

    // Multi-char operators
    if (src.startsWith('&&', i)) { tokens.push({ type: 'AND' }); i += 2; continue; }
    if (src.startsWith('||', i)) { tokens.push({ type: 'OR' }); i += 2; continue; }

    // Single-char operators
    if (c === '&' || c === '∧' || c === '*' || c === '·') { tokens.push({ type: 'AND' }); i++; continue; }
    if (c === '|' || c === '∨' || c === '+') { tokens.push({ type: 'OR' }); i++; continue; }
    if (c === '^' || c === '⊕') { tokens.push({ type: 'XOR' }); i++; continue; }
    if (c === '!' || c === '~' || c === '¬') { tokens.push({ type: 'NOT' }); i++; continue; }

    // Literals
    if (c === '0') { tokens.push({ type: 'LIT', value: 0 }); i++; continue; }
    if (c === '1') { tokens.push({ type: 'LIT', value: 1 }); i++; continue; }

    // Keywords or single-letter identifiers
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z_0-9]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const upper = word.toUpperCase();
      i = j;
      if (upper === 'AND') { tokens.push({ type: 'AND' }); continue; }
      if (upper === 'OR') { tokens.push({ type: 'OR' }); continue; }
      if (upper === 'NOT') { tokens.push({ type: 'NOT' }); continue; }
      if (upper === 'XOR') { tokens.push({ type: 'XOR' }); continue; }
      if (upper === 'TRUE' || upper === 'T') { tokens.push({ type: 'LIT', value: 1 }); continue; }
      if (upper === 'FALSE' || upper === 'F') { tokens.push({ type: 'LIT', value: 0 }); continue; }
      // Multi-letter identifiers that aren't keywords — treat as a single variable name
      tokens.push({ type: 'VAR', name: upper });
      continue;
    }

    throw new ParseError(`Unexpected character '${c}' at position ${i + 1}`);
  }
  return tokens;
}

function parse(input: string): ASTNode {
  const tokens = tokenize(input);
  let pos = 0;

  const peek = () => tokens[pos];
  const eat = () => tokens[pos++];
  const expect = (type: Token['type']) => {
    const t = eat();
    if (!t || t.type !== type) throw new ParseError(`Expected ${type}`);
    return t;
  };

  // Grammar: expr = or
  // or = xor ('OR' xor)*
  // xor = and ('XOR' and)*
  // and = unary ('AND' unary)*
  // unary = 'NOT'* primary
  // primary = LIT | VAR | '(' expr ')'

  const parsePrimary = (): ASTNode => {
    const t = peek();
    if (!t) throw new ParseError('Unexpected end of expression');
    if (t.type === 'LIT') { eat(); return { kind: 'lit', value: t.value }; }
    if (t.type === 'VAR') { eat(); return { kind: 'var', name: t.name }; }
    if (t.type === 'LPAREN') {
      eat();
      const e = parseOr();
      expect('RPAREN');
      return e;
    }
    throw new ParseError(`Unexpected token '${t.type}'`);
  };

  const parseUnary = (): ASTNode => {
    if (peek()?.type === 'NOT') {
      eat();
      return { kind: 'not', arg: parseUnary() };
    }
    return parsePrimary();
  };

  const parseAnd = (): ASTNode => {
    let left = parseUnary();
    while (peek()?.type === 'AND') {
      eat();
      const right = parseUnary();
      left = { kind: 'bin', op: 'AND', left, right };
    }
    return left;
  };

  const parseXor = (): ASTNode => {
    let left = parseAnd();
    while (peek()?.type === 'XOR') {
      eat();
      const right = parseAnd();
      left = { kind: 'bin', op: 'XOR', left, right };
    }
    return left;
  };

  const parseOr = (): ASTNode => {
    let left = parseXor();
    while (peek()?.type === 'OR') {
      eat();
      const right = parseXor();
      left = { kind: 'bin', op: 'OR', left, right };
    }
    return left;
  };

  if (tokens.length === 0) throw new ParseError('Empty expression');
  const tree = parseOr();
  if (pos < tokens.length) throw new ParseError(`Unexpected token at end`);
  return tree;
}

// Precedence for pretty-printing: higher = binds tighter
const PREC: Record<string, number> = {
  lit: 100, var: 100,
  not: 4,
  AND: 3,
  XOR: 2,
  OR: 1,
};

function nodePrec(n: ASTNode): number {
  if (n.kind === 'lit' || n.kind === 'var') return 100;
  if (n.kind === 'not') return PREC.not;
  return PREC[n.op];
}

function toStringAST(n: ASTNode, parentPrec = 0): string {
  let s: string;
  if (n.kind === 'lit') s = String(n.value);
  else if (n.kind === 'var') s = n.name;
  else if (n.kind === 'not') s = `¬${toStringAST(n.arg, PREC.not)}`;
  else {
    const opSym = n.op === 'AND' ? ' ∧ ' : n.op === 'OR' ? ' ∨ ' : ' ⊕ ';
    const p = PREC[n.op];
    s = `${toStringAST(n.left, p)}${opSym}${toStringAST(n.right, p + 0.5)}`;
  }
  const np = nodePrec(n);
  if (np < parentPrec) s = `(${s})`;
  return s;
}

function collectVars(n: ASTNode, set: Set<string> = new Set()): Set<string> {
  if (n.kind === 'var') set.add(n.name);
  else if (n.kind === 'not') collectVars(n.arg, set);
  else if (n.kind === 'bin') { collectVars(n.left, set); collectVars(n.right, set); }
  return set;
}

type EvalStep = {
  before: string;      // sub-expression as it looked before this step
  after: string;       // substituted form (values replacing the operand expressions)
  result: number;
  description: string; // human-readable rule
};

function evaluate(
  n: ASTNode,
  values: Record<string, number>,
  steps: EvalStep[] = [],
): { value: number; steps: EvalStep[]; display: string } {
  if (n.kind === 'lit') return { value: n.value, steps, display: String(n.value) };
  if (n.kind === 'var') {
    const v = values[n.name] ?? 0;
    return { value: v, steps, display: String(v) };
  }
  if (n.kind === 'not') {
    const inner = evaluate(n.arg, values, steps);
    const result = inner.value === 1 ? 0 : 1;
    const before = toStringAST(n);
    const after = `¬${inner.value}`;
    steps.push({ before, after, result, description: `NOT ${inner.value} = ${result}` });
    return { value: result, steps, display: String(result) };
  }
  // binary
  const left = evaluate(n.left, values, steps);
  const right = evaluate(n.right, values, steps);
  let result: number;
  let description: string;
  if (n.op === 'AND') {
    result = left.value === 1 && right.value === 1 ? 1 : 0;
    description = `${left.value} AND ${right.value} = ${result}`;
  } else if (n.op === 'OR') {
    result = left.value === 1 || right.value === 1 ? 1 : 0;
    description = `${left.value} OR ${right.value} = ${result}`;
  } else {
    result = left.value !== right.value ? 1 : 0;
    description = `${left.value} XOR ${right.value} = ${result}`;
  }
  const before = toStringAST(n);
  const opSym = n.op === 'AND' ? '∧' : n.op === 'OR' ? '∨' : '⊕';
  const after = `${left.value} ${opSym} ${right.value}`;
  steps.push({ before, after, result, description });
  return { value: result, steps, display: String(result) };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type Tab = 'explorer' | 'expression' | 'quiz';

const TABS: { id: Tab; label: string }[] = [
  { id: 'explorer', label: 'Gate Explorer' },
  { id: 'expression', label: 'Expression Evaluator' },
  { id: 'quiz', label: 'Quiz' },
];

export default function LogicGatesPage() {
  const [tab, setTab] = useState<Tab>('explorer');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/teaching" className="hover:text-gray-900 transition-colors">Teaching</Link>
        <span className="mx-2">/</span>
        <Link href="/teaching/tools" className="hover:text-gray-900 transition-colors">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Logic Gates</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light text-gray-900 mb-4">Logic Gates</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Build intuition for boolean logic. Toggle inputs on standard gates,
          evaluate boolean expressions step by step, and test your skills with
          a practice quiz.
        </p>
      </div>

      {/* Tab selector */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors -mb-px ${
                tab === t.id
                  ? 'bg-white border border-gray-200 border-b-white text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'explorer' && <GateExplorer />}
      {tab === 'expression' && <ExpressionEvaluator />}
      {tab === 'quiz' && <Quiz />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gate Explorer tab
// ---------------------------------------------------------------------------

function GateExplorer() {
  const [gate, setGate] = useState<GateType>('AND');
  const [inputs, setInputs] = useState<number[]>([0, 0]);

  const info = GATES[gate];

  // Adjust input array length when arity changes
  useEffect(() => {
    setInputs(Array(info.arity).fill(0));
  }, [gate, info.arity]);

  const toggleInput = (i: number) => {
    setInputs(prev => prev.map((v, idx) => (idx === i ? (v === 1 ? 0 : 1) : v)));
  };

  const output = info.compute(inputs);

  // Build truth table rows for this gate
  const allCombos: number[][] = [];
  const n = info.arity;
  for (let i = 0; i < (1 << n); i++) {
    const row: number[] = [];
    for (let b = n - 1; b >= 0; b--) row.push((i >> b) & 1);
    allCombos.push(row);
  }

  return (
    <>
      {/* Gate selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Gate</label>
        <div className="flex flex-wrap gap-2">
          {GATE_ORDER.map(g => (
            <button
              key={g}
              onClick={() => setGate(g)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                gate === g
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive gate display */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col items-center">
          <GateDisplay gate={gate} inputs={inputs} onToggle={toggleInput} />
          <p className="text-center text-sm text-gray-500 mt-4">
            Click an input circle to toggle it between{' '}
            <span className="font-mono font-bold text-gray-700">0</span> and{' '}
            <span className="font-mono font-bold text-gray-700">1</span>.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {inputs.map((v, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 py-3">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Input {info.arity === 1 ? 'A' : String.fromCharCode(65 + i)}
              </p>
              <p className={`text-2xl font-bold font-mono ${v === 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
                {v}
              </p>
            </div>
          ))}
          {info.arity === 1 && <div className="hidden sm:block" />}
          <div className="bg-white rounded-lg border-2 border-gray-900 py-3">
            <p className="text-xs uppercase tracking-wider text-gray-500">Output Y</p>
            <p className={`text-2xl font-bold font-mono ${output === 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
              {output}
            </p>
          </div>
        </div>
      </div>

      {/* Truth table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Truth Table</h2>
        <div className="overflow-x-auto">
          <table className="mx-auto text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                {info.arity === 2 && <th className="px-4 py-2">A</th>}
                {info.arity === 1 && <th className="px-4 py-2">A</th>}
                {info.arity === 2 && <th className="px-4 py-2">B</th>}
                <th className="px-4 py-2 border-l border-gray-200">Y</th>
              </tr>
            </thead>
            <tbody>
              {allCombos.map((combo, i) => {
                const rowOutput = info.compute(combo);
                const isActive = combo.every((v, idx) => v === inputs[idx]);
                return (
                  <tr
                    key={i}
                    className={`transition-colors ${isActive ? 'bg-emerald-50' : ''}`}
                  >
                    {combo.map((v, idx) => (
                      <td key={idx} className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-mono font-bold ${
                          v === 1 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {v}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-2 text-center border-l border-gray-200">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-mono font-bold ${
                        rowOutput === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {rowOutput}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          The highlighted row matches your current inputs.
        </p>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About the {gate} gate</h2>
        <p className="text-gray-600 mb-2">{info.description}</p>
        <p className="text-gray-600"><strong>Rule:</strong> {info.rule}</p>
        <div className="mt-4 bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700">
          {gate === 'NOT'
            ? <>Y = ¬A</>
            : gate === 'NAND'
              ? <>Y = ¬(A ∧ B)</>
              : gate === 'NOR'
                ? <>Y = ¬(A ∨ B)</>
                : gate === 'XNOR'
                  ? <>Y = ¬(A ⊕ B)</>
                  : <>Y = A {info.symbol} B</>}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Expression Evaluator tab
// ---------------------------------------------------------------------------

const EXAMPLE_EXPRESSIONS = [
  'A AND B',
  'A OR B',
  'NOT A',
  '(A AND B) OR (NOT C)',
  'A XOR B XOR C',
  '(A OR B) AND NOT(A AND B)',
  'NOT(A AND B) OR C',
];

function ExpressionEvaluator() {
  const [expression, setExpression] = useState('(A AND B) OR (NOT C)');
  const [values, setValues] = useState<Record<string, number>>({ A: 1, B: 0, C: 0 });
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [showTruthTable, setShowTruthTable] = useState(false);

  const parsed = useMemo(() => {
    try {
      const tree = parse(expression);
      return { tree, error: null as string | null };
    } catch (e) {
      return { tree: null, error: e instanceof Error ? e.message : 'Parse error' };
    }
  }, [expression]);

  const vars = useMemo(() => {
    if (!parsed.tree) return [] as string[];
    return Array.from(collectVars(parsed.tree)).sort();
  }, [parsed.tree]);

  // Keep values dictionary in sync with variables
  useEffect(() => {
    setValues(prev => {
      const next: Record<string, number> = {};
      for (const v of vars) next[v] = prev[v] ?? 0;
      return next;
    });
    setStepIndex(-1);
  }, [vars.join(',')]);  // eslint-disable-line react-hooks/exhaustive-deps

  const evaluation = useMemo(() => {
    if (!parsed.tree) return null;
    const { value, steps } = evaluate(parsed.tree, values);
    return { value, steps };
  }, [parsed.tree, values]);

  const toggleVar = (v: string) => {
    setValues(prev => ({ ...prev, [v]: prev[v] === 1 ? 0 : 1 }));
    setStepIndex(-1);
  };

  const allSteps = evaluation?.steps ?? [];
  const visibleSteps = stepIndex < 0 ? [] : allSteps.slice(0, stepIndex + 1);
  const done = stepIndex >= allSteps.length - 1 && allSteps.length > 0;

  // Truth table for expression
  const truthTable = useMemo(() => {
    if (!parsed.tree || vars.length === 0 || vars.length > 6) return null;
    const rows: { assignment: Record<string, number>; result: number }[] = [];
    for (let i = 0; i < (1 << vars.length); i++) {
      const assignment: Record<string, number> = {};
      for (let b = 0; b < vars.length; b++) {
        assignment[vars[b]] = (i >> (vars.length - 1 - b)) & 1;
      }
      const { value } = evaluate(parsed.tree, assignment);
      rows.push({ assignment, result: value });
    }
    return rows;
  }, [parsed.tree, vars]);

  return (
    <>
      {/* Expression input */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Boolean expression</label>
        <input
          type="text"
          value={expression}
          onChange={e => setExpression(e.target.value)}
          placeholder="e.g. (A AND B) OR NOT C"
          className={`w-full px-4 py-3 border rounded-md font-mono text-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            parsed.error
              ? 'border-red-300 focus:ring-red-400'
              : 'border-gray-300 focus:ring-gray-900'
          }`}
          spellCheck={false}
        />
        {parsed.error && (
          <p className="mt-2 text-sm text-red-600">{parsed.error}</p>
        )}

        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Try one:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_EXPRESSIONS.map(ex => (
              <button
                key={ex}
                onClick={() => setExpression(ex)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-mono"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Operators: <span className="font-mono">AND / OR / NOT / XOR</span>,
          or <span className="font-mono">&amp;&amp; || !</span>,
          or <span className="font-mono">&amp; | ! ^</span>,
          or <span className="font-mono">∧ ∨ ¬ ⊕</span>.
          Use parentheses for grouping. Variable names are single letters (A, B, C, …).
        </p>
      </div>

      {parsed.tree && (
        <>
          {/* Variable toggles */}
          {vars.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Variables</h2>
              <div className="flex flex-wrap gap-3">
                {vars.map(v => (
                  <button
                    key={v}
                    onClick={() => toggleVar(v)}
                    className={`flex flex-col items-center w-20 py-3 rounded-lg border-2 transition-all ${
                      values[v] === 1
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <span className="text-xs text-gray-500 font-medium">{v}</span>
                    <span className={`text-3xl font-bold font-mono ${values[v] === 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {values[v] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Click each variable to flip its value.
              </p>
            </div>
          )}

          {/* Result + step-by-step */}
          {evaluation && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Evaluation</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-gray-500">Result</span>
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-2xl font-bold font-mono ${
                    evaluation.value === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {evaluation.value}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                <div className="text-gray-700">
                  {toStringAST(parsed.tree)}
                </div>
                <div className="text-gray-500 text-xs mt-1">expression</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                <div className="text-gray-700">
                  {substituteVars(parsed.tree, values)}
                </div>
                <div className="text-gray-500 text-xs mt-1">after substituting variable values</div>
              </div>

              {/* Step-by-step */}
              {allSteps.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 mt-6">Step by step</h3>
                  <ol className="space-y-2">
                    {visibleSteps.map((step, i) => (
                      <li
                        key={i}
                        className={`p-3 rounded-lg border transition-all ${
                          i === stepIndex
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <div className="flex-1 font-mono text-sm text-gray-800">
                            <div>{step.before}</div>
                            <div className="text-gray-500">= {step.after} = <strong className="text-gray-900">{step.result}</strong></div>
                            <div className="text-xs text-gray-500 font-sans mt-1">{step.description}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="flex flex-wrap justify-center gap-3 mt-6">
                    {!done && (
                      <button
                        onClick={() => setStepIndex(prev => prev + 1)}
                        className="px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium text-sm"
                      >
                        {stepIndex < 0 ? 'Start Step-by-Step' : 'Next Step'}
                      </button>
                    )}
                    <button
                      onClick={() => setStepIndex(allSteps.length - 1)}
                      className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                    >
                      Show All
                    </button>
                    {stepIndex >= 0 && (
                      <button
                        onClick={() => setStepIndex(-1)}
                        className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Truth table */}
          {truthTable && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Truth Table</h2>
                <button
                  onClick={() => setShowTruthTable(v => !v)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showTruthTable ? 'Hide' : 'Show'}
                </button>
              </div>
              {showTruthTable && (
                <div className="overflow-x-auto">
                  <table className="mx-auto text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wider">
                        {vars.map(v => (
                          <th key={v} className="px-3 py-2">{v}</th>
                        ))}
                        <th className="px-3 py-2 border-l border-gray-200">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {truthTable.map((row, i) => {
                        const isActive = vars.every(v => row.assignment[v] === values[v]);
                        return (
                          <tr
                            key={i}
                            className={`transition-colors cursor-pointer hover:bg-gray-50 ${
                              isActive ? 'bg-emerald-50' : ''
                            }`}
                            onClick={() => {
                              setValues(row.assignment);
                              setStepIndex(-1);
                            }}
                          >
                            {vars.map(v => (
                              <td key={v} className="px-3 py-1.5 text-center">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded font-mono font-bold text-sm ${
                                  row.assignment[v] === 1 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {row.assignment[v]}
                                </span>
                              </td>
                            ))}
                            <td className="px-3 py-1.5 text-center border-l border-gray-200">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded font-mono font-bold text-sm ${
                                row.result === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {row.result}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {showTruthTable && (
                <p className="text-xs text-gray-500 text-center mt-3">
                  Click a row to load that variable assignment.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

// Produces a string where every variable is replaced with its current value
function substituteVars(n: ASTNode, values: Record<string, number>, parentPrec = 0): string {
  let s: string;
  if (n.kind === 'lit') s = String(n.value);
  else if (n.kind === 'var') s = String(values[n.name] ?? 0);
  else if (n.kind === 'not') s = `¬${substituteVars(n.arg, values, PREC.not)}`;
  else {
    const opSym = n.op === 'AND' ? ' ∧ ' : n.op === 'OR' ? ' ∨ ' : ' ⊕ ';
    const p = PREC[n.op];
    s = `${substituteVars(n.left, values, p)}${opSym}${substituteVars(n.right, values, p + 0.5)}`;
  }
  const np = nodePrec(n);
  if (np < parentPrec) s = `(${s})`;
  return s;
}

// ---------------------------------------------------------------------------
// Quiz tab
// ---------------------------------------------------------------------------

type QuizMode = 'gate' | 'expression';

type GateQuestion = {
  kind: 'gate';
  gate: GateType;
  inputs: number[];
  answer: number;
};

type ExprQuestion = {
  kind: 'expression';
  expression: string;
  tree: ASTNode;
  values: Record<string, number>;
  answer: number;
};

type Question = GateQuestion | ExprQuestion;

const QUIZ_EXPRESSIONS = [
  'A AND B',
  'A OR B',
  'NOT A',
  'NOT A AND B',
  'A AND NOT B',
  'A OR NOT B',
  '(A AND B) OR C',
  'A AND (B OR C)',
  '(A OR B) AND C',
  'NOT(A AND B)',
  'NOT(A OR B)',
  'A XOR B',
  '(A AND B) OR (NOT A AND NOT B)',
  'NOT A OR (B AND C)',
  '(A OR B) AND (NOT A OR C)',
];

function randomGateQuestion(): GateQuestion {
  const gate = GATE_ORDER[Math.floor(Math.random() * GATE_ORDER.length)];
  const info = GATES[gate];
  const inputs = Array.from({ length: info.arity }, () => Math.round(Math.random()));
  return { kind: 'gate', gate, inputs, answer: info.compute(inputs) };
}

function randomExprQuestion(): ExprQuestion {
  const expression = QUIZ_EXPRESSIONS[Math.floor(Math.random() * QUIZ_EXPRESSIONS.length)];
  const tree = parse(expression);
  const vars = Array.from(collectVars(tree)).sort();
  const values: Record<string, number> = {};
  for (const v of vars) values[v] = Math.round(Math.random());
  const { value } = evaluate(tree, values);
  return { kind: 'expression', expression, tree, values, answer: value };
}

function Quiz() {
  const [mode, setMode] = useState<QuizMode>('gate');
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const startNew = (newMode: QuizMode = mode) => {
    const q = newMode === 'gate' ? randomGateQuestion() : randomExprQuestion();
    setQuestion(q);
    setSelected(null);
    setFeedback(null);
  };

  const changeMode = (newMode: QuizMode) => {
    setMode(newMode);
    setScore({ correct: 0, total: 0 });
    startNew(newMode);
  };

  const submit = () => {
    if (!question || selected === null) return;
    const correct = selected === question.answer;
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    setFeedback({
      correct,
      message: correct
        ? 'Correct!'
        : `Not quite — the answer is ${question.answer}.`,
    });
  };

  return (
    <div>
      {/* Mode selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Question type</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => changeMode('gate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'gate' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Gate output
          </button>
          <button
            onClick={() => changeMode('expression')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'expression' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Expression value
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Practice Quiz</h2>
          {score.total > 0 && (
            <span className="text-sm text-gray-500">
              Score: {score.correct}/{score.total}
            </span>
          )}
        </div>

        {!question ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              {mode === 'gate'
                ? 'Given a logic gate and its inputs, determine the output.'
                : 'Given a boolean expression and variable values, determine the result.'}
            </p>
            <button
              onClick={() => startNew()}
              className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div>
            {question.kind === 'gate' ? (
              <GateQuestionView question={question} />
            ) : (
              <ExprQuestionView question={question} />
            )}

            {/* Answer buttons */}
            <div className="flex justify-center gap-4 mt-6">
              {[0, 1].map(choice => (
                <button
                  key={choice}
                  onClick={() => {
                    if (feedback) return;
                    setSelected(choice);
                  }}
                  disabled={!!feedback}
                  className={`w-24 h-24 rounded-2xl text-4xl font-bold font-mono border-2 transition-all ${
                    selected === choice
                      ? feedback
                        ? feedback.correct
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                          : 'border-red-500 bg-red-100 text-red-700'
                        : 'border-gray-900 bg-gray-900 text-white'
                      : feedback && choice === question.answer
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-50'
                  } ${feedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {choice}
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`mt-6 text-center p-3 rounded-lg ${
                feedback.correct
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {feedback.message}
              </div>
            )}

            <div className="flex justify-center gap-3 mt-6">
              {!feedback ? (
                <button
                  onClick={submit}
                  disabled={selected === null}
                  className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={() => startNew()}
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

function GateQuestionView({ question }: { question: GateQuestion }) {
  return (
    <div>
      <p className="text-gray-700 text-center mb-4">
        What is the output of this <strong>{question.gate}</strong> gate?
      </p>
      <div className="flex justify-center">
        <GateDisplay
          gate={question.gate}
          inputs={question.inputs}
          interactive={false}
        />
      </div>
    </div>
  );
}

function ExprQuestionView({ question }: { question: ExprQuestion }) {
  const vars = Object.keys(question.values).sort();
  return (
    <div>
      <p className="text-gray-700 text-center mb-4">
        Evaluate the expression for the given values.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-center text-xl mb-4">
        {toStringAST(question.tree)}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {vars.map(v => (
          <div
            key={v}
            className={`flex flex-col items-center w-16 py-2 rounded-lg border-2 ${
              question.values[v] === 1
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <span className="text-xs text-gray-500 font-medium">{v}</span>
            <span className={`text-2xl font-bold font-mono ${question.values[v] === 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
              {question.values[v]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
