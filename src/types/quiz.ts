export type DesignDimensions = '2x2' | '2x3' | '2x2x2';

export type DesignMode = 'between' | 'within' | 'mixed';

export type EffectPattern =
  | 'all_significant'
  | 'main_only'
  | 'interaction_only'
  | 'small_interaction'
  | 'single_main'
  | 'null';

export interface FactorDefinition {
  key: 'A' | 'B' | 'C';
  name: string;
  levels: string[];
  role: 'manipulation' | 'moderator';
  isWithin: boolean;
}

export interface GeneratedAnovaRow {
  id: string;
  label: string;
  ss: number;
  df: number;
  errorDf?: number;
  ms: number;
  f?: number;
  p?: number;
  etaSqP?: number;
  omegaSq?: number;
  isError?: boolean;
  isSectionHeader?: boolean;
  sectionTitle?: string;
  significant?: boolean;
}

export interface DescriptiveCell {
  aIdx: number;
  bIdx: number;
  cIdx: number;
  aLabel: string;
  bLabel: string;
  cLabel?: string;
  n: number;
  mean: number;
  sd: number;
  se: number;
  ciLow: number;
  ciHigh: number;
}

export interface QuizQuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface GeneratedQuizQuestion {
  id: string;
  topic: 'dimensions' | 'design_type' | 'significant_effects' | 'variable_role' | 'interaction_eval' | 'next_step';
  prompt: string;
  options: QuizQuestionOption[];
  explanation: string;
}

export interface GeneratedStudy {
  id: string;
  scenarioTitle: string;
  dimensions: DesignDimensions;
  designMode: DesignMode;
  pattern: EffectPattern;
  description: string;
  nTotal: number;
  nPerCell: number;
  dvName: string;
  dvShortLabel: string;
  dvUnit: string;
  factors: {
    A: FactorDefinition;
    B: FactorDefinition;
    C?: FactorDefinition;
  };
  moderatorKey: 'A' | 'B' | 'C';
  isModeratorQuasiExperimental: boolean;
  anovaRows: GeneratedAnovaRow[];
  cells: DescriptiveCell[];
  questions: GeneratedQuizQuestion[];
  tableNote: string;
}
