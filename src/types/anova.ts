export interface CellData {
  id: string;
  name: string;
  factorA: 'czytanie' | 'testowanie';
  factorB: 'krotki' | 'dlugi';
  labelA: string;
  labelB: string;
  values: number[];
  mean: number;
  ss: number;
  color: string;
}

export interface AnovaRow {
  source: string;
  sourceKey: 'A' | 'B' | 'AxB' | 'error' | 'total';
  ss: number;
  df: number;
  ms?: number;
  f?: number;
  p?: number;
  etaSqP?: number;
  significant?: boolean;
}

export interface SimpleEffectResult {
  conditionName: string;
  comparison: string;
  mean1: number;
  mean2: number;
  f: number;
  df1: number;
  df2: number;
  p: number;
  etaSqP: number;
  significant: boolean;
  interpretation: string;
}

export interface AnovaCalculationResult {
  cells: {
    A1B1: CellData; // Czytanie, Krótki
    A1B2: CellData; // Czytanie, Długi
    A2B1: CellData; // Testowanie, Krótki
    A2B2: CellData; // Testowanie, Długi
  };
  marginalA: {
    A1: number; // Czytanie
    A2: number; // Testowanie
  };
  marginalB: {
    B1: number; // Krótki
    B2: number; // Długi
  };
  grandMean: number;
  table: AnovaRow[];
  simpleEffects: {
    strategyAtShortSleep: SimpleEffectResult;
    strategyAtLongSleep: SimpleEffectResult;
    sleepAtReading: SimpleEffectResult;
    sleepAtTesting: SimpleEffectResult;
  };
  percentages: {
    ssA: number;
    ssB: number;
    ssAxB: number;
    ssError: number;
  };
  criticalF: number;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  didacticPoint: string;
  cells: {
    A1B1: number[];
    A1B2: number[];
    A2B1: number[];
    A2B2: number[];
  };
}
