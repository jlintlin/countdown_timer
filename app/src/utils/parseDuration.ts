/**
 * Utility to parse human-friendly duration strings into minutes.
 * Supports tokens like "30s", "20m", "1h20m", and spaced variants ("1 h 20 m").
 */

const UNIT_IN_SECONDS: Record<string, number> = {
  h: 3600,
  hour: 3600,
  hours: 3600,
  hr: 3600,
  hrs: 3600,
  m: 60,
  min: 60,
  mins: 60,
  minute: 60,
  minutes: 60,
  s: 1,
  sec: 1,
  secs: 1,
  second: 1,
  seconds: 1,
};

const TOKEN_REGEX =
  /(\d+(?:\.\d+)?)\s*(h(?:ours?)?|hr(?:s)?|m(?:in(?:utes)?)?|s(?:ec(?:onds)?)?)/gi;

export interface ParsedDuration {
  minutes: number;
  error?: string;
}

/**
 * Parses a duration string into minutes.
 * Accepts composite formats (e.g., "1h 30m", "90s") and pure minute numbers.
 */
export const parseDuration = (raw: string): ParsedDuration => {
  if (!raw) {
    return { minutes: Number.NaN, error: 'Enter a duration.' };
  }

  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { minutes: Number.NaN, error: 'Enter a duration.' };
  }

  let totalSeconds = 0;
  let tokenMatchFound = false;

  const consumed = trimmed.replace(TOKEN_REGEX, (_match, value, unit) => {
    tokenMatchFound = true;
    const numeric = Number.parseFloat(value);
    const normalizedUnit = unit.toLowerCase();
    const seconds = UNIT_IN_SECONDS[normalizedUnit] ?? 0;

    if (Number.isNaN(numeric) || seconds === 0) {
      return '';
    }

    totalSeconds += numeric * seconds;
    return ' ';
  });

  if (tokenMatchFound) {
    const leftover = consumed.replace(/[\s,.-]+/g, ' ').trim();

    if (leftover.length > 0) {
      return {
        minutes: Number.NaN,
        error: 'Unrecognized duration format. Try combining values like "1h 20m".',
      };
    }

    const minutes = totalSeconds / 60;
    if (minutes <= 0) {
      return {
        minutes: Number.NaN,
        error: 'Duration must be greater than zero.',
      };
    }

    return { minutes };
  }

  const numericMinutes = Number.parseFloat(trimmed);

  if (!Number.isNaN(numericMinutes) && numericMinutes > 0) {
    return { minutes: numericMinutes };
  }

  return {
    minutes: Number.NaN,
    error:
      'Enter a valid duration (e.g., "30s", "20m", "1h 15m") or a positive number of minutes.',
  };
};
