import { formatCountdown, secondsRemaining } from './reading-timer';

describe('reading countdown helpers', () => {
  it('formats remaining time as minutes and seconds', () => {
    expect(formatCountdown(1_505)).toBe('25:05');
    expect(formatCountdown(0)).toBe('00:00');
  });

  it('rounds a partial second up and never returns a negative value', () => {
    expect(secondsRemaining(10_001, 10_000)).toBe(1);
    expect(secondsRemaining(9_000, 10_000)).toBe(0);
  });
});
