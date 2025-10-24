/**
 * Countdown Timer Application - Main App Component
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from './hooks/useCountdown';
import { useBackgroundGradient } from './hooks/useBackgroundGradient';
import { useAudioNotification } from './hooks/useAudioNotification';
import { TimeInput } from './components/TimeInput';
import { TimerDisplay } from './components/TimerDisplay';
import { ControlButtons } from './components/ControlButtons';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CurrentDateTime } from './components/CurrentDateTime';

function App() {
  const {
    timeRemaining,
    totalTime,
    isRunning,
    isPaused,
    isFinished,
    progress,
    percentRemaining,
    start,
    pause,
    resume,
    clear,
    formatTime,
    startedAt,
    endsAt,
  } = useCountdown();

  const { background, textColor, accentColor, isCritical } = useBackgroundGradient(progress);
  const { playNotification } = useAudioNotification();

  const hasTimer = totalTime > 0;
  const [shouldFocusInput, setShouldFocusInput] = useState(true);
  const hasPlayedNotification = useRef(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'reset' | 'startNew' | null>(null);

  // Play audio notification when timer finishes
  useEffect(() => {
    if (isFinished && !hasPlayedNotification.current) {
      playNotification();
      hasPlayedNotification.current = true;
    }

    // Reset the flag when timer is reset or cleared
    if (!isFinished) {
      hasPlayedNotification.current = false;
    }
  }, [isFinished, playNotification]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    if (!hasTimer && shouldFocusInput) {
      const frame = window.requestAnimationFrame(() => {
        const input = document.getElementById('timer-input') as HTMLInputElement | null;
        if (input) {
          input.focus();
          input.select();
        }
        setShouldFocusInput(false);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    return undefined;
  }, [hasTimer, shouldFocusInput]);

  const shouldConfirmNewTimer = useMemo(() => {
    if (totalTime === 0) return false;
    if (isFinished) return false;
    if (timeRemaining === totalTime) {
      return false;
    }
    return true;
  }, [isFinished, timeRemaining, totalTime]);

  const containerClassName = useMemo(() => {
    const base = 'mx-auto flex w-full max-w-5xl flex-1 flex-col';
    const spacing = hasTimer
      ? 'gap-[calc(var(--scale-gap)*0.9)] sm:gap-[calc(var(--scale-gap)*1.1)]'
      : 'gap-[calc(var(--scale-gap)*1.2)] sm:gap-[calc(var(--scale-gap)*1.4)]';
    const alignment = hasTimer
      ? 'portrait:items-center portrait:justify-between landscape:justify-between'
      : 'items-center justify-center';
    return `${base} ${spacing} ${alignment}`;
  }, [hasTimer]);

  const headerClassName = useMemo(() => {
    const base =
      'mx-auto flex w-full max-w-4xl flex-col gap-[calc(var(--scale-gap)*0.6)] sm:flex-row sm:items-start sm:justify-between';
    return hasTimer ? base : `${base} items-center text-center sm:text-left`;
  }, [hasTimer]);

  const handleReset = useCallback(() => {
    if (shouldConfirmNewTimer) {
      setConfirmAction('reset');
      setIsConfirmModalOpen(true);
    } else {
      clear();
      setShouldFocusInput(true);
    }
  }, [clear, shouldConfirmNewTimer]);

  const handleStartNewTimer = useCallback(() => {
    if (shouldConfirmNewTimer) {
      setConfirmAction('startNew');
      setIsConfirmModalOpen(true);
    } else {
      clear();
      setShouldFocusInput(true);
    }
  }, [clear, shouldConfirmNewTimer]);

  const handleConfirmAction = useCallback(() => {
    clear();
    setShouldFocusInput(true);
    setConfirmAction(null);
  }, [clear]);

  return (
    <motion.div
      className="min-h-[100svh] w-full flex flex-col items-center px-3 py-4 sm:px-6 sm:py-6 lg:py-8 landscape:px-5 landscape:py-5 transition-all duration-700 overflow-x-hidden overflow-y-auto"
      style={{
        background,
        color: textColor,
        boxShadow: isCritical ? '0 0 80px rgba(220, 38, 38, 0.4) inset' : 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        boxShadow: isCritical
          ? [
              '0 0 80px rgba(220, 38, 38, 0.4) inset',
              '0 0 120px rgba(220, 38, 38, 0.6) inset',
              '0 0 80px rgba(220, 38, 38, 0.4) inset',
            ]
          : 'none',
      }}
      transition={{
        duration: 1,
        boxShadow: {
          duration: 2,
          repeat: isCritical ? Number.POSITIVE_INFINITY : 0,
          ease: 'easeInOut',
        },
      }}
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Main Content Container - grows to fill space */}
      <div id="main-content" className={containerClassName}>
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={headerClassName}
        >
          <div className="flex flex-col items-center gap-[calc(var(--scale-gap)*0.5)] text-center">
            <h1 className="font-extrabold tracking-tight leading-tight drop-shadow-2xl text-[length:var(--font-display)] whitespace-nowrap" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              ⏱️ Countdown Timer
            </h1>
            {!hasTimer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-[clamp(0.85rem,2.4vw,1.25rem)] py-[clamp(0.45rem,1.5vw,0.75rem)] text-[clamp(0.9rem,2.1vw,1.15rem)] font-semibold text-white/95 shadow-lg backdrop-blur"
              >
                Set your timer and watch the colors change
              </motion.p>
            )}
            <CurrentDateTime variant="badge" />
          </div>
        </motion.header>

        {!hasTimer && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto flex w-full justify-center max-w-[min(92vw,48rem)] px-[clamp(0.75rem,3vw,2rem)] sm:px-[clamp(1rem,2.6vw,2.4rem)]"
          >
            <TimeInput onStart={start} disabled={hasTimer} />
          </motion.section>
        )}

        {/* Timer Display */}
        {hasTimer && (
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-[calc(var(--scale-gap)*1.5)]">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex w-full items-center justify-center"
            >
              <TimerDisplay
                formattedTime={formatTime()}
                progress={progress}
                percentRemaining={percentRemaining}
                isPaused={isPaused}
                isFinished={isFinished}
                startedAt={startedAt}
                endsAt={endsAt}
                accentColor={accentColor}
              />
            </motion.div>

            <div className="flex w-full items-center justify-center">
              <ControlButtons
                isRunning={isRunning}
                isPaused={isPaused}
                isFinished={isFinished}
                hasTimer={hasTimer}
                onPause={pause}
                onResume={resume}
                onReset={handleReset}
                onStartNew={handleStartNewTimer}
              />
            </div>
          </div>
        )}

      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmAction === 'reset' ? 'Reset Timer?' : 'Start New Timer?'}
        message={
          confirmAction === 'reset'
            ? 'Resetting will clear the current timer and all progress will be lost. Do you want to continue?'
            : 'Starting a new timer will stop the current countdown and all progress will be lost. Do you want to continue?'
        }
        confirmText={confirmAction === 'reset' ? 'Reset Timer' : 'Start New'}
        cancelText="Cancel"
        isDangerous={true}
      />

    </motion.div>
  );
}

export default App;
