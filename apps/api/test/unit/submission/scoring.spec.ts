import { expect, describe, it } from '@jest/globals';

function score(pointsBase: number, solvesCount: number, decayFactor = 0.05) {
  const pointsMin = Math.max(10, Math.floor(pointsBase * 0.2));
  return Math.max(pointsMin, Math.round(pointsBase * Math.E ** (-decayFactor * solvesCount)));
}

describe('dynamic scoring', () => {
  it('never drops below min', () => {
    expect(score(100, 1000)).toBeGreaterThanOrEqual(20);
  });
  it('decays with more solves', () => {
    const a = score(100, 0);
    const b = score(100, 10);
    expect(b).toBeLessThan(a);
  });
});
