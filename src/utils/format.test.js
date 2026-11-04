import { describe, expect, it } from 'vitest';
import { formatReleaseDate } from './formatReleaseDate';
import { formatRuntime } from './formatRuntime';

describe('formatReleaseDate', () => {
  it('formats a TMDB date', () => {
    expect(formatReleaseDate('2008-07-16')).toBe('16 July 2008');
  });

  it('returns null when there is no date', () => {
    expect(formatReleaseDate('')).toBeNull();
    expect(formatReleaseDate(undefined)).toBeNull();
  });
});

describe('formatRuntime', () => {
  it('formats hours and minutes', () => {
    expect(formatRuntime(148)).toBe('2h 28m');
    expect(formatRuntime(120)).toBe('2h 0m');
  });

  it('leaves out the hours for short movies', () => {
    expect(formatRuntime(45)).toBe('45m');
  });

  it('returns null when the runtime is unknown', () => {
    expect(formatRuntime(0)).toBeNull();
    expect(formatRuntime(null)).toBeNull();
  });
});
