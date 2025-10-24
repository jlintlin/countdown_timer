/**
 * Countdown Timer Application - Time Input Component
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Input, Button, Card, CardBody } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import FocusLock from 'react-focus-lock';
import { parseDuration } from '../utils/parseDuration';
import { HelpfulTipsModal } from './HelpfulTipsModal';

interface TimeInputProps {
  onStart: (minutes: number) => void;
  disabled: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({ onStart, disabled }) => {
  const [minutes, setMinutes] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerHours, setDrawerHours] = useState<number>(0);
  const [drawerMinutes, setDrawerMinutes] = useState<number>(0);
  const [drawerSeconds, setDrawerSeconds] = useState<number>(0);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const hoursIncrementRef = useRef<HTMLButtonElement | null>(null);
  const minutesIncrementRef = useRef<HTMLButtonElement | null>(null);
  const secondsIncrementRef = useRef<HTMLButtonElement | null>(null);
  const validationDebounceRef = useRef<number | null>(null);

  const MIN_MINUTES = 0.0167; // ~1 second
  const MAX_MINUTES = 1440;

  const evaluateValue = (raw: string) => {
    const trimmed = raw.trim();

    if (trimmed === '') {
      return {
        minutes: Number.NaN,
        message: 'Enter a duration.',
      };
    }

    const { minutes: parsedMinutes, error } = parseDuration(trimmed);

    if (error) {
      return {
        minutes: parsedMinutes,
        message: error,
      };
    }

    if (parsedMinutes < MIN_MINUTES) {
      return {
        minutes: parsedMinutes,
        message: 'Minimum 1 second (0.0167 minutes).',
      };
    }

    if (parsedMinutes > MAX_MINUTES) {
      return {
        minutes: parsedMinutes,
        message: 'Maximum 1440 minutes (24 hours).',
      };
    }

    return { minutes: parsedMinutes, message: '' };
  };

  const { message } = evaluateValue(minutes);
  const isEmpty = minutes.trim() === '';
  // Show validation after user has typed something or touched the field
  const showValidation = touched || (!isEmpty && minutes.trim() !== '');
  const validationMessage = showValidation ? message : '';
  const hasError = showValidation && Boolean(message);
  const isValid = showValidation && !isEmpty && !hasError;
  const showPresets = !disabled;
  const helperHint = hasError
    ? 'Fix the highlighted field above to start your timer.'
    : isValid
      ? '✓ Ready to start!'
      : 'Enter a duration or use a quick preset to get started.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched(true);
    const { minutes: value, message: submitMessage } = evaluateValue(minutes);

    if (submitMessage) {
      return;
    }

    if (Number.isNaN(value)) {
      return;
    }

    onStart(value);
    setMinutes('');
    setTouched(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(e.target.value);

    // Clear existing debounce timer
    if (validationDebounceRef.current) {
      clearTimeout(validationDebounceRef.current);
    }

    // Set new debounce timer for validation
    validationDebounceRef.current = setTimeout(() => {
      setTouched(true);
    }, 500);
  };

  const handleExampleClick = (preset: string) => {
    setMinutes(preset);
    setTouched(true);
    const input = document.getElementById('timer-input') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.select();
    }
  };

  const parsedDrawerValues = useMemo(() => {
    const { minutes: parsed, error } = parseDuration(minutes.trim());
    if (error || Number.isNaN(parsed)) {
      return { hours: 0, mins: 0, secs: 0 };
    }
    const totalSeconds = Math.round(parsed * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return { hours, mins, secs };
  }, [minutes]);

  useEffect(() => {
    if (isDrawerOpen) {
      setDrawerHours(parsedDrawerValues.hours);
      setDrawerMinutes(parsedDrawerValues.mins);
      setDrawerSeconds(parsedDrawerValues.secs);

      const frame = window.requestAnimationFrame(() => {
        hoursIncrementRef.current?.focus();
      });

      return () => window.cancelAnimationFrame(frame);
    }

    return undefined;
  }, [isDrawerOpen, parsedDrawerValues.hours, parsedDrawerValues.mins, parsedDrawerValues.secs]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (validationDebounceRef.current) {
        clearTimeout(validationDebounceRef.current);
      }
    };
  }, []);

  const examplePresets = ['30s', '20m', '1h 20m', '45'];

  const limitToMaxDuration = (hours: number, mins: number, secs: number) => {
    const totalSeconds = hours * 3600 + mins * 60 + secs;
    return totalSeconds >= 0 && totalSeconds <= MAX_MINUTES * 60;
  };

  const updateDrawerValue = (unit: 'hours' | 'minutes' | 'seconds', delta: number) => {
    let nextHours = drawerHours;
    let nextMinutes = drawerMinutes;
    let nextSeconds = drawerSeconds;

    if (unit === 'hours') {
      nextHours = Math.max(0, Math.min(24, drawerHours + delta));
    } else if (unit === 'minutes') {
      nextMinutes = Math.max(0, Math.min(59, drawerMinutes + delta));
    } else {
      nextSeconds = Math.max(0, Math.min(59, drawerSeconds + delta));
    }

    if (!limitToMaxDuration(nextHours, nextMinutes, nextSeconds)) {
      return;
    }

    setDrawerHours(nextHours);
    setDrawerMinutes(nextMinutes);
    setDrawerSeconds(nextSeconds);
  };

  const formatDrawerSelection = () => {
    const parts: string[] = [];
    if (drawerHours > 0) parts.push(`${drawerHours}h`);
    if (drawerMinutes > 0) parts.push(`${drawerMinutes}m`);
    if (drawerSeconds > 0) parts.push(`${drawerSeconds}s`);
    if (parts.length === 0) {
      return '';
    }
    return parts.join(' ');
  };

  const applyDrawerSelection = () => {
    const selection = formatDrawerSelection();
    if (selection === '') {
      return;
    }
    setMinutes(selection);
    setTouched(true);
    setIsDrawerOpen(false);
    const input = document.getElementById('timer-input') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.select();
    }
  };

  const drawerTotalSeconds = useMemo(
    () => drawerHours * 3600 + drawerMinutes * 60 + drawerSeconds,
    [drawerHours, drawerMinutes, drawerSeconds],
  );

  const isDrawerSelectionValid = useMemo(
    () => drawerTotalSeconds > 0 && drawerTotalSeconds <= MAX_MINUTES * 60,
    [drawerTotalSeconds],
  );

  const handleDrawerKeyDown = (e: React.KeyboardEvent, unit: 'hours' | 'minutes' | 'seconds') => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateDrawerValue(unit, 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateDrawerValue(unit, -1);
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      if (unit === 'hours' && minutesIncrementRef.current) {
        minutesIncrementRef.current.focus();
      } else if (unit === 'minutes' && secondsIncrementRef.current) {
        secondsIncrementRef.current.focus();
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      if (unit === 'seconds' && minutesIncrementRef.current) {
        minutesIncrementRef.current.focus();
      } else if (unit === 'minutes' && hoursIncrementRef.current) {
        hoursIncrementRef.current.focus();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[min(94vw,48rem)] lg:max-w-[52rem]"
    >
      <Card className="relative overflow-hidden rounded-[calc(var(--scale-radius)*1.2)] border border-slate-200/80 bg-white/95 shadow-[0_18px_55px_-20px_rgba(15,23,42,0.35)]">
        <CardBody className="space-y-[calc(var(--scale-gap)*1.05)] p-[calc(var(--scale-gap)*1.55)] sm:p-[calc(var(--scale-gap)*1.9)]">
          {/* Helpful Tips Icon - Top Right Corner */}
          <button
            type="button"
            onClick={() => setIsHelpModalOpen(true)}
            className="absolute right-[calc(var(--scale-gap)*0.8)] top-[calc(var(--scale-gap)*0.8)] z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-400 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-600 hover:bg-slate-50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label="Show helpful tips"
            title="Show helpful tips"
          >
            <span className="text-lg font-bold">?</span>
          </button>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[calc(var(--scale-gap)*1.15)]">
            {/* Input Section */}
            <div className="flex w-full flex-col items-center gap-[calc(var(--scale-gap)*0.85)]">
              <label
                htmlFor="timer-input"
                className="text-center text-[clamp(1.1rem,2.4vw,1.45rem)] font-semibold text-slate-900"
              >
                Enter timer duration
              </label>
              <div className="w-full">
                  <Input
                    id="timer-input"
                    type="text"
                    placeholder="Try 30s, 20m, 1h 15m, or 45"
                    value={minutes}
                    onChange={handleChange}
                    disabled={disabled}
                    isInvalid={hasError}
                    errorMessage={validationMessage}
                    autoComplete="off"
                    inputMode="text"
                    size="lg"
                    variant="bordered"
                    fullWidth
                    color={isValid ? 'success' : hasError ? 'danger' : 'default'}
                    aria-describedby="timer-input-help"
                    classNames={{
                      base: 'w-full flex-1',
                      mainWrapper: 'w-full flex-1',
                      innerWrapper: 'w-full flex-1',
                      input:
                        'w-full flex items-center px-[clamp(1.35rem,4.1vw,2.15rem)] py-[clamp(0.85rem,2.6vw,1.2rem)] text-left text-[clamp(1.2rem,4vw,2.15rem)] font-bold leading-tight text-slate-900 placeholder:text-[clamp(1rem,3.2vw,1.55rem)] placeholder:font-medium placeholder:text-slate-500 focus:outline-none',
                      inputWrapper: `w-full flex min-h-[clamp(4.4rem,8.5vw,5.8rem)] items-center border-[2px] transition-all duration-200 rounded-[calc(var(--scale-radius)*1.05)] bg-white/98 shadow-[0_28px_90px_-25px_rgba(15,23,42,0.6)] hover:shadow-[0_36px_110px_-30px_rgba(15,23,42,0.62)] ${
                        isValid
                          ? 'border-emerald-500 hover:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-600'
                          : hasError
                            ? 'border-rose-500 hover:border-rose-600 focus-within:ring-2 focus-within:ring-rose-200 focus-within:border-rose-500'
                            : 'border-slate-800 bg-white/98 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-600 hover:border-slate-900'
                      }`,
                      errorMessage: 'text-rose-600 font-medium text-sm mt-2 px-1',
                    }}
                    className="w-full"
                  />
              </div>
            </div>

            {/* Quick Presets */}
            {showPresets && (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-[calc(var(--scale-radius)*0.85)] border border-blue-100/80 bg-blue-50/70 px-[clamp(0.95rem,2.8vw,1.4rem)] py-[clamp(0.75rem,2.2vw,1.1rem)] shadow-[0_14px_44px_-24px_rgba(37,99,235,0.55)]"
              >
                <p className="text-center text-[clamp(0.78rem,1.8vw,0.95rem)] font-semibold uppercase tracking-wide text-blue-700/80">
                  Quick presets
                </p>
                <div className="mt-[calc(var(--scale-gap)*0.55)] grid grid-cols-2 gap-[calc(var(--scale-gap)*0.45)] sm:grid-cols-4">
                  {examplePresets.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => {
                        handleExampleClick(preset);
                      }}
                      className="rounded-full border border-blue-200 bg-white/90 px-[clamp(0.95rem,2.6vw,1.2rem)] py-[clamp(0.45rem,1.6vw,0.7rem)] text-[clamp(0.85rem,2vw,1.05rem)] font-semibold text-blue-700 shadow-sm transition-all duration-150 hover:translate-y-[-1px] hover:border-blue-300 hover:bg-blue-100 active:scale-[0.95] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 min-h-[3rem] touch-manipulation"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Time Picker Button */}
            <Button
              type="button"
              variant="bordered"
              className="w-full max-w-[20rem] min-h-[3rem] rounded-[calc(var(--scale-radius)*0.85)] border border-slate-300/80 bg-white/80 py-[clamp(0.55rem,2vw,0.95rem)] text-[clamp(0.95rem,2.5vw,1.1rem)] font-semibold text-slate-800 shadow-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 touch-manipulation"
              onPress={() => setIsDrawerOpen(true)}
              disabled={disabled}
            >
              Open time picker
            </Button>

            {/* Start Timer Button */}
            <Button
              type="submit"
              size="lg"
              color="primary"
              disabled={disabled || hasError || isEmpty}
              className="w-full max-w-[20rem] min-h-[3rem] rounded-[calc(var(--scale-radius)*0.95)] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-[clamp(1.6rem,4.2vw,3rem)] py-[clamp(0.95rem,2.8vw,1.35rem)] text-[clamp(1.2rem,3.2vw,1.75rem)] font-semibold shadow-lg transition-transform duration-200 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] touch-manipulation"
            >
              Start Timer
            </Button>

            {/* Helper Hint */}
            {!disabled && (
              <p
                className={`text-center text-[var(--font-body)] font-medium ${
                  isValid
                    ? 'text-emerald-600'
                    : hasError
                      ? 'text-rose-600'
                      : 'text-slate-500'
                }`}
              >
                {helperHint}
              </p>
            )}
          </form>
        </CardBody>
      </Card>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 px-[clamp(0.75rem,2.6vw,1.25rem)] py-[clamp(0.75rem,2.6vw,1.25rem)] backdrop-blur landscape:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 w-full cursor-pointer"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close time picker"
            />
            <FocusLock>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className="relative z-10 w-full max-w-[min(92vw,36rem)] max-h-[92svh] rounded-t-[calc(var(--scale-radius)*1.1)] bg-white p-[clamp(1rem,3.2vw,1.6rem)] shadow-[0_24px_70px_-22px_rgba(15,23,42,0.36)] sm:rounded-[calc(var(--scale-radius)*1.2)] landscape:max-h-[88svh] landscape:overflow-hidden"
              >
              <div className="mb-[clamp(0.9rem,2.8vw,1.4rem)] flex items-center justify-between gap-[calc(var(--scale-gap)*0.45)]">
                <h3 className="text-[clamp(1.05rem,2.6vw,1.35rem)] font-bold text-slate-900">Pick a duration</h3>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-slate-100 px-[clamp(0.6rem,1.6vw,0.9rem)] py-[clamp(0.35rem,1.2vw,0.6rem)] text-[clamp(0.7rem,1.6vw,0.85rem)] font-semibold text-slate-600 transition-colors hover:bg-slate-200 min-h-[2.75rem] min-w-[2.75rem] touch-manipulation"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-3 gap-[clamp(0.75rem,2.4vw,1.1rem)]" role="group" aria-label="Time duration picker">
                {[
                  { label: 'Hours', value: drawerHours, unit: 'hours' as const, suffix: 'h' },
                  { label: 'Minutes', value: drawerMinutes, unit: 'minutes' as const, suffix: 'm' },
                  { label: 'Seconds', value: drawerSeconds, unit: 'seconds' as const, suffix: 's' },
                ].map(({ label, value, unit, suffix }) => (
                  <fieldset
                    key={unit}
                    className="flex flex-col items-center gap-[calc(var(--scale-gap)*0.45)] rounded-[calc(var(--scale-radius)*0.75)] border-0 bg-slate-50 p-[clamp(0.8rem,2.5vw,1.2rem)]"
                  >
                    <legend className="text-[clamp(0.65rem,1.6vw,0.85rem)] font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </legend>
                    <div className="flex items-baseline gap-[calc(var(--scale-gap)*0.2)] text-[clamp(1.6rem,4.2vw,2.5rem)] font-black text-slate-900">
                      <span>{value}</span>
                      <span className="text-[clamp(0.7rem,1.6vw,0.95rem)] font-semibold text-slate-500">{suffix}</span>
                    </div>
                    <div className="flex gap-[calc(var(--scale-gap)*0.35)]">
                      <button
                        ref={unit === 'hours' ? hoursIncrementRef : unit === 'minutes' ? minutesIncrementRef : secondsIncrementRef}
                        type="button"
                        className="flex min-h-[clamp(3.5rem,9vw,3.75rem)] min-w-[clamp(3.5rem,9vw,3.75rem)] items-center justify-center rounded-full bg-white px-[clamp(0.6rem,1.8vw,1rem)] py-[clamp(0.5rem,1.6vw,0.85rem)] text-[clamp(1.3rem,3.4vw,1.75rem)] font-bold text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.18)] transition hover:bg-slate-100 touch-manipulation"
                        onClick={() => updateDrawerValue(unit, 1)}
                        onKeyDown={(e) => handleDrawerKeyDown(e, unit)}
                        aria-label={`Increase ${label.toLowerCase()}`}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="flex min-h-[clamp(3.5rem,9vw,3.75rem)] min-w-[clamp(3.5rem,9vw,3.75rem)] items-center justify-center rounded-full bg-white px-[clamp(0.6rem,1.8vw,1rem)] py-[clamp(0.5rem,1.6vw,0.85rem)] text-[clamp(1.3rem,3.4vw,1.75rem)] font-bold text-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.18)] transition hover:bg-slate-100 touch-manipulation"
                        onClick={() => updateDrawerValue(unit, -1)}
                        onKeyDown={(e) => handleDrawerKeyDown(e, unit)}
                        aria-label={`Decrease ${label.toLowerCase()}`}
                      >
                        −
                      </button>
                    </div>
                  </fieldset>
                ))}
              </div>
              <div className="mt-[clamp(1.1rem,3.3vw,1.6rem)] space-y-[calc(var(--scale-gap)*0.6)]">
                {/* Total Duration Display - More Prominent */}
                <div className="rounded-[calc(var(--scale-radius)*0.9)] border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-[clamp(1rem,3vw,1.6rem)] py-[clamp(0.9rem,2.6vw,1.3rem)] text-center">
                  <p className="mb-[clamp(0.25rem,0.8vw,0.45rem)] text-[clamp(0.72rem,1.6vw,0.9rem)] font-semibold uppercase tracking-wide text-slate-500">
                    Selected Duration
                  </p>
                  <p className="text-[clamp(1.35rem,3.3vw,1.85rem)] font-black text-slate-900">
                    {Math.floor(drawerTotalSeconds / 3600)}h {Math.floor((drawerTotalSeconds % 3600) / 60)}m{' '}
                    {drawerTotalSeconds % 60}s
                  </p>
                  {!isDrawerSelectionValid && (
                    <p className="mt-[clamp(0.35rem,1vw,0.55rem)] text-[clamp(0.7rem,1.5vw,0.85rem)] font-medium text-rose-600">
                      Select at least 1 second
                    </p>
                  )}
                  {isDrawerSelectionValid && (
                    <p className="mt-[clamp(0.35rem,1vw,0.55rem)] text-[clamp(0.7rem,1.5vw,0.85rem)] font-medium text-emerald-600">
                      Ready to apply
                    </p>
                  )}
                </div>

                {/* Action Buttons - Improved Hierarchy */}
                <div className="flex flex-col-reverse gap-[calc(var(--scale-gap)*0.4)] sm:flex-row sm:justify-end">
                  <Button
                    variant="bordered"
                    onPress={() => setIsDrawerOpen(false)}
                    size="lg"
                    className="min-h-[2.75rem] rounded-[calc(var(--scale-radius)*0.85)] border-2 border-slate-300 px-[clamp(1.2rem,3vw,1.8rem)] py-[clamp(0.55rem,1.6vw,0.85rem)] text-[clamp(0.85rem,2vw,1.05rem)] font-semibold text-slate-700 transition-colors hover:bg-slate-50 touch-manipulation"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onPress={applyDrawerSelection}
                    isDisabled={!isDrawerSelectionValid}
                    size="lg"
                    className="min-h-[2.75rem] rounded-[calc(var(--scale-radius)*0.95)] bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-[clamp(1.4rem,3.4vw,2rem)] py-[clamp(0.65rem,1.9vw,0.95rem)] text-[clamp(1rem,2.4vw,1.25rem)] font-bold text-white shadow-[0_14px_36px_rgba(15,23,42,0.24)] transition-all hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 hover:scale-[1.02] hover:shadow-[0_18px_44px_rgba(15,23,42,0.3)] disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.98] touch-manipulation"
                  >
                    Apply Selection
                  </Button>
                </div>
              </div>
              </motion.div>
            </FocusLock>
          </motion.div>
        )}
      </AnimatePresence>

      <HelpfulTipsModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </motion.div>
  );
};
