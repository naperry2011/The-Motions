'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { QuizOption, QuizQuestion } from '@/lib/quiz-data';
import { WaitlistForm } from '@/components/ui/WaitlistForm';

type Phase = 'intro' | 'question' | 'result';

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [index, setIndex] = useState(0);

  const total = questions.length;

  function start() {
    setAnswers([]);
    setIndex(0);
    setPhase('question');
  }

  function pick(option: QuizOption) {
    const next = [...answers, option];
    setAnswers(next);
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      setPhase('result');
    }
  }

  function restart() {
    setPhase('intro');
    setAnswers([]);
    setIndex(0);
  }

  if (phase === 'intro') return <Intro total={total} onStart={start} />;
  if (phase === 'question') {
    return (
      <Question
        index={index}
        total={total}
        question={questions[index]}
        onPick={pick}
      />
    );
  }
  return <Result answers={answers} onRestart={restart} />;
}

function Intro({ total, onStart }: { total: number; onStart: () => void }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-display text-[11px] uppercase tracking-[0.3em] text-terracotta">
        {total} questions · 90 seconds
      </p>
      <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
        <span className="display-offset">What motions</span>
        <br />
        <span className="font-editorial italic text-teal">
          are showing up for you?
        </span>
      </h1>
      <p className="mt-8 text-lg text-ink/80">
        Nine pairs of feelings. Pick the one that sounds more like you{' '}
        <span className="font-editorial italic">right now</span>. We&apos;ll surface the
        motion that&apos;s loudest.
      </p>
      <button
        onClick={onStart}
        className="mt-10 inline-block rounded-full border-3 border-ink bg-terracotta px-7 py-3 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon transition-transform hover:-translate-y-1"
      >
        Start the quiz →
      </button>
    </div>
  );
}

function Question({
  index,
  total,
  question,
  onPick
}: {
  index: number;
  total: number;
  question: QuizQuestion;
  onPick: (o: QuizOption) => void;
}) {
  // Randomize which option appears on the left so users don't infer
  // "shadow is always A". Stable per question so it doesn't jitter on render.
  const flip = question.pairIndex % 2 === 0;
  const optionA = flip ? question.grounded : question.shadow;
  const optionB = flip ? question.shadow : question.grounded;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="font-display text-[11px] uppercase tracking-[0.25em] text-ink/60">
          Question {index + 1} of {total}
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full border-2 border-ink bg-cream sm:w-48">
          <motion.div
            className="h-full bg-terracotta"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <p className="mt-8 font-editorial text-2xl italic leading-snug text-ink sm:text-3xl md:text-4xl">
        Which sounds more like you right now?
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-8 grid gap-5 md:grid-cols-2"
        >
          <OptionCard option={optionA} onClick={() => onPick(optionA)} />
          <OptionCard option={optionB} onClick={() => onPick(optionB)} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OptionCard({
  option,
  onClick
}: {
  option: QuizOption;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-3xl border-3 border-ink bg-cream p-6 text-left shadow-cartoon transition-transform hover:-translate-y-1 hover:bg-mustard sm:p-8"
    >
      <p className="font-display text-xl leading-snug text-ink sm:text-2xl">
        {option.descriptor}.
      </p>
      <p className="mt-6 inline-flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.25em] text-terracotta opacity-0 transition-opacity group-hover:opacity-100">
        Pick this one →
      </p>
    </button>
  );
}

function Result({
  answers,
  onRestart
}: {
  answers: QuizOption[];
  onRestart: () => void;
}) {
  const shadows = answers.filter((a) => a.state === 'shadow');
  const groundeds = answers.filter((a) => a.state === 'grounded');
  const dominantState = shadows.length >= groundeds.length ? 'shadow' : 'grounded';
  const pool = dominantState === 'shadow' ? shadows : groundeds;
  // Surface the most-recently-picked motion in the dominant state ("loudest
  // right now"). Fallback to first pick if for some reason pool is empty.
  const primary = pool[pool.length - 1] ?? answers[answers.length - 1];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="font-display text-[11px] uppercase tracking-[0.3em] text-terracotta">
        Right now, you&apos;re moving through
      </p>
      <h1 className="mt-6 font-display text-5xl leading-[0.95] sm:text-6xl md:text-8xl">
        <span className="display-offset">{primary.name}.</span>
      </h1>
      <p className="mt-8 font-editorial text-2xl italic leading-snug text-ink/85 sm:text-3xl">
        {primary.descriptor}.
      </p>
      <p className="mt-6 text-base text-ink/70 sm:text-lg">
        {dominantState === 'shadow'
          ? "It's the shadow state showing up loudest in your answers — which means there's a grounded counterpart already trying to meet you."
          : "It's the grounded state showing up loudest in your answers — which means you're moving in your own rhythm right now."}
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href={`/universe/characters/${primary.slug}`}
          className="rounded-full border-3 border-ink bg-terracotta px-6 py-3 text-xs font-display uppercase tracking-wider text-cream shadow-cartoon transition-transform hover:-translate-y-1"
        >
          Meet {primary.name} →
        </Link>
        <Link
          href="/workbook"
          className="rounded-full border-3 border-ink bg-cream px-6 py-3 text-xs font-display uppercase tracking-wider text-ink shadow-cartoon-sm transition-transform hover:-translate-y-1"
        >
          The workbook is coming
        </Link>
        <button
          onClick={onRestart}
          className="rounded-full border-3 border-ink bg-transparent px-6 py-3 text-xs font-display uppercase tracking-wider text-ink transition-transform hover:-translate-y-1"
        >
          Take it again
        </button>
      </div>

      <div className="mt-14 rounded-3xl border-3 border-ink bg-mustard p-6 shadow-cartoon-lg sm:p-8">
        <p className="font-display text-xl leading-snug text-ink sm:text-2xl">
          Want this in your inbox?
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">
          We&apos;ll send your result + Module 01 of the workbook, free.
        </p>
        <div className="mt-5 flex justify-center">
          <WaitlistForm
            source="quiz"
            buttonLabel="Send it"
            successMessage="On its way — check your inbox."
          />
        </div>
      </div>
    </div>
  );
}
