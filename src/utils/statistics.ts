import { AnovaCalculationResult, AnovaRow, CellData, SimpleEffectResult } from '../types/anova';

/**
 * Log-gamma function using Lanczos approximation (g=5, n=6)
 */
function logGamma(z: number): number {
  if (z <= 0) return 0;
  const c = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179e-3,
    -0.5395239384953e-5,
  ];
  let x = z;
  let y = z;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < 6; j++) {
    y += 1;
    ser += c[j] / y;
  }
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

/**
 * Continued fraction representation of regularized incomplete beta function I_x(a, b)
 */
function betacf(a: number, b: number, x: number): number {
  const MAXIT = 200;
  const EPS = 3.0e-12;
  const FPMIN = 1.0e-30;

  const qab = a + b;
  const qap = a + 1.0;
  const qam = a - 1.0;
  let c = 1.0;
  let d = 1.0 - qab * x / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1.0 / d;
  let h = d;

  for (let m = 1; m <= MAXIT; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1.0 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1.0 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1.0) < EPS) break;
  }
  return h;
}

/**
 * Regularized incomplete beta function I_x(a, b)
 */
export function incBeta(a: number, b: number, x: number): number {
  if (x < 0.0 || x > 1.0) return 0;
  if (x === 0.0) return 0;
  if (x === 1.0) return 1;

  // Factor front
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1.0 - x));

  if (x < (a + 1.0) / (a + b + 2.0)) {
    return bt * betacf(a, b, x) / a;
  } else {
    return 1.0 - bt * betacf(b, a, 1.0 - x) / b;
  }
}

/**
 * Computes the p-value for the F-distribution: P(F >= f) with df1, df2
 */
export function fDistPValue(f: number, df1: number, df2: number): number {
  if (f <= 0 || isNaN(f)) return 1;
  const x = (df1 * f) / (df1 * f + df2);
  const p = 1 - incBeta(df1 / 2, df2 / 2, x);
  return Math.max(0, Math.min(1, p));
}

/**
 * Calculate Sum of Squares of deviations from mean for an array of numbers
 */
export function calculateSS(values: number[]): { mean: number; ss: number } {
  if (values.length === 0) return { mean: 0, ss: 0 };
  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = sum / values.length;
  const ss = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  return { mean, ss };
}

/**
 * Full 2x2 Between-Subjects ANOVA Engine
 */
