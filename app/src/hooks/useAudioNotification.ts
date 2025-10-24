/**
 * Audio Notification Hook
 * Plays a pleasant notification sound when the timer completes
 */

import { useCallback, useRef } from 'react';

export const useAudioNotification = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playNotification = useCallback(() => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      // Create a pleasant notification sound with multiple tones
      const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.3) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        // Envelope for smooth attack and release
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Play a pleasant three-tone notification (C-E-G chord progression)
      playTone(523.25, now, 0.3, 0.2); // C5
      playTone(659.25, now + 0.15, 0.3, 0.15); // E5
      playTone(783.99, now + 0.3, 0.5, 0.2); // G5
    } catch (error) {
      console.warn('Audio notification failed:', error);
    }
  }, []);

  return { playNotification };
};

