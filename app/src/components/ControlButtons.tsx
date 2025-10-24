/**
 * Countdown Timer Application - Control Buttons Component
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { useEffect, useRef } from 'react';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';

interface ControlButtonsProps {
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  hasTimer: boolean;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStartNew: () => void;
  className?: string;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  isRunning,
  isPaused,
  isFinished,
  hasTimer,
  onPause,
  onResume,
  onReset,
  onStartNew,
  className = '',
}) => {
  const resetButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (hasTimer && isFinished && resetButtonRef.current) {
      resetButtonRef.current.focus();
    }
  }, [hasTimer, isFinished]);

  if (!hasTimer) return null;

  const handleTogglePress = () => {
    if (isRunning) {
      onPause();
    } else {
      onResume();
    }
  };

  const toggleLabel = isRunning ? 'Pause' : 'Resume';
  const toggleAriaLabel = isRunning ? 'Pause countdown' : 'Resume countdown';

  const baseButtonClasses =
    'min-w-[8rem] min-h-[3rem] font-semibold px-[clamp(1.2rem,3.2vw,2.2rem)] py-[clamp(0.7rem,2.2vw,1.1rem)] text-[clamp(0.95rem,2.3vw,1.15rem)] text-white shadow-[0_12px_32px_rgba(15,23,42,0.22)] transition-all rounded-[calc(var(--scale-radius)*0.85)] hover:shadow-[0_16px_38px_rgba(15,23,42,0.28)] touch-manipulation';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`flex flex-row items-center justify-center gap-[calc(var(--scale-gap)*0.8)] flex-wrap ${className}`}
    >
      {!isFinished && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onPress={handleTogglePress}
            aria-pressed={isPaused}
            aria-label={toggleAriaLabel}
            className={`${baseButtonClasses} bg-blue-600 hover:bg-blue-700 active:bg-blue-800`}
          >
            {toggleLabel}
          </Button>
        </motion.div>
      )}

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          ref={resetButtonRef}
          onPress={onReset}
          autoFocus={isFinished}
          aria-label={isFinished ? 'Reset completed timer' : 'Reset timer'}
          className={`${baseButtonClasses} bg-orange-600 hover:bg-orange-700 active:bg-orange-800`}
        >
          Reset
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="lg"
          onPress={onStartNew}
          className={`${baseButtonClasses} bg-green-600 hover:bg-green-700 active:bg-green-800`}
        >
          Start New Timer
        </Button>
      </motion.div>
    </motion.div>
  );
};
