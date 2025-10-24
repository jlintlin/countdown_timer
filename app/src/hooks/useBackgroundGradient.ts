/**
 * Countdown Timer Application - Background Gradient Hook
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */

import { useMemo } from 'react';

/**
 * Custom hook to calculate dynamic background gradient based on countdown progress
 * @param progress - Value from 0 to 1 (0 = time's up, 1 = full time remaining)
 * @returns CSS gradient string, text color, accent color, and critical state flag
 */
export const useBackgroundGradient = (
  progress: number,
): { background: string; textColor: string; accentColor: string; isCritical: boolean } => {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const hexToRgb = (hex: string) => {
    const sanitized = hex.replace('#', '');
    const bigint = Number.parseInt(sanitized, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (value: number) =>
      Math.round(Math.min(255, Math.max(0, value)))
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const mixColor = (colorA: string, colorB: string, t: number) => {
    const rgbA = hexToRgb(colorA);
    const rgbB = hexToRgb(colorB);

    return rgbToHex(
      lerp(rgbA.r, rgbB.r, t),
      lerp(rgbA.g, rgbB.g, t),
      lerp(rgbA.b, rgbB.b, t),
    );
  };

  const calculateLuminance = (hexColor: string) => {
    const { r, g, b } = hexToRgb(hexColor);
    const toLinear = (channel: number) => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };

    const linearR = toLinear(r);
    const linearG = toLinear(g);
    const linearB = toLinear(b);

    return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
  };

  // Enhanced palette with 6 stops for more dramatic transitions
  // More saturated colors in critical states (< 20%)
  const palette = [
    { value: 1, colors: ['#0d9488', '#14b8a6'] },      // Teal (calm) - 100%
    { value: 0.75, colors: ['#059669', '#10b981'] },   // Green (good) - 75%
    { value: 0.5, colors: ['#eab308', '#fbbf24'] },    // Yellow (more distinct) - 50%
    { value: 0.25, colors: ['#f97316', '#fb923c'] },   // Orange (warning) - 25%
    { value: 0.1, colors: ['#ef4444', '#f87171'] },    // Red (urgent) - 10%
    { value: 0, colors: ['#dc2626', '#b91c1c'] },      // Deep red (critical) - 0%
  ];

  return useMemo(() => {
    // Clamp progress between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress));

    let upperStop = palette[0];
    let lowerStop = palette[palette.length - 1];

    if (clampedProgress >= palette[0].value) {
      upperStop = palette[0];
      lowerStop = palette[0];
    } else if (clampedProgress <= palette[palette.length - 1].value) {
      upperStop = palette[palette.length - 1];
      lowerStop = palette[palette.length - 1];
    } else {
      for (let index = 0; index < palette.length - 1; index += 1) {
        const current = palette[index];
        const next = palette[index + 1];

        if (clampedProgress <= current.value && clampedProgress >= next.value) {
          upperStop = current;
          lowerStop = next;
          break;
        }
      }
    }

    const range = upperStop.value - lowerStop.value || 1;
    const t = range === 0 ? 0 : (clampedProgress - lowerStop.value) / range;

    const startColor = mixColor(lowerStop.colors[0], upperStop.colors[0], t);
    const endColor = mixColor(lowerStop.colors[1], upperStop.colors[1], t);
    const background = `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;

    const midColor = mixColor(startColor, endColor, 0.5);
    const luminance = calculateLuminance(midColor);

    // Adjusted threshold for better contrast (WCAG AA compliance)
    const textColor = luminance > 0.5 ? '#0f172a' : '#f8fafc';

    const accentColor = mixColor(startColor, endColor, 0.25);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--timer-gradient-start', startColor);
      root.style.setProperty('--timer-gradient-end', endColor);
    }

    // Flag for critical state (< 10% remaining) to trigger pulsing animation
    const isCritical = clampedProgress < 0.1 && clampedProgress > 0;

    return {
      background,
      textColor,
      accentColor,
      isCritical,
    };
  }, [progress]);
};
