import { describe, expect, it } from 'vitest';
import { parseDuration } from '../parseDuration';

describe('parseDuration', () => {
  it('parses seconds shorthand', () => {
    const result = parseDuration('30s');
    expect(result.minutes).toBeCloseTo(0.5);
    expect(result.error).toBeUndefined();
  });

  it('parses minutes shorthand', () => {
    const result = parseDuration('20m');
    expect(result.minutes).toBe(20);
    expect(result.error).toBeUndefined();
  });

  it('parses hour shorthand', () => {
    const result = parseDuration('1h');
    expect(result.minutes).toBe(60);
  });

  it('parses composite formats with spaces', () => {
    const result = parseDuration('1h 20m 30s');
    expect(result.minutes).toBeCloseTo(80.5);
  });

  it('parses mixed spacing variants', () => {
    const result = parseDuration('1 h20m');
    expect(result.minutes).toBe(80);
  });

  it('falls back to pure minute numbers', () => {
    const result = parseDuration('45');
    expect(result.minutes).toBe(45);
  });

  it('rejects invalid tokens when leftovers remain', () => {
    const result = parseDuration('10x');
    expect(result.error).toBeDefined();
    expect(Number.isNaN(result.minutes)).toBe(true);
  });

  it('rejects zero or negative durations', () => {
    const zero = parseDuration('0m');
    const negative = parseDuration('-5m');

    expect(zero.error).toBeDefined();
    expect(negative.error).toBeDefined();
  });

  it('handles uppercase units', () => {
    const result = parseDuration('2H 15M');
    expect(result.minutes).toBe(135);
  });
});