export function compute2x2ANOVA(rawCells: {
  A1B1: number[]; // Czytanie, Krótki
  A1B2: number[]; // Czytanie, Długi
  A2B1: number[]; // Testowanie, Krótki
  A2B2: number[]; // Testowanie, Długi
}): AnovaCalculationResult {
  const calc11 = calculateSS(rawCells.A1B1);
  const calc12 = calculateSS(rawCells.A1B2);
  const calc21 = calculateSS(rawCells.A2B1);
  const calc22 = calculateSS(rawCells.A2B2);

  const n = rawCells.A1B1.length || 5;
  const a = 2;
  const b = 2;
  const N = a * b * n;

  const cells: AnovaCalculationResult['cells'] = {
    A1B1: {
      id: 'A1B1',
      name: 'Czytanie + Krótki sen',
      factorA: 'czytanie',
      factorB: 'krotki',
      labelA: 'Ponowne czytanie',
      labelB: 'Krótki sen',
      values: rawCells.A1B1,
      mean: calc11.mean,
      ss: calc11.ss,
      color: '#3B82F6', // Blue
    },
    A1B2: {
      id: 'A1B2',
      name: 'Czytanie + Długi sen',
      factorA: 'czytanie',
      factorB: 'dlugi',
      labelA: 'Ponowne czytanie',
      labelB: 'Długi sen',
      values: rawCells.A1B2,
      mean: calc12.mean,
      ss: calc12.ss,
      color: '#60A5FA', // Light blue
    },
    A2B1: {
      id: 'A2B1',
      name: 'Testowanie + Krótki sen',
      factorA: 'testowanie',
      factorB: 'krotki',
      labelA: 'Testowanie się',
      labelB: 'Krótki sen',
      values: rawCells.A2B1,
      mean: calc21.mean,
      ss: calc21.ss,
      color: '#EC4899', // Pink / Magenta
    },
    A2B2: {
      id: 'A2B2',
      name: 'Testowanie + Długi sen',
      factorA: 'testowanie',
      factorB: 'dlugi',
      labelA: 'Testowanie się',
      labelB: 'Długi sen',
      values: rawCells.A2B2,
      mean: calc22.mean,
      ss: calc22.ss,
      color: '#F472B6', // Light pink
    },
  };

  // Marginal Means
  const marginalA1 = (cells.A1B1.mean + cells.A1B2.mean) / 2;
  const marginalA2 = (cells.A2B1.mean + cells.A2B2.mean) / 2;

  const marginalB1 = (cells.A1B1.mean + cells.A2B1.mean) / 2;
  const marginalB2 = (cells.A1B2.mean + cells.A2B2.mean) / 2;

  const grandMean = (cells.A1B1.mean + cells.A1B2.mean + cells.A2B1.mean + cells.A2B2.mean) / 4;

  // Sums of Squares (SS)
  // SS_A = n * b * sum((M_Ai - M)^2)
  const ssA = n * b * (Math.pow(marginalA1 - grandMean, 2) + Math.pow(marginalA2 - grandMean, 2));

  // SS_B = n * a * sum((M_Bj - M)^2)
  const ssB = n * a * (Math.pow(marginalB1 - grandMean, 2) + Math.pow(marginalB2 - grandMean, 2));

  // SS_cells = n * sum((M_ij - M)^2)
  const ssCells = n * (
    Math.pow(cells.A1B1.mean - grandMean, 2) +
    Math.pow(cells.A1B2.mean - grandMean, 2) +
    Math.pow(cells.A2B1.mean - grandMean, 2) +
    Math.pow(cells.A2B2.mean - grandMean, 2)
  );

  // SS_AxB = SS_cells - SS_A - SS_B
  const ssAxB = Math.max(0, ssCells - ssA - ssB);

  // SS_error = sum of within-cell SS
  const ssError = cells.A1B1.ss + cells.A1B2.ss + cells.A2B1.ss + cells.A2B2.ss;

  // SS_total
  const ssTotal = ssA + ssB + ssAxB + ssError;

  // Degrees of freedom
  const dfA = a - 1; // 1
  const dfB = b - 1; // 1
  const dfAxB = (a - 1) * (b - 1); // 1
  const dfError = N - a * b; // 20 - 4 = 16
  const dfTotal = N - 1; // 19

  // Mean Squares
  const msA = ssA / dfA;
  const msB = ssB / dfB;
  const msAxB = ssAxB / dfAxB;
  const msError = dfError > 0 ? ssError / dfError : 1;

  // F ratios
  const fA = msError > 0 ? msA / msError : 0;
  const fB = msError > 0 ? msB / msError : 0;
  const fAxB = msError > 0 ? msAxB / msError : 0;

  // P values
  const pA = fDistPValue(fA, dfA, dfError);
  const pB = fDistPValue(fB, dfB, dfError);
  const pAxB = fDistPValue(fAxB, dfAxB, dfError);

  // Partial eta squared: SS_effect / (SS_effect + SS_error)
  const etaSqPA = ssA + ssError > 0 ? ssA / (ssA + ssError) : 0;
  const etaSqPB = ssB + ssError > 0 ? ssB / (ssB + ssError) : 0;
  const etaSqPAxB = ssAxB + ssError > 0 ? ssAxB / (ssAxB + ssError) : 0;

  const table: AnovaRow[] = [
    {
      source: 'A: Strategia uczenia się',
      sourceKey: 'A',
      ss: ssA,
      df: dfA,
      ms: msA,
      f: fA,
      p: pA,
      etaSqP: etaSqPA,
      significant: pA < 0.05,
    },
    {
      source: 'B: Długość snu',
      sourceKey: 'B',
      ss: ssB,
      df: dfB,
      ms: msB,
      f: fB,
      p: pB,
      etaSqP: etaSqPB,
      significant: pB < 0.05,
    },
    {
      source: 'A × B (Interakcja)',
      sourceKey: 'AxB',
      ss: ssAxB,
      df: dfAxB,
      ms: msAxB,
      f: fAxB,
      p: pAxB,
      etaSqP: etaSqPAxB,
      significant: pAxB < 0.05,
    },
    {
      source: 'Błąd (wewnątrzgrupowy)',
      sourceKey: 'error',
      ss: ssError,
      df: dfError,
      ms: msError,
    },
    {
      source: 'Ogółem (Total)',
      sourceKey: 'total',
      ss: ssTotal,
      df: dfTotal,
    },
  ];

  // Simple Main Effects (efekty proste z błędem zbiorczym MS_error)
  // 1. Strategia przy krótkim śnie (A at B1)
  const mDiffB1 = cells.A1B1.mean - cells.A2B1.mean;
  const ssStratB1 = (n * Math.pow(mDiffB1, 2)) / 2; // n * [(M1 - M_avg)^2 + (M2 - M_avg)^2]
  const fStratB1 = msError > 0 ? ssStratB1 / msError : 0;
  const pStratB1 = fDistPValue(fStratB1, 1, dfError);
  const etaStratB1 = ssStratB1 + ssError > 0 ? ssStratB1 / (ssStratB1 + ssError) : 0;

  // 2. Strategia przy długim śnie (A at B2)
  const mDiffB2 = cells.A1B2.mean - cells.A2B2.mean;
  const ssStratB2 = (n * Math.pow(mDiffB2, 2)) / 2;
  const fStratB2 = msError > 0 ? ssStratB2 / msError : 0;
  const pStratB2 = fDistPValue(fStratB2, 1, dfError);
  const etaStratB2 = ssStratB2 + ssError > 0 ? ssStratB2 / (ssStratB2 + ssError) : 0;

  // 3. Sen przy ponownym czytaniu (B at A1)
  const mDiffA1 = cells.A1B1.mean - cells.A1B2.mean;
  const ssSleepA1 = (n * Math.pow(mDiffA1, 2)) / 2;
  const fSleepA1 = msError > 0 ? ssSleepA1 / msError : 0;
  const pSleepA1 = fDistPValue(fSleepA1, 1, dfError);
  const etaSleepA1 = ssSleepA1 + ssError > 0 ? ssSleepA1 / (ssSleepA1 + ssError) : 0;

  // 4. Sen przy testowaniu (B at A2)
  const mDiffA2 = cells.A2B1.mean - cells.A2B2.mean;
  const ssSleepA2 = (n * Math.pow(mDiffA2, 2)) / 2;
  const fSleepA2 = msError > 0 ? ssSleepA2 / msError : 0;
  const pSleepA2 = fDistPValue(fSleepA2, 1, dfError);
  const etaSleepA2 = ssSleepA2 + ssError > 0 ? ssSleepA2 / (ssSleepA2 + ssError) : 0;

  const simpleEffects = {
    strategyAtShortSleep: {
      conditionName: 'Krótki sen',
      comparison: 'Testowanie vs Ponowne czytanie',
      mean1: cells.A2B1.mean,
      mean2: cells.A1B1.mean,
      f: fStratB1,
      df1: 1,
      df2: dfError,
      p: pStratB1,
      etaSqP: etaStratB1,
      significant: pStratB1 < 0.05,
      interpretation: pStratB1 < 0.05 
        ? `Przy krótkim śnie testowanie się daje istotnie wyższe wyniki niż samo czytanie (różnica ${Math.abs(cells.A2B1.mean - cells.A1B1.mean).toFixed(1)} słów).` 
        : 'Przy krótkim śnie brak istotnej różnicy między strategiami.',
    },
    strategyAtLongSleep: {
      conditionName: 'Długi sen',
      comparison: 'Testowanie vs Ponowne czytanie',
      mean1: cells.A2B2.mean,
      mean2: cells.A1B2.mean,
      f: fStratB2,
      df1: 1,
      df2: dfError,
      p: pStratB2,
      etaSqP: etaStratB2,
      significant: pStratB2 < 0.05,
      interpretation: pStratB2 < 0.05 
        ? 'Przy długim śnie występuje istotna różnica między strategiami uczenia się.' 
        : 'Przy długim śnie obie strategie dają zbliżone wyniki (brak istotnej różnicy statystycznej).',
    },
    sleepAtReading: {
      conditionName: 'Ponowne czytanie',
      comparison: 'Długi sen vs Krótki sen',
      mean1: cells.A1B2.mean,
      mean2: cells.A1B1.mean,
      f: fSleepA1,
      df1: 1,
      df2: dfError,
      p: pSleepA1,
      etaSqP: etaSleepA1,
      significant: pSleepA1 < 0.05,
      interpretation: pSleepA1 < 0.05
        ? 'Dla osób ponownie czytających długość snu jest kluczowa — długi sen drastycznie poprawia wyniki.'
        : 'Brak wpływu długości snu na zapamiętywanie przy ponownym czytaniu.',
    },
    sleepAtTesting: {
      conditionName: 'Testowanie się',
      comparison: 'Długi sen vs Krótki sen',
      mean1: cells.A2B2.mean,
      mean2: cells.A2B1.mean,
      f: fSleepA2,
      df1: 1,
      df2: dfError,
      p: pSleepA2,
      etaSqP: etaSleepA2,
      significant: pSleepA2 < 0.05,
      interpretation: pSleepA2 < 0.05
        ? 'Długość snu różnicuje wyniki również przy testowaniu.'
        : 'Dla osób testujących się wyniki są stabilne niezależnie od ilości snu (efekt ochronny / buforujący).',
    },
  };

  const percentages = {
    ssA: ssTotal > 0 ? (ssA / ssTotal) * 100 : 0,
    ssB: ssTotal > 0 ? (ssB / ssTotal) * 100 : 0,
    ssAxB: ssTotal > 0 ? (ssAxB / ssTotal) * 100 : 0,
    ssError: ssTotal > 0 ? (ssError / ssTotal) * 100 : 0,
  };

  return {
    cells,
    marginalA: { A1: marginalA1, A2: marginalA2 },
    marginalB: { B1: marginalB1, B2: marginalB2 },
    grandMean,
    table,
    simpleEffects,
    percentages,
    criticalF: 4.49, // F(1, 16) przy alpha = 0.05
  };
}

/**
 * Format p-value for scientific and academic APA presentation
 */
export function formatPValue(p: number): string {
  if (p < 0.001) return '< 0,001';
  return `= ${p.toFixed(3).replace('.', ',')}`;
}

export function formatNum(n: number, decimals: number = 2): string {
  return n.toFixed(decimals).replace('.', ',');
}
