/**
 * Countdown Timer Application - Countdown Hook
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCountdownReturn {
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  progress: number; // 0 to 1
  percentRemaining: number; // 0 to 100
  startedAt: Date | null;
  endsAt: Date | null;
  start: (minutes: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  clear: () => void;
  formatTime: () => string;
}

export const useCountdown = (): UseCountdownReturn => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [endsAt, setEndsAt] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null); // Store target end timestamp
  const totalDurationMsRef = useRef<number>(0);

  const isFinished = totalTime > 0 && remainingMs === 0;
  const progress =
    totalDurationMsRef.current > 0
      ? Math.max(0, Math.min(1, remainingMs / totalDurationMsRef.current))
      : 1;
  const percentRemaining = progress * 100;
  const isPaused = !isRunning && !isFinished && totalTime > 0;

  const start = useCallback((minutes: number) => {
    const seconds = minutes * 60;
    const now = Date.now();
    const totalDurationMs = seconds * 1000;
    const endTime = now + totalDurationMs;

    endTimeRef.current = endTime;
    totalDurationMsRef.current = totalDurationMs;
    setTotalTime(seconds);
    setTimeRemaining(seconds);
    setRemainingMs(totalDurationMs);
    setStartedAt(new Date(now));
    setEndsAt(new Date(endTime));
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (endTimeRef.current) {
      const now = Date.now();
      const remaining = Math.max(0, endTimeRef.current - now);
      setRemainingMs(remaining);
      setTimeRemaining(Math.ceil(remaining / 1000));
    }
    setIsRunning(false);
    endTimeRef.current = null;
    setEndsAt(null);
  }, []);

  const resume = useCallback(() => {
    if (timeRemaining > 0) {
      const now = Date.now();
      const currentRemainingMs =
        remainingMs > 0 ? remainingMs : timeRemaining * 1000;
      const endTime = now + currentRemainingMs;
      endTimeRef.current = endTime;
      setEndsAt(new Date(endTime));
      setRemainingMs(currentRemainingMs);
      setIsRunning(true);
    }
  }, [remainingMs, timeRemaining]);

  const reset = useCallback(() => {
    if (totalDurationMsRef.current <= 0) {
      return;
    }

    setIsRunning(false);
    setTimeRemaining(totalTime > 0 ? totalTime : Math.ceil(totalDurationMsRef.current / 1000));
    setRemainingMs(totalDurationMsRef.current);
    setStartedAt(null);
    setEndsAt(null);
    endTimeRef.current = null;
  }, [totalTime]);

  const clear = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(0);
    setTotalTime(0);
    setRemainingMs(0);
    setStartedAt(null);
    setEndsAt(null);
    totalDurationMsRef.current = 0;
    endTimeRef.current = null;
  }, []);

  const formatTime = useCallback((): string => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, [timeRemaining]);

  useEffect(() => {
    if (isRunning && endTimeRef.current !== null) {
      /**
       * HIGH-PRECISION COUNTDOWN TIMER IMPLEMENTATION
       *
       * This implementation ensures perfect accuracy with zero drift by:
       *
       * 1. TIMESTAMP-BASED CALCULATION:
       *    - Stores the target end time as an absolute timestamp (endTimeRef.current)
       *    - On each tick, calculates remaining time from current timestamp vs. target
       *    - Formula: remaining = endTime - Date.now()
       *    - This prevents accumulation of timing errors from setInterval
       *
       * 2. DRIFT COMPENSATION:
       *    - setInterval may fire late due to browser throttling or system load
       *    - By recalculating from timestamps, we automatically compensate for any drift
       *    - Even if the browser backgrounds the tab, accuracy is maintained
       *
       * 3. SMOOTH UPDATES:
       *    - Updates every 100ms for smooth visual display
       *    - But time calculation is always based on actual elapsed time
       *    - This gives smooth animations without sacrificing accuracy
       *
      * 4. PAUSE/RESUME ACCURACY:
       *    - When paused, we store the remaining time in state
       *    - When resumed, we calculate a new end timestamp: now + remaining
       *    - This maintains accuracy across pause/resume cycles
       */
      intervalRef.current = setInterval(() => {
        if (endTimeRef.current === null) {
          setIsRunning(false);
          return;
        }

        const now = Date.now();
        const rawRemainingMs = Math.max(0, endTimeRef.current - now);
        const remainingSeconds = Math.max(0, Math.ceil(rawRemainingMs / 1000));

        setRemainingMs(rawRemainingMs);
        setTimeRemaining(remainingSeconds);
        setEndsAt(new Date(endTimeRef.current));

        if (rawRemainingMs <= 0) {
          setIsRunning(false);
          endTimeRef.current = null;
          setEndsAt(new Date(now));
        }
      }, 100); // Update every 100ms for smooth display, but time is calculated from timestamp
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return {
    timeRemaining,
    totalTime,
    isRunning,
    isPaused,
    isFinished,
    progress,
    percentRemaining,
    startedAt,
    endsAt,
    start,
    pause,
    resume,
    reset,
    clear,
    formatTime,
  };
};
