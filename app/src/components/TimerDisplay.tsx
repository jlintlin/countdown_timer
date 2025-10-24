/**
 * Countdown Timer Application - Timer Display Component
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { Fragment, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerDisplayProps {
  formattedTime: string;
  progress: number;
  percentRemaining: number;
  isPaused: boolean;
  isFinished: boolean;
  startedAt: Date | null;
  endsAt: Date | null;
  accentColor: string;
}

const AnimatedSegment: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-[calc(var(--scale-gap)*0.4)]">
    <span className="relative inline-flex min-w-[clamp(4.5rem,20vmin,10rem)] items-center justify-center overflow-hidden rounded-[calc(var(--scale-radius)*0.9)] bg-slate-900/90 border border-white/20 px-[clamp(1.4rem,4.8vw,3.4rem)] py-[clamp(1.2rem,3.8vw,2.8rem)] shadow-[0_18px_55px_rgba(15,23,42,0.5)] backdrop-blur">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0, rotateX: 25 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -20, opacity: 0, rotateX: -20 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="font-black tracking-tight text-slate-100"
          style={{
            fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular)',
            fontSize: 'var(--font-mono)',
          }}
          aria-hidden="true"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
    <span className="text-[clamp(0.65rem,1.6vw,0.85rem)] uppercase tracking-[0.24em] text-slate-200">
      {label}
    </span>
  </div>
);

const AnimatedDivider: React.FC = () => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.15, ease: 'easeOut' }}
    aria-hidden="true"
    className="flex items-center justify-center self-center font-black leading-none text-white/80 drop-shadow-[0_6px_15px_rgba(15,23,42,0.45)]"
    style={{
      fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular)',
      fontSize: 'clamp(2.4rem, 10vmin, 7.2rem)',
    }}
  >
    :
  </motion.span>
);

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  formattedTime,
  progress,
  percentRemaining,
  isPaused,
  isFinished,
  startedAt,
  endsAt,
  accentColor,
}) => {
  const { segments, unitLabels, accessibleLabel } = useMemo(() => {
    const parsedSegments = formattedTime.split(':');
    const labels =
      parsedSegments.length === 3 ? ['hrs', 'min', 'sec'] : ['min', 'sec'];
    const accessibleUnits =
      parsedSegments.length === 3
        ? ['hours', 'minutes', 'seconds']
        : ['minutes', 'seconds'];

    const label = parsedSegments
      .map((segment, index) => {
        const value = Number.parseInt(segment, 10);
        const unit = accessibleUnits[index] ?? 'seconds';
        return `${value} ${unit}`;
      })
      .join(', ');

    return {
      segments: parsedSegments,
      unitLabels: labels,
      accessibleLabel: label,
    };
  }, [formattedTime]);

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      }),
    [],
  );

  const formatClock = useCallback(
    (date: Date) => timeFormatter.format(date),
    [timeFormatter],
  );

  const summaryText = useMemo(() => {
    if (isFinished) {
      if (endsAt) {
        return `Completed at ${formatClock(endsAt)}`;
      }
      return 'Completed';
    }

    if (isPaused) {
      return `Paused · ${Math.round(percentRemaining)}% remaining`;
    }

    const startText = startedAt ? `Started ${formatClock(startedAt)}` : null;
    const endText = endsAt ? `Ends ${formatClock(endsAt)}` : null;

    return [startText, endText].filter(Boolean).join(' · ');
  }, [endsAt, formatClock, isFinished, isPaused, percentRemaining, startedAt]);

  const shouldPulse = !isPaused && !isFinished && progress < 0.1 && progress > 0;
  const completionAnnouncement = isFinished ? `Countdown complete at ${summaryText || ''}` : '';

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-[calc(var(--scale-gap)*0.85)] sm:gap-[calc(var(--scale-gap)*1.1)] landscape:gap-[calc(var(--scale-gap)*0.75)]">
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {isFinished && completionAnnouncement}
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isPaused && !isFinished && "Timer paused"}
      </div>
      {/* Timer Display */}
      <motion.div
        className="relative w-full max-w-[min(100%,52rem)] rounded-[calc(var(--scale-radius)*1.15)] border-2 border-white/25 bg-slate-900/60 px-[clamp(1.4rem,5.8vw,3.8rem)] py-[clamp(1.8rem,5vw,3.6rem)] shadow-[0_30px_95px_-25px_rgba(15,23,42,0.72)] backdrop-blur-xl landscape:flex landscape:h-full landscape:flex-col landscape:justify-center"
        style={{ willChange: shouldPulse ? 'box-shadow' : 'auto', transform: 'translateZ(0)' }}
        animate={
          shouldPulse
            ? {
                boxShadow: [
                  '0 25px 80px -20px rgba(220, 38, 38, 0.4)',
                  '0 30px 90px -15px rgba(220, 38, 38, 0.6)',
                  '0 25px 80px -20px rgba(220, 38, 38, 0.4)',
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: shouldPulse ? Infinity : 0, ease: 'easeInOut' }}
      >
        {isPaused && !isFinished && (
          <>
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur z-10">
              Paused
            </div>
            <motion.div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-[calc(var(--scale-radius)*1.15)] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">⏸ PAUSED</span>
            </motion.div>
          </>
        )}

        <output
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Time remaining: ${accessibleLabel}`}
          className="flex flex-col items-center gap-5"
        >
          <div className="flex flex-nowrap items-center justify-center gap-[clamp(0.95rem,4vw,2.85rem)] px-[calc(var(--scale-gap)*0.35)] text-white whitespace-nowrap">
            {segments.map((segment, index) => (
              <Fragment key={`${index}-${segment}`}>
                <AnimatedSegment value={segment} label={unitLabels[index]} />
                {index < segments.length - 1 && <AnimatedDivider />}
              </Fragment>
            ))}
          </div>

          {!isFinished && (
            <span className="rounded-full border border-slate-900/25 bg-white/95 px-4 py-1.5 text-xs sm:text-sm font-bold tracking-wide text-slate-950 shadow-[0_6px_18px_rgba(15,23,42,0.28)] backdrop-blur">
              {Math.round(percentRemaining)}% remaining
            </span>
          )}
        </output>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.9 }}
        animate={{ opacity: 1, scaleX: 1 }}
        className="w-full max-w-[min(30rem,86%)] pt-[calc(var(--scale-gap)*0.15)]"
      >
        <div className="relative h-[clamp(0.8rem,2vw,1.2rem)] overflow-hidden rounded-2xl border border-white/30 bg-white/15 shadow-inner backdrop-blur">
          <motion.div
            className="h-full rounded-2xl bg-cyan-500"
            initial={false}
            animate={{
              width: `${percentRemaining}%`,
              boxShadow: percentRemaining < 20
                ? [
                    '0 0 25px rgba(6, 182, 212, 0.6), inset 0 2px 4px rgba(15, 23, 42, 0.35)',
                    '0 0 35px rgba(6, 182, 212, 0.8), inset 0 2px 4px rgba(15, 23, 42, 0.35)',
                    '0 0 25px rgba(6, 182, 212, 0.6), inset 0 2px 4px rgba(15, 23, 42, 0.35)',
                  ]
                : '0 0 25px rgba(6, 182, 212, 0.6), inset 0 2px 4px rgba(15, 23, 42, 0.35)'
            }}
            transition={{
              duration: 0.45,
              ease: 'easeOut',
              boxShadow: { duration: 1.5, repeat: percentRemaining < 20 ? Infinity : 0 }
            }}
          />
        </div>
        {summaryText && (
          <div className="mt-3 flex justify-center px-2">
            <span className="rounded-full border border-slate-900/20 bg-white/90 px-[clamp(0.85rem,2.4vw,1.25rem)] py-[clamp(0.45rem,1.4vw,0.8rem)] text-[clamp(0.78rem,1.9vw,0.95rem)] font-semibold text-slate-950 shadow-[0_6px_18px_rgba(15,23,42,0.25)] backdrop-blur">
              {summaryText}
            </span>
          </div>
        )}
      </motion.div>

      {/* Finished Message */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              y: [0, -10, 0]
            }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              y: { repeat: 3, duration: 0.5 }
            }}
            className="rounded-[calc(var(--scale-radius)*1.05)] bg-white px-[clamp(1.4rem,4.5vw,2.5rem)] py-[clamp(1.2rem,3.6vw,2rem)] text-center shadow-[0_28px_70px_-18px_rgba(15,23,42,0.32)]"
          >
            <div className="text-[clamp(3rem,9vw,5.5rem)] font-black tracking-tight text-transparent bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text">
              🎉 Time&apos;s Up! 🎉
            </div>
            {summaryText && (
              <p className="mt-[clamp(0.5rem,1.5vw,0.8rem)] text-[clamp(0.85rem,2vw,1.05rem)] font-semibold text-slate-600">
                {summaryText}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
