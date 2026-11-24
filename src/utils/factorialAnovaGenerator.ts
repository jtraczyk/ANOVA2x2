import {
  DesignDimensions,
  DesignMode,
  DescriptiveCell,
  EffectPattern,
  FactorDefinition,
  GeneratedAnovaRow,
  GeneratedQuizQuestion,
  GeneratedStudy,
  QuizQuestionOption,
} from '../types/quiz';
import { fDistPValue } from './statistics';

function randNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function tCritical95(df: number): number {
  if (df <= 0) return 1.96;
  let low = 0.0;
  let high = 100.0;
  for (let iter = 0; iter < 48; iter++) {
    const mid = (low + high) / 2;
    const p = fDistPValue(mid * mid, 1, df);
    if (p > 0.05) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

export function formatDecimal(val: number, decimals: number = 2): string {
  return val.toFixed(decimals).replace('.', ',');
}

export function formatPVal(p: number): string {
  if (p < 0.001) return '< 0,001';
  return p.toFixed(3).replace('.', ',');
}

interface ScenarioTemplate {
  id: string;
  title: string;
  supportsWithin: boolean;
  dvName: string;
  dvShortLabel: string;
  dvUnit: string;
  baseMean: number;
  baseSD: number;
  decimals: number;
  factorA: {
    name: string;
    levels2: [string, string];
    manipDescBetween: string;
    manipDescWithin: string;
  };
  factorBModerator: {
    name: string;
    levels2: [string, string];
    levels3: [string, string, string];
    descBetween2: string;
    descBetween3: string;
    descWithin2: string;
    descWithin3: string;
  };
  factorC: {
    name: string;
    levels2: [string, string];
    descBetween: string;
    descWithin: string;
  };
}

const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  {
    id: 'mood_reactivity',
    title: 'Nastrój i reaktywność emocjonalna a zdolności poznawcze',
    supportsWithin: false,
    dvName: 'wynik w teście zdolności poznawczych',
    dvShortLabel: 'Wynik w teście zdolności poznawczych',
    dvUnit: 'pkt',
    baseMean: 125,
    baseSD: 16,
    decimals: 1,
    factorA: {
      name: 'Grupa (Nastrój)',
      levels2: ['Eksperymentalna (negatywny)', 'Kontrolna (neutralny)'],
      manipDescBetween:
        'u połowy losowo wybranych uczestników indukowano negatywny nastrój (warunek eksperymentalny), natomiast u pozostałych – nastrój neutralny (warunek kontrolny)',
      manipDescWithin: '',
    },
    factorBModerator: {
      name: 'Reaktywność emocjonalna',
      levels2: ['Niska', 'Wysoka'],
      levels3: ['Niska', 'Średnia', 'Wysoka'],
      descBetween2:
        'Dodatkowo, na podstawie standaryzowanego testu psychologicznego, uczestników sklasyfikowano jako osoby o niskiej lub wysokiej reaktywności emocjonalnej (podział po medianie)',
      descBetween3:
        'Dodatkowo, na podstawie wyników testu psychologicznego, uczestników podzielono na trzy równoliczne grupy o niskiej, średniej oraz wysokiej reaktywności emocjonalnej (podział na tercyle)',
      descWithin2: '',
      descWithin3: '',
    },
    factorC: {
      name: 'Presja czasu',
      levels2: ['Brak presji', 'Wysoka presja'],
      descBetween:
        'Ponadto połowa badanych w każdej z grup rozwiązywała test bez ograniczeń czasowych, a druga połowa pod ścisłą presją czasu',
      descWithin: '',
    },
  },
  {
    id: 'framing_nfc',
    title: 'Ramowanie przekazu i potrzeba poznania w decyzjach ryzykownych',
    supportsWithin: false,
    dvName: 'skłonność do wyboru opcji ryzykownej na skali 0–100',
    dvShortLabel: 'Skłonność do ryzyka (pkt)',
    dvUnit: 'pkt',
    baseMean: 52,
    baseSD: 12,
    decimals: 1,
    factorA: {
      name: 'Ramowanie przekazu',
      levels2: ['Ramowanie strat', 'Ramowanie zysków'],
      manipDescBetween:
        'uczestników przydzielono losowo do oceny scenariusza medycznego sformułowanego w kategoriach strat (ramowanie strat) albo zysków (ramowanie zysków)',
      manipDescWithin: '',
    },
    factorBModerator: {
      name: 'Potrzeba poznania (NFC)',
      levels2: ['Niska', 'Wysoka'],
      levels3: ['Niska', 'Umiarkowana', 'Wysoka'],
      descBetween2:
        'Przed zadaniem decyzyjnym zmierzono indywidualną potrzebę poznania (Need for Cognition) i wyodrębniono dwie podgrupy: o niskim i wysokim poziomie tej cechy (podział po medianie)',
      descBetween3:
        'Przed zadaniem decyzyjnym zmierzono potrzebę poznania (Need for Cognition) i podzielono badanych na trzy grupy: o niskim, umiarkowanym oraz wysokim jej natężeniu',
      descWithin2: '',
      descWithin3: '',
    },
    factorC: {
      name: 'Obciążenie poznawcze',
      levels2: ['Niskie', 'Wysokie'],
      descBetween:
        'Dodatkowo połowa uczestników zapamiętywała w trakcie decyzji 2-cyfrowy kod (niskie obciążenie poznawcze), a druga połowa 7-cyfrowy kod (wysokie obciążenie)',
      descWithin: '',
    },
  },
  {
    id: 'feedback_perfectionism',
    title: 'Informacja zwrotna i perfekcjonizm a wytrwałość poznawcza',
    supportsWithin: false,
    dvName: 'wytrwałość w rozwiązywaniu zadań logicznych',
    dvShortLabel: 'Czas wytrwałości (min)',
    dvUnit: 'min',
    baseMean: 18,
    baseSD: 4.5,
    decimals: 2,
    factorA: {
      name: 'Informacja zwrotna',
      levels2: ['Krytyczna', 'Wspierająca'],
      manipDescBetween:
        'część losowo dobranych uczestników otrzymała po serii próbnej krytyczną informację zwrotną o błędach, a pozostała część – wspierającą informację o postępach',
      manipDescWithin: '',
    },
    factorBModerator: {
      name: 'Perfekcjonizm',
      levels2: ['Niski', 'Wysoki'],
      levels3: ['Niski', 'Średni', 'Wysoki'],
      descBetween2:
        'Na podstawie kwestionariusza osobowości uczestników podzielono po medianie na osoby o niskim oraz wysokim nasileniu perfekcjonizmu',
      descBetween3:
        'Na podstawie kwestionariusza osobowości wyodrębniono trzy podgrupy różniące się poziomem perfekcjonizmu: niski, średni i wysoki',
      descWithin2: '',
      descWithin3: '',
    },
    factorC: {
      name: 'Trudność zadania',
      levels2: ['Łatwe', 'Trudne'],
      descBetween:
        'Połowa badanych z każdej podgrupy rozwiązywała następnie serię zadań o niskiej trudności, a druga połowa – o wysokiej trudności',
      descWithin: '',
    },
  },
  {
    id: 'stress_anxiety',
    title: 'Stres społeczny i lęk jako cecha a kontrola poznawcza',
    supportsWithin: false,
    dvName: 'liczba poprawnych odpowiedzi w zadaniu Stroopa',
    dvShortLabel: 'Poprawne próby (Stroop)',
    dvUnit: 'pkt',
    baseMean: 42,
    baseSD: 7.5,
    decimals: 1,
    factorA: {
      name: 'Warunek stresowy',
      levels2: ['Stres społeczny (TSST)', 'Kontrolny'],
      manipDescBetween:
        'losowo wybrana połowa badanych przeszła procedurę wywołującą stres społeczny przed komisją (TSST), podczas gdy grupa kontrolna wykonywała neutralne zadanie pisemne',
      manipDescWithin: '',
    },
    factorBModerator: {
      name: 'Lęk jako cecha',
      levels2: ['Niski', 'Wysoki'],
      levels3: ['Niski', 'Umiarkowany', 'Wysoki'],
      descBetween2:
        'Ponadto, na podstawie inwentarza STAI, uczestników sklasyfikowano jako osoby o niskim lub wysokim poziomie lęku jako cechy (podział po medianie)',
      descBetween3:
        'Ponadto, na podstawie inwentarza STAI, uczestników przypisano do trzech poziomów lęku jako cechy: niskiego, umiarkowanego oraz wysokiego',
      descWithin2: '',
      descWithin3: '',
    },
    factorC: {
      name: 'Wsparcie społeczne',
      levels2: ['Brak wsparcia', 'Wsparcie'],
      descBetween:
        'Dodatkowo połowa uczestników odbywała sesję w obecności wspierającego partnera badania, a druga połowa całkowicie samodzielnie',
      descWithin: '',
    },
  },
  {
    id: 'attention_load_valence',
    title: 'Obciążenie pamięci roboczej i walencja bodźców w zadaniu uwagi',
    supportsWithin: true,
    dvName: 'trafność reakcji w zadaniu wykrywania celu',
    dvShortLabel: 'Trafność reakcji (%)',
    dvUnit: '%',
    baseMean: 76,
    baseSD: 9.5,
    decimals: 1,
    factorA: {
      name: 'Walencja dystraktora',
      levels2: ['Zagrażający', 'Neutralny'],
      manipDescBetween:
        'połowa losowo przydzielonych osób wykonywała zadanie w obecności bodźców zagrażających, a druga połowa w obecności bodźców neutralnych',
      manipDescWithin:
        'każda z badanych osób wykonywała w dwóch odrębnych blokach zadanie z dystraktorami o charakterze zagrażającym oraz neutralnym (kolejność bloków zrównoważona)',
    },
    factorBModerator: {
      name: 'Obciążenie pamięci roboczej',
      levels2: ['Niskie (2-back)', 'Wysokie (3-back)'],
      levels3: ['Niskie (1-back)', 'Średnie (2-back)', 'Wysokie (3-back)'],
      descBetween2:
        'Jednocześnie zróżnicowano poziom obciążenia pamięci roboczej podczas zadania (warunek niski vs wysoki)',
      descBetween3:
        'Jednocześnie podzielono próby według trzech poziomów obciążenia pamięci roboczej (niskie, średnie oraz wysokie)',
      descWithin2:
        'W trakcie badania każdy uczestnik wykonywał zadania w dwóch warunkach obciążenia pamięci roboczej: przy niskim oraz wysokim obciążeniu',
      descWithin3:
        'Ponadto każdy badany wykonywał zadania przy trzech poziomach obciążenia pamięci roboczej: niskim, średnim oraz wysokim',
    },
    factorC: {
      name: 'Modalność bodźca',
      levels2: ['Wzrokowa', 'Słuchowa'],
      descBetween:
        'Dodatkowo część osób odbierała sygnały w modalności wzrokowej, a część w słuchowej',
      descWithin:
        'Ponadto każdy uczestnik wykonał wszystkie powyższe kombinacje zarówno dla bodźców wzrokowych, jak i słuchowych',
    },
  },
  {
    id: 'retrieval_delay_within',
    title: 'Strategia uczenia się i interwał odroczenia a pamięć',
    supportsWithin: true,
    dvName: 'odsetek poprawnie odtworzonych pojęć',
    dvShortLabel: 'Odtworzone pojęcia (%)',
    dvUnit: '%',
    baseMean: 64,
    baseSD: 11,
    decimals: 1,
    factorA: {
      name: 'Strategia nauki',
      levels2: ['Ponowne czytanie', 'Testowanie się'],
      manipDescBetween:
        'część losowo wybranych osób uczyła się materiału przez ponowne czytanie, a pozostałe przez aktywne testowanie się',
      manipDescWithin:
        'każdy uczestnik uczył się połowy par pojęć metodą ponownego czytania, a drugiej połowy metodą aktywnego testowania się',
    },
    factorBModerator: {
      name: 'Czas odroczenia testu',
      levels2: ['Natychmiastowy', 'Po 7 dniach'],
      levels3: ['Natychmiastowy', 'Po 24 godzinach', 'Po 7 dniach'],
      descBetween2:
        'Dodatkowo połowa badanych przystępowała do testu pamięciowego natychmiast po nauce, a połowa po 7 dniach',
      descBetween3:
        'Dodatkowo uczestników przydzielono do trzech terminów testu końcowego: natychmiast po nauce, po 24 godzinach lub po 7 dniach',
      descWithin2:
        'Dodatkowo każdy badany przystępował do testu pamięciowego w dwóch terminach: natychmiast po nauce oraz po 7 dniach',
      descWithin3:
        'Dodatkowo każdy uczestnik przystępował do testu pamięciowego w trzech terminach: natychmiast, po 24 godzinach oraz po 7 dniach',
    },
    factorC: {
      name: 'Trudność materiału',
      levels2: ['Łatwe pojęcia', 'Trudne pojęcia'],
      descBetween:
        'Dodatkowo połowa uczestników uczyła się zestawu pojęć łatwych, a połowa zestawu pojęć trudnych',
      descWithin:
        'W każdym z tych warunków każdy uczestnik oceniany był zarówno na pojęciach łatwych, jak i trudnych',
    },
  },
  {
    id: 'sleep_memory_mixed',
    title: 'Rodzaj treningu uważności i obciążenie zadaniem a hamowanie reakcji',
    supportsWithin: true,
    dvName: 'wskaźnik precyzji hamowania (Go/No-Go)',
    dvShortLabel: 'Precyzja hamowania (%)',
    dvUnit: '%',
    baseMean: 79,
    baseSD: 8.5,
    decimals: 1,
    factorA: {
      name: 'Trening uważności',
      levels2: ['Kontrola', 'Trening mindfulness'],
      manipDescBetween:
        'połowę losowo dobranych uczestników objęto 4-tygodniowym treningiem uważności, a drugą połowę przydzielono do grupy kontrolnej',
      manipDescWithin:
        'każdy uczestnik przeszedł zarówno sesję kontrolną, jak i sesję krótkiego treningu uważności w odstępie dwóch tygodni',
    },
    factorBModerator: {
      name: 'Tempo bodźców (Presja)',
      levels2: ['Spokojne', 'Szybkie'],
      levels3: ['Wolne', 'Umiarkowane', 'Szybkie'],
      descBetween2:
        'Równocześnie zróżnicowano tempo prezentacji bodźców w zadaniu (tempo spokojne vs szybkie)',
      descBetween3:
        'Równocześnie przydzielono badanych do trzech wariantów tempa prezentacji bodźców (wolne, umiarkowane oraz szybkie)',
      descWithin2:
        'Ponadto każdy uczestnik wykonywał zadanie w dwóch blokach różniących się tempem prezentacji bodźców: spokojnym oraz szybkim',
      descWithin3:
        'Ponadto każdy uczestnik wykonywał zadanie w trzech blokach różniących się tempem prezentacji bodźców: wolnym, umiarkowanym oraz szybkim',
    },
    factorC: {
      name: 'Pora pomiaru',
      levels2: ['Rano', 'Wieczorem'],
      descBetween:
        'Połowa osób w grupach była badana rano, a druga połowa wieczorem',
      descWithin:
        'Pomiary powtarzano u każdej z osób zarówno w sesji porannej, jak i wieczornej',
    },
  },
];

// Pattern configuration matrix
function getPatternEffects(
  pattern: EffectPattern,
  aLevels: number,
  bLevels: number,
  cLevels: number,
  scale: number
): {
  alpha: number[];
  beta: number[];
  gamma: number[];
  ab: number[][];
  ac: number[][];
  bc: number[][];
  abc: number[][][];
} {
  const alpha = new Array(aLevels).fill(0);
  const beta = new Array(bLevels).fill(0);
  const gamma = new Array(cLevels).fill(0);
  const ab = Array.from({ length: aLevels }, () => new Array(bLevels).fill(0));
  const ac = Array.from({ length: aLevels }, () => new Array(cLevels).fill(0));
  const bc = Array.from({ length: bLevels }, () => new Array(cLevels).fill(0));
  const abc = Array.from({ length: aLevels }, () =>
    Array.from({ length: bLevels }, () => new Array(cLevels).fill(0))
  );

  if (pattern === 'null') {
    return { alpha, beta, gamma, ab, ac, bc, abc };
  }

  if (pattern === 'main_only') {
    alpha[0] = -0.6 * scale;
    alpha[1] = 0.6 * scale;
    if (bLevels === 2) {
      beta[0] = -0.75 * scale;
      beta[1] = 0.75 * scale;
    } else {
      beta[0] = -0.85 * scale;
      beta[1] = 0;
      beta[2] = 0.85 * scale;
    }
    if (cLevels === 2) {
      gamma[0] = -0.55 * scale;
      gamma[1] = 0.55 * scale;
    }
    return { alpha, beta, gamma, ab, ac, bc, abc };
  }

  if (pattern === 'single_main') {
    // Only Factor B (moderator) or Factor A is significant
    if (bLevels === 3) {
      beta[0] = -0.95 * scale;
      beta[1] = 0;
      beta[2] = 0.95 * scale;
    } else {
      alpha[0] = -0.8 * scale;
      alpha[1] = 0.8 * scale;
    }
    return { alpha, beta, gamma, ab, ac, bc, abc };
  }

  if (pattern === 'interaction_only') {
    // Pure crossover / interaction where marginal main effects cancel to zero
    if (cLevels === 2) {
      for (let i = 0; i < aLevels; i++) {
        for (let j = 0; j < bLevels; j++) {
          for (let k = 0; k < cLevels; k++) {
            const sign = ((i + j + k) % 2 === 0 ? 1 : -1);
            abc[i][j][k] = sign * 0.7 * scale;
          }
        }
      }
    } else {
      if (bLevels === 2) {
        ab[0][0] = -0.78 * scale;
        ab[0][1] = 0.78 * scale;
        ab[1][0] = 0.78 * scale;
        ab[1][1] = -0.78 * scale;
      } else {
        ab[0][0] = -0.82 * scale;
        ab[0][1] = 0;
        ab[0][2] = 0.82 * scale;
        ab[1][0] = 0.82 * scale;
        ab[1][1] = 0;
        ab[1][2] = -0.82 * scale;
      }
    }
    return { alpha, beta, gamma, ab, ac, bc, abc };
  }

  if (pattern === 'small_interaction') {
    // Main effects strong, interaction small (eta2p ~ 0.03-0.05) but statistically significant (large N)
    alpha[0] = -0.55 * scale;
    alpha[1] = 0.55 * scale;
    if (bLevels === 2) {
      beta[0] = -0.65 * scale;
      beta[1] = 0.65 * scale;
    } else {
      beta[0] = -0.75 * scale;
      beta[1] = 0;
      beta[2] = 0.75 * scale;
    }
    if (cLevels === 2) {
      gamma[0] = -0.45 * scale;
      gamma[1] = 0.45 * scale;
      for (let i = 0; i < aLevels; i++) {
        for (let j = 0; j < bLevels; j++) {
          for (let k = 0; k < cLevels; k++) {
            const sign = ((i + j + k) % 2 === 0 ? 1 : -1);
            abc[i][j][k] = sign * 0.24 * scale;
          }
        }
      }
    } else if (bLevels === 2) {
      ab[0][0] = -0.23 * scale;
      ab[0][1] = 0.23 * scale;
      ab[1][0] = 0.23 * scale;
      ab[1][1] = -0.23 * scale;
    } else {
      ab[0][0] = -0.24 * scale;
      ab[0][1] = 0;
      ab[0][2] = 0.24 * scale;
      ab[1][0] = 0.24 * scale;
      ab[1][1] = 0;
      ab[1][2] = -0.24 * scale;
    }
    return { alpha, beta, gamma, ab, ac, bc, abc };
  }

  // 'all_significant' (Attachment 1 style: buffering/diverging + clear main effects)
  alpha[0] = -0.65 * scale;
  alpha[1] = 0.65 * scale;
  if (bLevels === 2) {
    beta[0] = -0.8 * scale;
    beta[1] = 0.8 * scale;
    ab[0][0] = -0.68 * scale;
    ab[0][1] = 0.68 * scale;
    ab[1][0] = 0.68 * scale;
    ab[1][1] = -0.68 * scale;
  } else {
    beta[0] = -0.85 * scale;
    beta[1] = 0.05 * scale;
    beta[2] = 0.8 * scale;
    ab[0][0] = -0.72 * scale;
    ab[0][1] = 0.1 * scale;
    ab[0][2] = 0.62 * scale;
    ab[1][0] = 0.72 * scale;
    ab[1][1] = -0.1 * scale;
    ab[1][2] = -0.62 * scale;
  }
  if (cLevels === 2) {
    gamma[0] = -0.6 * scale;
    gamma[1] = 0.6 * scale;
    for (let i = 0; i < aLevels; i++) {
      for (let j = 0; j < bLevels; j++) {
        for (let k = 0; k < cLevels; k++) {
          const sign = ((i + j + k) % 2 === 0 ? 1 : -1);
          ac[i][k] = ((i + k) % 2 === 0 ? 1 : -1) * 0.55 * scale;
          bc[j][k] = ((j + k) % 2 === 0 ? 1 : -1) * 0.55 * scale;
          abc[i][j][k] = sign * 0.6 * scale;
        }
      }
    }
  }
  return { alpha, beta, gamma, ab, ac, bc, abc };
}

interface RawDataSummary {
  anovaRows: GeneratedAnovaRow[];
  cells: DescriptiveCell[];
  nTotal: number;
  nPerCell: number;
  primaryInteractionRow: GeneratedAnovaRow;
  mainRows: GeneratedAnovaRow[];
  allEffectRows: GeneratedAnovaRow[];
}

function buildDescriptiveCells(
  cellValues: number[][][][],
  factorA: FactorDefinition,
  factorB: FactorDefinition,
  factorC?: FactorDefinition
): DescriptiveCell[] {
  const cells: DescriptiveCell[] = [];
  const aLen = factorA.levels.length;
  const bLen = factorB.levels.length;
  const cLen = factorC ? factorC.levels.length : 1;

  for (let i = 0; i < aLen; i++) {
    for (let j = 0; j < bLen; j++) {
      for (let k = 0; k < cLen; k++) {
        const vals = cellValues[i][j][k];
        const n = vals.length;
        const mean = vals.reduce((s, v) => s + v, 0) / n;
        const ss = vals.reduce((s, v) => s + Math.pow(v - mean, 2), 0);
        const sd = Math.sqrt(ss / Math.max(1, n - 1));
        const se = sd / Math.sqrt(n);
        const tCrit = tCritical95(Math.max(1, n - 1));
        const halfWidth = tCrit * se;
        cells.push({
          aIdx: i,
          bIdx: j,
          cIdx: k,
          aLabel: factorA.levels[i],
          bLabel: factorB.levels[j],
          cLabel: factorC ? factorC.levels[k] : undefined,
          n,
          mean,
          sd,
          se,
          ciLow: mean - halfWidth,
          ciHigh: mean + halfWidth,
        });
      }
    }
  }
  return cells;
}

function simulateBetweenSubjects(
  template: ScenarioTemplate,
  factorA: FactorDefinition,
  factorB: FactorDefinition,
  factorC: FactorDefinition | undefined,
  pattern: EffectPattern
): RawDataSummary {
  const aLen = factorA.levels.length;
  const bLen = factorB.levels.length;
  const cLen = factorC ? factorC.levels.length : 1;
  const numCells = aLen * bLen * cLen;

  const nPerCell =
    pattern === 'small_interaction'
      ? cLen === 2
        ? 36
        : bLen === 3
        ? 35
        : 45
      : cLen === 2
      ? 16
      : bLen === 3
      ? 20
      : 28;
  const nTotal = numCells * nPerCell;

  const eff = getPatternEffects(pattern, aLen, bLen, cLen, template.baseSD);
  const cellValues: number[][][][] = Array.from({ length: aLen }, () =>
    Array.from({ length: bLen }, () => Array.from({ length: cLen }, () => []))
  );

  // Fill with centered zero-mean noise per cell so cell means follow exact intended pattern + mild jitter
  for (let i = 0; i < aLen; i++) {
    for (let j = 0; j < bLen; j++) {
      for (let k = 0; k < cLen; k++) {
        const targetCellMean =
          template.baseMean +
          eff.alpha[i] +
          eff.beta[j] +
          eff.gamma[k] +
          eff.ab[i][j] +
          eff.ac[i][k] +
          eff.bc[j][k] +
          eff.abc[i][j][k];

        const raw: number[] = [];
        for (let m = 0; m < nPerCell; m++) {
          raw.push(randNormal() * template.baseSD);
        }
        const meanNoise = raw.reduce((s, v) => s + v, 0) / nPerCell;
        const smallJitter = randNormal() * (template.baseSD * 0.08);
        for (let m = 0; m < nPerCell; m++) {
          cellValues[i][j][k].push(targetCellMean + smallJitter + (raw[m] - meanNoise));
        }
      }
    }
  }

  // Exact factorial between-subjects SS
  let grandSum = 0;
  for (let i = 0; i < aLen; i++) {
    for (let j = 0; j < bLen; j++) {
      for (let k = 0; k < cLen; k++) {
        for (const v of cellValues[i][j][k]) grandSum += v;
      }
    }
  }
  const grandMean = grandSum / nTotal;

  const cellMean = (i: number, j: number, k: number) =>
    cellValues[i][j][k].reduce((s, v) => s + v, 0) / nPerCell;

  const meanA = Array.from({ length: aLen }, (_, i) => {
    let sum = 0;
    for (let j = 0; j < bLen; j++) for (let k = 0; k < cLen; k++) sum += cellMean(i, j, k);
    return sum / (bLen * cLen);
  });

  const meanB = Array.from({ length: bLen }, (_, j) => {
    let sum = 0;
    for (let i = 0; i < aLen; i++) for (let k = 0; k < cLen; k++) sum += cellMean(i, j, k);
    return sum / (aLen * cLen);
  });

  const meanC = Array.from({ length: cLen }, (_, k) => {
    let sum = 0;
    for (let i = 0; i < aLen; i++) for (let j = 0; j < bLen; j++) sum += cellMean(i, j, k);
    return sum / (aLen * bLen);
  });

  const meanAB = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: bLen }, (_, j) => {
      let sum = 0;
      for (let k = 0; k < cLen; k++) sum += cellMean(i, j, k);
      return sum / cLen;
    })
  );

  const meanAC = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: cLen }, (_, k) => {
      let sum = 0;
      for (let j = 0; j < bLen; j++) sum += cellMean(i, j, k);
      return sum / bLen;
    })
  );

  const meanBC = Array.from({ length: bLen }, (_, j) =>
    Array.from({ length: cLen }, (_, k) => {
      let sum = 0;
      for (let i = 0; i < aLen; i++) sum += cellMean(i, j, k);
      return sum / aLen;
    })
  );

  const ssA = bLen * cLen * nPerCell * meanA.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
  const ssB = aLen * cLen * nPerCell * meanB.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
  let ssAB = 0;
  for (let i = 0; i < aLen; i++) {
    for (let j = 0; j < bLen; j++) {
      ssAB += Math.pow(meanAB[i][j] - meanA[i] - meanB[j] + grandMean, 2);
    }
  }
  ssAB *= cLen * nPerCell;

  let ssC = 0;
  let ssAC = 0;
  let ssBC = 0;
  let ssABC = 0;
  if (cLen === 2) {
    ssC = aLen * bLen * nPerCell * meanC.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
    for (let i = 0; i < aLen; i++) {
      for (let k = 0; k < cLen; k++) {
        ssAC += Math.pow(meanAC[i][k] - meanA[i] - meanC[k] + grandMean, 2);
      }
    }
    ssAC *= bLen * nPerCell;

    for (let j = 0; j < bLen; j++) {
      for (let k = 0; k < cLen; k++) {
        ssBC += Math.pow(meanBC[j][k] - meanB[j] - meanC[k] + grandMean, 2);
      }
    }
    ssBC *= aLen * nPerCell;

    for (let i = 0; i < aLen; i++) {
      for (let j = 0; j < bLen; j++) {
        for (let k = 0; k < cLen; k++) {
          ssABC += Math.pow(
            cellMean(i, j, k) -
              meanAB[i][j] -
              meanAC[i][k] -
              meanBC[j][k] +
              meanA[i] +
              meanB[j] +
              meanC[k] -
              grandMean,
            2
          );
        }
      }
    }
    ssABC *= nPerCell;
  }

  let ssErr = 0;
  for (let i = 0; i < aLen; i++) {
    for (let j = 0; j < bLen; j++) {
      for (let k = 0; k < cLen; k++) {
        const m = cellMean(i, j, k);
        for (const v of cellValues[i][j][k]) {
          ssErr += Math.pow(v - m, 2);
        }
      }
    }
  }

  const dfA = aLen - 1;
  const dfB = bLen - 1;
  const dfAB = dfA * dfB;
  const dfC = cLen - 1;
  const dfAC = dfA * dfC;
  const dfBC = dfB * dfC;
  const dfABC = dfA * dfB * dfC;
  const dfErr = nTotal - numCells;
  const msErr = ssErr / dfErr;

  const ssTotal = ssA + ssB + ssAB + ssC + ssAC + ssBC + ssABC + ssErr;

  const makeRow = (id: string, label: string, ss: number, df: number): GeneratedAnovaRow => {
    const ms = ss / df;
    const f = ms / msErr;
    const p = fDistPValue(f, df, dfErr);
    const etaSqP = ss / (ss + ssErr);
    const omegaSq = Math.max(0, (ss - df * msErr) / (ssTotal + msErr));
    return { id, label, ss, df, errorDf: dfErr, ms, f, p, etaSqP, omegaSq, significant: p < 0.05 };
  };

  const rowA = makeRow('A', factorA.name, ssA, dfA);
  const rowB = makeRow('B', factorB.name, ssB, dfB);
  const rowAB = makeRow('AxB', `${factorA.name} × ${factorB.name}`, ssAB, dfAB);

  const effectRows: GeneratedAnovaRow[] = [rowA, rowB];
  let primaryInteractionRow = rowAB;

  if (cLen === 2 && factorC) {
    const rowC = makeRow('C', factorC.name, ssC, dfC);
    const rowAC = makeRow('AxC', `${factorA.name} × ${factorC.name}`, ssAC, dfAC);
    const rowBC = makeRow('BxC', `${factorB.name} × ${factorC.name}`, ssBC, dfBC);
    const rowABC = makeRow('AxBxC', `${factorA.name} × ${factorB.name} × ${factorC.name}`, ssABC, dfABC);
    effectRows.push(rowC, rowAB, rowAC, rowBC, rowABC);
    primaryInteractionRow = rowABC;
  } else {
    effectRows.push(rowAB);
  }

  const errRow: GeneratedAnovaRow = {
    id: 'err',
    label: 'Reszta',
    ss: ssErr,
    df: dfErr,
    ms: msErr,
    isError: true,
  };

  const cells = buildDescriptiveCells(cellValues, factorA, factorB, factorC);
  const mainRows = cLen === 2 ? effectRows.slice(0, 3) : [rowA, rowB];

  return {
    anovaRows: [...effectRows, errRow],
    cells,
    nTotal,
    nPerCell,
    primaryInteractionRow,
    mainRows,
    allEffectRows: effectRows,
  };
}

function simulateWithinSubjects(
  template: ScenarioTemplate,
  factorA: FactorDefinition,
  factorB: FactorDefinition,
  factorC: FactorDefinition | undefined,
  pattern: EffectPattern
): RawDataSummary {
  const aLen = factorA.levels.length;
  const bLen = factorB.levels.length;
  const cLen = factorC ? factorC.levels.length : 1;

  const nSubj =
    pattern === 'small_interaction'
      ? cLen === 2
        ? 84
        : bLen === 3
        ? 72
        : 96
      : cLen === 2
      ? 24
      : bLen === 3
      ? 28
      : 32;

  const eff = getPatternEffects(pattern, aLen, bLen, cLen, template.baseSD * 0.65);

  // Subject matrix Y[s][i][j][k]
  const subjectRandomEffects = Array.from({ length: nSubj }, () => randNormal() * (template.baseSD * 0.45));
  const Y: number[][][][] = Array.from({ length: nSubj }, (_, s) =>
    Array.from({ length: aLen }, (__, i) =>
      Array.from({ length: bLen }, (___, j) =>
        Array.from({ length: cLen }, (____, k) => {
          const targetMean =
            template.baseMean +
            eff.alpha[i] +
            eff.beta[j] +
            eff.gamma[k] +
            eff.ab[i][j] +
            eff.ac[i][k] +
            eff.bc[j][k] +
            eff.abc[i][j][k];
          const errorNoise = randNormal() * (template.baseSD * 0.62);
          return targetMean + subjectRandomEffects[s] + errorNoise;
        })
      )
    )
  );

  // Remove sample mean of random interaction noise slightly if needed? No, natural random sampling + retry guard works cleanly!
  // Compute cell values for descriptives
  const cellValues: number[][][][] = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: bLen }, (__, j) =>
      Array.from({ length: cLen }, (___, k) => Y.map((subj) => subj[i][j][k]))
    )
  );

  // Marginal subject and condition means
  let grandSum = 0;
  for (let s = 0; s < nSubj; s++)
    for (let i = 0; i < aLen; i++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++) grandSum += Y[s][i][j][k];
  const grandMean = grandSum / (nSubj * aLen * bLen * cLen);

  const subjMean = Array.from({ length: nSubj }, (_, s) => {
    let sum = 0;
    for (let i = 0; i < aLen; i++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++) sum += Y[s][i][j][k];
    return sum / (aLen * bLen * cLen);
  });

  const meanA = Array.from({ length: aLen }, (_, i) => {
    let sum = 0;
    for (let s = 0; s < nSubj; s++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++) sum += Y[s][i][j][k];
    return sum / (nSubj * bLen * cLen);
  });

  const meanB = Array.from({ length: bLen }, (_, j) => {
    let sum = 0;
    for (let s = 0; s < nSubj; s++)
      for (let i = 0; i < aLen; i++)
        for (let k = 0; k < cLen; k++) sum += Y[s][i][j][k];
    return sum / (nSubj * aLen * cLen);
  });

  const meanC = Array.from({ length: cLen }, (_, k) => {
    let sum = 0;
    for (let s = 0; s < nSubj; s++)
      for (let i = 0; i < aLen; i++)
        for (let j = 0; j < bLen; j++) sum += Y[s][i][j][k];
    return sum / (nSubj * aLen * bLen);
  });

  const meanAB = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: bLen }, (_, j) => {
      let sum = 0;
      for (let s = 0; s < nSubj; s++) for (let k = 0; k < cLen; k++) sum += Y[s][i][j][k];
      return sum / (nSubj * cLen);
    })
  );

  const meanAC = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: cLen }, (_, k) => {
      let sum = 0;
      for (let s = 0; s < nSubj; s++) for (let j = 0; j < bLen; j++) sum += Y[s][i][j][k];
      return sum / (nSubj * bLen);
    })
  );

  const meanBC = Array.from({ length: bLen }, (_, j) =>
    Array.from({ length: cLen }, (_, k) => {
      let sum = 0;
      for (let s = 0; s < nSubj; s++) for (let i = 0; i < aLen; i++) sum += Y[s][i][j][k];
      return sum / (nSubj * aLen);
    })
  );

  const meanABC = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: bLen }, (_, j) =>
      Array.from({ length: cLen }, (_, k) => {
        let sum = 0;
        for (let s = 0; s < nSubj; s++) sum += Y[s][i][j][k];
        return sum / nSubj;
      })
    )
  );

  const subjA = Array.from({ length: nSubj }, (_, s) =>
    Array.from({ length: aLen }, (__, i) => {
      let sum = 0;
      for (let j = 0; j < bLen; j++) for (let k = 0; k < cLen; k++) sum += Y[s][i][j][k];
      return sum / (bLen * cLen);
    })
  );

  const subjB = Array.from({ length: nSubj }, (_, s) =>
    Array.from({ length: bLen }, (__, j) => {
      let sum = 0;
      for (let i = 0; i < aLen; i++) for (let k = 0; k < cLen; k++) sum += Y[s][i][j][k];
      return sum / (aLen * cLen);
    })
  );

  const subjC = Array.from({ length: nSubj }, (_, s) =>
    Array.from({ length: cLen }, (__, k) => {
      let sum = 0;
      for (let i = 0; i < aLen; i++) for (let j = 0; j < bLen; j++) sum += Y[s][i][j][k];
      return sum / (aLen * bLen);
    })
  );

  const subjAB = Array.from({ length: nSubj }, (_, s) =>
    Array.from({ length: aLen }, (__, i) =>
      Array.from({ length: bLen }, (___, j) => {
        let sum = 0;
        for (let k = 0; k < cLen; k++) sum += Y[s][i][j][k];
        return sum / cLen;
      })
    )
  );

  const subjAC = Array.from({ length: nSubj }, (_, s) =>
    Array.from({ length: aLen }, (__, i) =>
      Array.from({ length: cLen }, (___, k) => {
        let sum = 0;
        for (let j = 0; j < bLen; j++) sum += Y[s][i][j][k];
        return sum / bLen;
      })
    )
  );

  const subjBC = Array.from({ length: nSubj }, (_, s) =>
    Array.from({ length: bLen }, (__, j) =>
      Array.from({ length: cLen }, (___, k) => {
        let sum = 0;
        for (let i = 0; i < aLen; i++) sum += Y[s][i][j][k];
        return sum / aLen;
      })
    )
  );

  let ssTotal = 0;
  for (let s = 0; s < nSubj; s++)
    for (let i = 0; i < aLen; i++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++) ssTotal += Math.pow(Y[s][i][j][k] - grandMean, 2);

  const ssA = nSubj * bLen * cLen * meanA.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
  let ssErrA = 0;
  for (let s = 0; s < nSubj; s++)
    for (let i = 0; i < aLen; i++)
      ssErrA += Math.pow(subjA[s][i] - subjMean[s] - meanA[i] + grandMean, 2);
  ssErrA *= bLen * cLen;

  const ssB = nSubj * aLen * cLen * meanB.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
  let ssErrB = 0;
  for (let s = 0; s < nSubj; s++)
    for (let j = 0; j < bLen; j++)
      ssErrB += Math.pow(subjB[s][j] - subjMean[s] - meanB[j] + grandMean, 2);
  ssErrB *= aLen * cLen;

  let ssAB = 0;
  for (let i = 0; i < aLen; i++)
    for (let j = 0; j < bLen; j++) ssAB += Math.pow(meanAB[i][j] - meanA[i] - meanB[j] + grandMean, 2);
  ssAB *= nSubj * cLen;

  let ssErrAB = 0;
  for (let s = 0; s < nSubj; s++)
    for (let i = 0; i < aLen; i++)
      for (let j = 0; j < bLen; j++)
        ssErrAB += Math.pow(
          subjAB[s][i][j] - subjA[s][i] - subjB[s][j] - meanAB[i][j] + subjMean[s] + meanA[i] + meanB[j] - grandMean,
          2
        );
  ssErrAB *= cLen;

  const dfA = aLen - 1;
  const dfB = bLen - 1;
  const dfAB = dfA * dfB;
  const dfErrA = (nSubj - 1) * dfA;
  const dfErrB = (nSubj - 1) * dfB;
  const dfErrAB = (nSubj - 1) * dfAB;

  const makePair = (
    id: string,
    label: string,
    errLabel: string,
    ss: number,
    df: number,
    ssErr: number,
    dfErr: number
  ): { effRow: GeneratedAnovaRow; errRow: GeneratedAnovaRow } => {
    const ms = ss / df;
    const msErr = ssErr / dfErr;
    const f = ms / msErr;
    const p = fDistPValue(f, df, dfErr);
    const etaSqP = ss / (ss + ssErr);
    const omegaSq = Math.max(0, (ss - df * msErr) / (ssTotal + msErr));
    return {
      effRow: { id, label, ss, df, errorDf: dfErr, ms, f, p, etaSqP, omegaSq, significant: p < 0.05 },
      errRow: { id: `err_${id}`, label: errLabel, ss: ssErr, df: dfErr, ms: msErr, isError: true },
    };
  };

  const pairA = makePair('A', factorA.name, `Reszta (${factorA.name})`, ssA, dfA, ssErrA, dfErrA);
  const pairB = makePair('B', factorB.name, `Reszta (${factorB.name})`, ssB, dfB, ssErrB, dfErrB);
  const pairAB = makePair(
    'AxB',
    `${factorA.name} × ${factorB.name}`,
    `Reszta (${factorA.name} × ${factorB.name})`,
    ssAB,
    dfAB,
    ssErrAB,
    dfErrAB
  );

  const anovaRows: GeneratedAnovaRow[] = [
    pairA.effRow,
    pairA.errRow,
    pairB.effRow,
    pairB.errRow,
    pairAB.effRow,
    pairAB.errRow,
  ];
  const effectRows: GeneratedAnovaRow[] = [pairA.effRow, pairB.effRow, pairAB.effRow];
  let primaryInteractionRow = pairAB.effRow;
  let mainRows = [pairA.effRow, pairB.effRow];

  if (cLen === 2 && factorC) {
    const dfC = 1;
    const dfAC = dfA * dfC;
    const dfBC = dfB * dfC;
    const dfABC = dfA * dfB * dfC;

    const ssC = nSubj * aLen * bLen * meanC.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
    let ssErrC = 0;
    for (let s = 0; s < nSubj; s++)
      for (let k = 0; k < cLen; k++) ssErrC += Math.pow(subjC[s][k] - subjMean[s] - meanC[k] + grandMean, 2);
    ssErrC *= aLen * bLen;

    let ssAC = 0;
    for (let i = 0; i < aLen; i++)
      for (let k = 0; k < cLen; k++) ssAC += Math.pow(meanAC[i][k] - meanA[i] - meanC[k] + grandMean, 2);
    ssAC *= nSubj * bLen;

    let ssErrAC = 0;
    for (let s = 0; s < nSubj; s++)
      for (let i = 0; i < aLen; i++)
        for (let k = 0; k < cLen; k++)
          ssErrAC += Math.pow(
            subjAC[s][i][k] - subjA[s][i] - subjC[s][k] - meanAC[i][k] + subjMean[s] + meanA[i] + meanC[k] - grandMean,
            2
          );
    ssErrAC *= bLen;

    let ssBC = 0;
    for (let j = 0; j < bLen; j++)
      for (let k = 0; k < cLen; k++) ssBC += Math.pow(meanBC[j][k] - meanB[j] - meanC[k] + grandMean, 2);
    ssBC *= nSubj * aLen;

    let ssErrBC = 0;
    for (let s = 0; s < nSubj; s++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++)
          ssErrBC += Math.pow(
            subjBC[s][j][k] - subjB[s][j] - subjC[s][k] - meanBC[j][k] + subjMean[s] + meanB[j] + meanC[k] - grandMean,
            2
          );
    ssErrBC *= aLen;

    let ssABC = 0;
    for (let i = 0; i < aLen; i++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++)
          ssABC += Math.pow(
            meanABC[i][j][k] -
              meanAB[i][j] -
              meanAC[i][k] -
              meanBC[j][k] +
              meanA[i] +
              meanB[j] +
              meanC[k] -
              grandMean,
            2
          );
    ssABC *= nSubj;

    let ssErrABC = 0;
    for (let s = 0; s < nSubj; s++)
      for (let i = 0; i < aLen; i++)
        for (let j = 0; j < bLen; j++)
          for (let k = 0; k < cLen; k++) {
            const dev =
              Y[s][i][j][k] -
              subjAB[s][i][j] -
              subjAC[s][i][k] -
              subjBC[s][j][k] -
              meanABC[i][j][k] +
              subjA[s][i] +
              subjB[s][j] +
              subjC[s][k] +
              meanAB[i][j] +
              meanAC[i][k] +
              meanBC[j][k] -
              subjMean[s] -
              meanA[i] -
              meanB[j] -
              meanC[k] +
              grandMean;
            ssErrABC += dev * dev;
          }

    const pairC = makePair('C', factorC.name, `Reszta (${factorC.name})`, ssC, dfC, ssErrC, (nSubj - 1) * dfC);
    const pairAC = makePair(
      'AxC',
      `${factorA.name} × ${factorC.name}`,
      `Reszta (${factorA.name} × ${factorC.name})`,
      ssAC,
      dfAC,
      ssErrAC,
      (nSubj - 1) * dfAC
    );
    const pairBC = makePair(
      'BxC',
      `${factorB.name} × ${factorC.name}`,
      `Reszta (${factorB.name} × ${factorC.name})`,
      ssBC,
      dfBC,
      ssErrBC,
      (nSubj - 1) * dfBC
    );
    const pairABC = makePair(
      'AxBxC',
      `${factorA.name} × ${factorB.name} × ${factorC.name}`,
      `Reszta (${factorA.name} × ${factorB.name} × ${factorC.name})`,
      ssABC,
      dfABC,
      ssErrABC,
      (nSubj - 1) * dfABC
    );

    anovaRows.splice(
      4,
      0,
      pairC.effRow,
      pairC.errRow
    );
    anovaRows.push(pairAC.effRow, pairAC.errRow, pairBC.effRow, pairBC.errRow, pairABC.effRow, pairABC.errRow);

    effectRows.splice(2, 0, pairC.effRow);
    effectRows.push(pairAC.effRow, pairBC.effRow, pairABC.effRow);
    primaryInteractionRow = pairABC.effRow;
    mainRows = [pairA.effRow, pairB.effRow, pairC.effRow];
  }

  const cells = buildDescriptiveCells(cellValues, factorA, factorB, factorC);

  return {
    anovaRows,
    cells,
    nTotal: nSubj,
    nPerCell: nSubj,
    primaryInteractionRow,
    mainRows,
    allEffectRows: effectRows,
  };
}

function simulateMixed(
  template: ScenarioTemplate,
  factorA: FactorDefinition,
  factorB: FactorDefinition,
  factorC: FactorDefinition | undefined,
  pattern: EffectPattern
): RawDataSummary {
  // Factor A is Between-Subjects (2 levels), Factor B (and C if present) are Within-Subjects
  const aLen = factorA.levels.length;
  const bLen = factorB.levels.length;
  const cLen = factorC ? factorC.levels.length : 1;

  const nPerGroup =
    pattern === 'small_interaction'
      ? cLen === 2
        ? 42
        : bLen === 3
        ? 38
        : 48
      : cLen === 2
      ? 18
      : bLen === 3
      ? 22
      : 26;
  const nTotal = aLen * nPerGroup;

  const eff = getPatternEffects(pattern, aLen, bLen, cLen, template.baseSD * 0.72);

  // Y[i][m][j][k] where i is between group, m is subject in group i, j, k are within conditions
  const Y: number[][][][] = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: nPerGroup }, () => {
      const subjEff = randNormal() * (template.baseSD * 0.48);
      return Array.from({ length: bLen }, (__, j) =>
        Array.from({ length: cLen }, (___, k) => {
          const targetMean =
            template.baseMean +
            eff.alpha[i] +
            eff.beta[j] +
            eff.gamma[k] +
            eff.ab[i][j] +
            eff.ac[i][k] +
            eff.bc[j][k] +
            eff.abc[i][j][k];
          return targetMean + subjEff + randNormal() * (template.baseSD * 0.62);
        })
      );
    })
  );

  const cellValues: number[][][][] = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: bLen }, (__, j) =>
      Array.from({ length: cLen }, (___, k) => Y[i].map((subj) => subj[j][k]))
    )
  );

  let grandSum = 0;
  for (let i = 0; i < aLen; i++)
    for (let m = 0; m < nPerGroup; m++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++) grandSum += Y[i][m][j][k];
  const grandMean = grandSum / (nTotal * bLen * cLen);

  const subjMean = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: nPerGroup }, (__, m) => {
      let s = 0;
      for (let j = 0; j < bLen; j++) for (let k = 0; k < cLen; k++) s += Y[i][m][j][k];
      return s / (bLen * cLen);
    })
  );

  const meanA = Array.from({ length: aLen }, (_, i) => {
    let s = 0;
    for (let m = 0; m < nPerGroup; m++) s += subjMean[i][m];
    return s / nPerGroup;
  });

  const meanB = Array.from({ length: bLen }, (_, j) => {
    let s = 0;
    for (let i = 0; i < aLen; i++)
      for (let m = 0; m < nPerGroup; m++)
        for (let k = 0; k < cLen; k++) s += Y[i][m][j][k];
    return s / (nTotal * cLen);
  });

  const meanC = Array.from({ length: cLen }, (_, k) => {
    let s = 0;
    for (let i = 0; i < aLen; i++)
      for (let m = 0; m < nPerGroup; m++)
        for (let j = 0; j < bLen; j++) s += Y[i][m][j][k];
    return s / (nTotal * bLen);
  });

  const meanAB = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: bLen }, (__, j) => {
      let s = 0;
      for (let m = 0; m < nPerGroup; m++) for (let k = 0; k < cLen; k++) s += Y[i][m][j][k];
      return s / (nPerGroup * cLen);
    })
  );

  const meanAC = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: cLen }, (__, k) => {
      let s = 0;
      for (let m = 0; m < nPerGroup; m++) for (let j = 0; j < bLen; j++) s += Y[i][m][j][k];
      return s / (nPerGroup * bLen);
    })
  );

  const meanBC = Array.from({ length: bLen }, (_, j) =>
    Array.from({ length: cLen }, (__, k) => {
      let s = 0;
      for (let i = 0; i < aLen; i++) for (let m = 0; m < nPerGroup; m++) s += Y[i][m][j][k];
      return s / nTotal;
    })
  );

  const meanABC = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: bLen }, (__, j) =>
      Array.from({ length: cLen }, (___, k) => {
        let s = 0;
        for (let m = 0; m < nPerGroup; m++) s += Y[i][m][j][k];
        return s / nPerGroup;
      })
    )
  );

  const subjB = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: nPerGroup }, (__, m) =>
      Array.from({ length: bLen }, (___, j) => {
        let s = 0;
        for (let k = 0; k < cLen; k++) s += Y[i][m][j][k];
        return s / cLen;
      })
    )
  );

  const subjC = Array.from({ length: aLen }, (_, i) =>
    Array.from({ length: nPerGroup }, (__, m) =>
      Array.from({ length: cLen }, (___, k) => {
        let s = 0;
        for (let j = 0; j < bLen; j++) s += Y[i][m][j][k];
        return s / bLen;
      })
    )
  );

  let ssTotal = 0;
  for (let i = 0; i < aLen; i++)
    for (let m = 0; m < nPerGroup; m++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++) ssTotal += Math.pow(Y[i][m][j][k] - grandMean, 2);

  // Between block: Factor A + Reszta międzyosobowa
  const ssA = nPerGroup * bLen * cLen * meanA.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
  let ssErrBetween = 0;
  for (let i = 0; i < aLen; i++)
    for (let m = 0; m < nPerGroup; m++) ssErrBetween += Math.pow(subjMean[i][m] - meanA[i], 2);
  ssErrBetween *= bLen * cLen;

  const dfA = aLen - 1;
  const dfErrBetween = aLen * (nPerGroup - 1);
  const msErrBetween = ssErrBetween / dfErrBetween;

  const makeRow = (
    id: string,
    label: string,
    ss: number,
    df: number,
    ssErr: number,
    dfErr: number
  ): GeneratedAnovaRow => {
    const ms = ss / df;
    const msErr = ssErr / dfErr;
    const f = ms / msErr;
    const p = fDistPValue(f, df, dfErr);
    const etaSqP = ss / (ss + ssErr);
    const omegaSq = Math.max(0, (ss - df * msErr) / (ssTotal + msErr));
    return { id, label, ss, df, errorDf: dfErr, ms, f, p, etaSqP, omegaSq, significant: p < 0.05 };
  };

  const rowA = makeRow('A', factorA.name, ssA, dfA, ssErrBetween, dfErrBetween);
  const errBetweenRow: GeneratedAnovaRow = {
    id: 'err_between',
    label: 'Reszta (międzyosobowa)',
    ss: ssErrBetween,
    df: dfErrBetween,
    ms: msErrBetween,
    isError: true,
  };

  // Within B & AxB
  const ssB = nTotal * cLen * meanB.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
  let ssAB = 0;
  for (let i = 0; i < aLen; i++)
    for (let j = 0; j < bLen; j++) ssAB += Math.pow(meanAB[i][j] - meanA[i] - meanB[j] + grandMean, 2);
  ssAB *= nPerGroup * cLen;

  let ssErrB = 0;
  for (let i = 0; i < aLen; i++)
    for (let m = 0; m < nPerGroup; m++)
      for (let j = 0; j < bLen; j++)
        ssErrB += Math.pow(subjB[i][m][j] - subjMean[i][m] - meanAB[i][j] + meanA[i], 2);
  ssErrB *= cLen;

  const dfB = bLen - 1;
  const dfAB = dfA * dfB;
  const dfErrB = dfErrBetween * dfB;
  const msErrB = ssErrB / dfErrB;

  const rowB = makeRow('B', factorB.name, ssB, dfB, ssErrB, dfErrB);
  const rowAB = makeRow('AxB', `${factorA.name} × ${factorB.name}`, ssAB, dfAB, ssErrB, dfErrB);
  const errBRow: GeneratedAnovaRow = {
    id: 'err_B',
    label: `Reszta (${factorB.name})`,
    ss: ssErrB,
    df: dfErrB,
    ms: msErrB,
    isError: true,
  };

  const anovaRows: GeneratedAnovaRow[] = [
    { id: 'sec_within', label: 'Efekty wewnątrzgrupowe', ss: 0, df: 0, ms: 0, isSectionHeader: true, sectionTitle: 'Efekty wewnątrzgrupowe' },
    rowB,
    rowAB,
    errBRow,
  ];

  const effectRows: GeneratedAnovaRow[] = [rowA, rowB, rowAB];
  let primaryInteractionRow = rowAB;
  let mainRows = [rowA, rowB];

  if (cLen === 2 && factorC) {
    const dfC = 1;
    const dfAC = dfA * dfC;
    const dfBC = dfB * dfC;
    const dfABC = dfA * dfB * dfC;

    const ssC = nTotal * bLen * meanC.reduce((s, m) => s + Math.pow(m - grandMean, 2), 0);
    let ssAC = 0;
    for (let i = 0; i < aLen; i++)
      for (let k = 0; k < cLen; k++) ssAC += Math.pow(meanAC[i][k] - meanA[i] - meanC[k] + grandMean, 2);
    ssAC *= nPerGroup * bLen;

    let ssErrC = 0;
    for (let i = 0; i < aLen; i++)
      for (let m = 0; m < nPerGroup; m++)
        for (let k = 0; k < cLen; k++)
          ssErrC += Math.pow(subjC[i][m][k] - subjMean[i][m] - meanAC[i][k] + meanA[i], 2);
    ssErrC *= bLen;

    const dfErrC = dfErrBetween * dfC;
    const msErrC = ssErrC / dfErrC;

    let ssBC = 0;
    for (let j = 0; j < bLen; j++)
      for (let k = 0; k < cLen; k++) ssBC += Math.pow(meanBC[j][k] - meanB[j] - meanC[k] + grandMean, 2);
    ssBC *= nTotal;

    let ssABC = 0;
    for (let i = 0; i < aLen; i++)
      for (let j = 0; j < bLen; j++)
        for (let k = 0; k < cLen; k++)
          ssABC += Math.pow(
            meanABC[i][j][k] -
              meanAB[i][j] -
              meanAC[i][k] -
              meanBC[j][k] +
              meanA[i] +
              meanB[j] +
              meanC[k] -
              grandMean,
            2
          );
    ssABC *= nPerGroup;

    let ssErrBC = 0;
    for (let i = 0; i < aLen; i++)
      for (let m = 0; m < nPerGroup; m++)
        for (let j = 0; j < bLen; j++)
          for (let k = 0; k < cLen; k++) {
            const dev =
              Y[i][m][j][k] -
              subjB[i][m][j] -
              subjC[i][m][k] -
              meanABC[i][j][k] +
              subjMean[i][m] +
              meanAB[i][j] +
              meanAC[i][k] -
              meanA[i];
            ssErrBC += dev * dev;
          }

    const dfErrBC = dfErrBetween * dfBC;
    const msErrBC = ssErrBC / dfErrBC;

    const rowC = makeRow('C', factorC.name, ssC, dfC, ssErrC, dfErrC);
    const rowAC = makeRow('AxC', `${factorA.name} × ${factorC.name}`, ssAC, dfAC, ssErrC, dfErrC);
    const errCRow: GeneratedAnovaRow = {
      id: 'err_C',
      label: `Reszta (${factorC.name})`,
      ss: ssErrC,
      df: dfErrC,
      ms: msErrC,
      isError: true,
    };

    const rowBC = makeRow('BxC', `${factorB.name} × ${factorC.name}`, ssBC, dfBC, ssErrBC, dfErrBC);
    const rowABC = makeRow(
      'AxBxC',
      `${factorA.name} × ${factorB.name} × ${factorC.name}`,
      ssABC,
      dfABC,
      ssErrBC,
      dfErrBC
    );
    const errBCRow: GeneratedAnovaRow = {
      id: 'err_BC',
      label: `Reszta (${factorB.name} × ${factorC.name})`,
      ss: ssErrBC,
      df: dfErrBC,
      ms: msErrBC,
      isError: true,
    };

    anovaRows.push(rowC, rowAC, errCRow, rowBC, rowABC, errBCRow);
    effectRows.push(rowC, rowAC, rowBC, rowABC);
    primaryInteractionRow = rowABC;
    mainRows = [rowA, rowB, rowC];
  }

  anovaRows.push(
    { id: 'sec_between', label: 'Efekty międzygrupowe', ss: 0, df: 0, ms: 0, isSectionHeader: true, sectionTitle: 'Efekty międzygrupowe' },
    rowA,
    errBetweenRow
  );

  const cells = buildDescriptiveCells(cellValues, factorA, factorB, factorC);

  return {
    anovaRows,
    cells,
    nTotal,
    nPerCell: nPerGroup,
    primaryInteractionRow,
    mainRows,
    allEffectRows: effectRows,
  };
}

function verifyPatternMatch(summary: RawDataSummary, pattern: EffectPattern): boolean {
  const { primaryInteractionRow, mainRows, allEffectRows } = summary;
  const pInt = primaryInteractionRow.p ?? 1;
  const etaInt = primaryInteractionRow.etaSqP ?? 0;

  if (pattern === 'null') {
    return allEffectRows.every((r) => (r.p ?? 1) > 0.12);
  }
  if (pattern === 'main_only') {
    const mainsSig = mainRows.every((r) => (r.p ?? 1) < 0.02);
    const intsNonSig = allEffectRows
      .filter((r) => !mainRows.includes(r))
      .every((r) => (r.p ?? 1) > 0.14 && (r.etaSqP ?? 0) < 0.03);
    return mainsSig && intsNonSig;
  }
  if (pattern === 'single_main') {
    const sigMains = mainRows.filter((r) => (r.p ?? 1) < 0.02).length;
    const nonSigMains = mainRows.filter((r) => (r.p ?? 1) > 0.15).length;
    const intsNonSig = allEffectRows
      .filter((r) => !mainRows.includes(r))
      .every((r) => (r.p ?? 1) > 0.15 && (r.etaSqP ?? 0) < 0.03);
    return sigMains === 1 && nonSigMains === mainRows.length - 1 && intsNonSig;
  }
  if (pattern === 'interaction_only') {
    const mainsNonSig = mainRows.every((r) => (r.p ?? 1) > 0.15);
    return mainsNonSig && pInt < 0.005 && etaInt >= 0.17;
  }
  if (pattern === 'small_interaction') {
    const mainsSig = mainRows.every((r) => (r.p ?? 1) < 0.02);
    return mainsSig && pInt < 0.025 && etaInt >= 0.018 && etaInt <= 0.052;
  }
  // all_significant
  return allEffectRows.every((r) => (r.p ?? 1) < 0.01) && etaInt >= 0.17;
}

function buildQuestions(
  dimensions: DesignDimensions,
  designMode: DesignMode,
  isModeratorQuasiExperimental: boolean,
  factorA: FactorDefinition,
  factorB: FactorDefinition,
  factorC: FactorDefinition | undefined,
  moderatorKey: 'A' | 'B' | 'C',
  dvName: string,
  summary: RawDataSummary
): GeneratedQuizQuestion[] {
  const moderatorFactor = moderatorKey === 'B' ? factorB : factorA;
  const { primaryInteractionRow, mainRows, allEffectRows } = summary;

  // 1. Dimensions
  const q1: GeneratedQuizQuestion = {
    id: 'q_dimensions',
    topic: 'dimensions',
    prompt: 'Na podstawie opisu badania z Załącznika 1, z jakim planem czynnikowym mamy do czynienia?',
    options: [
      { id: 'a', text: '2 × 1', isCorrect: false },
      { id: 'b', text: '2 × 2', isCorrect: dimensions === '2x2' },
      { id: 'c', text: '2 × 3', isCorrect: dimensions === '2x3' },
      { id: 'd', text: '2 × 2 × 2', isCorrect: dimensions === '2x2x2' },
    ],
    explanation: `W badaniu uwzględniono ${
      dimensions === '2x2x2'
        ? `trzy czynniki: ${factorA.name} (${factorA.levels.length} poziomy), ${factorB.name} (${factorB.levels.length} poziomy) oraz ${factorC?.name} (${factorC?.levels.length} poziomy)`
        : `dwa czynniki: ${factorA.name} (${factorA.levels.length} poziomy) oraz ${factorB.name} (${factorB.levels.length} poziomy)`
    }, co tworzy dokładnie plan ${dimensions.replace(/x/g, ' × ')}.`,
  };

  // 2. Design mode
  const q2: GeneratedQuizQuestion = {
    id: 'q_design_type',
    topic: 'design_type',
    prompt: 'Na podstawie opisu badania i Tabeli 1 z Załącznika 1, przedstawiony plan to plan:',
    options: [
      { id: 'a', text: 'grup zależnych', isCorrect: designMode === 'within' },
      { id: 'b', text: 'grup niezależnych', isCorrect: designMode === 'between' },
      { id: 'c', text: 'grup mieszanych', isCorrect: designMode === 'mixed' },
      {
        id: 'd',
        text:
          designMode === 'between' && !isModeratorQuasiExperimental
            ? 'korelacyjnym bez podziału na grupy'
            : 'grup w pełni zrandomizowanych',
        isCorrect: false,
      },
    ],
    explanation:
      designMode === 'between'
        ? isModeratorQuasiExperimental
          ? `Jest to plan grup niezależnych (międzyosobowy): każda osoba badana należy wyłącznie do jednej komórki eksperymentu, a w Tabeli 1 występuje wspólna reszta międzygrupowa. Nie jest to plan w pełni zrandomizowany, ponieważ poziom zmiennej „${moderatorFactor.name}” był mierzony (klasyfikacja wg testu), a nie przydzielany losowo.`
          : `Jest to plan grup niezależnych (międzyosobowy): uczestnicy byli losowo przydzieleni do rozłącznych warunków i każdy badany znajduje się tylko w jednej komórce.`
        : designMode === 'within'
        ? `Jest to plan grup zależnych (pomiarów powtarzanych): ci sami uczestnicy (${summary.nTotal} osób) wzięli udział we wszystkich warunkach badania, a w Tabeli 1 każdy efekt ma własny wiersz reszty.`
        : `Jest to plan mieszany (grup mieszanych): czynnik „${factorA.name}” dzieli badanych na niezależne grupy (międzygrupowy), natomiast czynnik „${factorB.name}”${
            factorC ? ` i „${factorC.name}”` : ''
          } był mierzony wielokrotnie u tych samych osób (wewnątrzgrupowy).`,
  };

  // 3. Significant effects
  const sigCount = allEffectRows.filter((r) => r.significant).length;
  const allSig = sigCount === allEffectRows.length;
  const noneSig = sigCount === 0;
  const sigMains = mainRows.filter((r) => r.significant);
  const interactionRows = allEffectRows.filter((r) => !mainRows.includes(r));
  const anyIntSig = interactionRows.some((r) => r.significant);

  const onlyMains = sigMains.length === mainRows.length && !anyIntSig;
  const onlyInt = sigMains.length === 0 && anyIntSig;
  const onlyOneMain = sigMains.length === 1 && !anyIntSig;

  const sigLabels = allEffectRows
    .filter((r) => r.significant)
    .map((r) => `${r.label} (F = ${formatDecimal(r.f || 0, 2)}, p ${r.p! < 0.001 ? '< 0,001' : '= ' + formatPVal(r.p!)})`);

  const q3Options: QuizQuestionOption[] = [
    { id: 'a', text: 'wszystkie efekty uwzględnione w tabeli', isCorrect: allSig },
    {
      id: 'b',
      text: onlyOneMain ? `wyłącznie jeden efekt główny (${sigMains[0].label})` : 'tylko efekty główne',
      isCorrect: onlyMains || onlyOneMain,
    },
    {
      id: 'c',
      text: dimensions === '2x2x2' ? 'tylko efekty interakcyjne (bez efektów głównych)' : 'tylko efekt interakcyjny',
      isCorrect: onlyInt,
    },
    { id: 'd', text: 'żaden efekt nie jest istotny statystycznie', isCorrect: noneSig },
  ];

  // Fallback just in case a custom pattern has mixed subset
  if (!q3Options.some((o) => o.isCorrect)) {
    q3Options[1] = {
      id: 'b',
      text: `wybrane efekty (${allEffectRows.filter((r) => r.significant).map((r) => r.label).join(', ')})`,
      isCorrect: true,
    };
  }

  const q3: GeneratedQuizQuestion = {
    id: 'q_sig_effects',
    topic: 'significant_effects',
    prompt: 'Na podstawie Tabeli 1 z Załącznika 1, które efekty są istotne statystycznie (przy α = 0,05)?',
    options: q3Options,
    explanation: noneSig
      ? `Żaden z efektów w Tabeli 1 nie osiągnął progu istotności p < 0,05 (wszystkie p > 0,10), więc brak podstaw do odrzucenia hipotezy zerowej.`
      : `W Tabeli 1 istotne statystycznie (p < 0,05) są: ${sigLabels.join('; ')}.`,
  };

  // 4. Role of the moderator variable
  const q4: GeneratedQuizQuestion = {
    id: 'q_variable_role',
    topic: 'variable_role',
    prompt: `Na podstawie opisu badania z Załącznika 1, zmienna „${moderatorFactor.name}” pełni w modelu rolę:`,
    options: [
      { id: 'a', text: 'mediatora', isCorrect: false },
      { id: 'b', text: 'zmiennej zakłócającej', isCorrect: false },
      { id: 'c', text: 'moderatora', isCorrect: true },
      { id: 'd', text: 'zmiennej objaśnianej (zależnej)', isCorrect: false },
    ],
    explanation: `Zmienna „${moderatorFactor.name}” jest włączona do analizy czynnikowej jako drugi czynnik (moderator) pozwalający sprawdzić, czy siła lub kierunek wpływu manipulacji różni się w zależności od jej poziomu. Zmienną objaśnianą (zależną) jest ${dvName}.`,
  };

  // 5. Interaction evaluation (size + significance)
  const pInt = primaryInteractionRow.p ?? 1;
  const etaInt = primaryInteractionRow.etaSqP ?? 0;
  const intSig = pInt < 0.05;
  const intLarge = etaInt >= 0.14;

  const q5: GeneratedQuizQuestion = {
    id: 'q_interaction_eval',
    topic: 'interaction_eval',
    prompt:
      dimensions === '2x2x2'
        ? `Efekt interakcji najwyższego rzędu (${primaryInteractionRow.label}) przedstawiony w Tabeli 1 i na Wykresie 1 jest:`
        : `Efekt interakcyjny (${primaryInteractionRow.label}) w badaniu opisanym w Załączniku 1 (Tabela 1 i Wykres 1) jest:`,
    options: [
      { id: 'a', text: 'mały i nieistotny statystycznie', isCorrect: !intLarge && !intSig },
      { id: 'b', text: 'mały i istotny statystycznie', isCorrect: !intLarge && intSig },
      { id: 'c', text: 'duży i nieistotny statystycznie', isCorrect: intLarge && !intSig },
      { id: 'd', text: 'duży i istotny statystycznie', isCorrect: intLarge && intSig },
    ],
    explanation: `Dla interakcji „${primaryInteractionRow.label}” uzyskano F(${primaryInteractionRow.df}, ${
      primaryInteractionRow.errorDf ?? summary.anovaRows.find((r) => r.isError)?.df ?? '?'
    }) = ${formatDecimal(primaryInteractionRow.f || 0, 2)}, p ${
      pInt < 0.001 ? '< 0,001' : '= ' + formatPVal(pInt)
    } oraz cząstkowe η²p = ${formatDecimal(etaInt, 3)}. Zgodnie z kryteriami Cohena (0,01 mały; 0,06 średni; 0,14 duży) efekt jest ${
      intLarge ? 'duży' : 'mały'
    } i ${intSig ? 'istotny statystycznie (p < 0,05)' : 'nieistotny statystycznie (p ≥ 0,05)'}.`,
  };

  // 6. Next analytical step
  const bIsThreeLevels = factorB.levels.length === 3;
  const hasSigInteraction = anyIntSig;
  const needsPostHocForMain = !hasSigInteraction && bIsThreeLevels && mainRows[1]?.significant;
  const onlyTwoLevelMains = !hasSigInteraction && sigMains.length > 0 && !needsPostHocForMain;

  let q6Options: QuizQuestionOption[];
  let q6Explanation: string;

  if (noneSig) {
    q6Options = [
      { id: 'a', text: 'należy zakończyć analizę (brak podstaw do odrzucenia H₀)', isCorrect: true },
      { id: 'b', text: 'należy dobadać więcej osób badanych aż do uzyskania p < 0,05', isCorrect: false },
      { id: 'c', text: 'należy wykonać testy post hoc między wszystkimi komórkami', isCorrect: false },
      { id: 'd', text: 'należy wykonać analizę efektów prostych', isCorrect: false },
    ];
    q6Explanation =
      'Ponieważ żaden efekt główny ani interakcja nie osiągnęły istotności statystycznej (wszystkie p > 0,05), nie wykonujemy testów post hoc ani efektów prostych — analizę należy zakończyć i nie dopisywać prób (p-hacking).';
  } else if (onlyTwoLevelMains) {
    q6Options = [
      { id: 'a', text: 'należy zakończyć analizę bez interpretacji wyników', isCorrect: false },
      { id: 'b', text: 'należy dobadać więcej osób badanych', isCorrect: false },
      {
        id: 'c',
        text: 'należy zinterpretować bezpośrednio istotne efekty główne (bez testów post hoc dla 2 poziomów)',
        isCorrect: true,
      },
      { id: 'd', text: 'należy wykonać analizę efektów prostych mimo braku interakcji', isCorrect: false },
    ];
    q6Explanation =
      'Interakcja nie jest istotna, a istotny czynnik ma tylko 2 poziomy — wynik testu F jednoznacznie wskazuje różnicę między tymi dwoma średnimi, więc nie potrzeba testów post hoc.';
  } else if (needsPostHocForMain) {
    q6Options = [
      { id: 'a', text: 'należy zakończyć analizę', isCorrect: false },
      { id: 'b', text: 'należy dobadać więcej osób badanych', isCorrect: false },
      { id: 'c', text: 'należy wykonać testy post hoc dla czynnika 3-poziomowego', isCorrect: true },
      { id: 'd', text: 'należy uzasadnić wielkość próbki badawczej', isCorrect: false },
    ];
    q6Explanation = `Interakcja nie jest istotna, ale czynnik „${factorB.name}” ma 3 poziomy i istotny efekt główny (p ${
      mainRows[1].p! < 0.001 ? '< 0,001' : '= ' + formatPVal(mainRows[1].p!)
    }). Test F mówi jedynie, że co najmniej dwie z trzech średnich się różnią — aby ustalić które pary się różnią, należy wykonać testy post hoc.`;
  } else {
    // Significant interaction
    q6Options = [
      { id: 'a', text: 'należy zakończyć analizę', isCorrect: false },
      { id: 'b', text: 'należy dobadać więcej osób badanych', isCorrect: false },
      { id: 'c', text: 'należy wykonać analizę efektów prostych / testy post hoc', isCorrect: true },
      { id: 'd', text: 'należy uzasadnić wielkość próbki badawczej', isCorrect: false },
    ];
    q6Explanation = `Ponieważ efekt interakcji jest istotny statystycznie (p ${
      pInt < 0.001 ? '< 0,001' : '= ' + formatPVal(pInt)
    }), interpretacja samych efektów głównych jest niewystarczająca — kolejnym krokiem jest rozbicie interakcji za pomocą analizy efektów prostych lub porównań post hoc między warunkami.`;
  }

  const q6: GeneratedQuizQuestion = {
    id: 'q_next_step',
    topic: 'next_step',
    prompt: 'Jakie kolejne kroki powinny zostać wykonane po zaobserwowaniu wyników analizy wariancji w badaniu opisanym w Załączniku 1?',
    options: q6Options,
    explanation: q6Explanation,
  };

  return [q1, q2, q3, q4, q5, q6];
}

export interface GeneratorFilter {
  dimensions?: DesignDimensions | 'random';
  designMode?: DesignMode | 'random';
}

export function generateRandomAnovaStudy(filter: GeneratorFilter = {}): GeneratedStudy {
  const dimensions: DesignDimensions =
    filter.dimensions && filter.dimensions !== 'random'
      ? filter.dimensions
      : pickRandom<DesignDimensions>(['2x2', '2x3', '2x2x2']);

  const designMode: DesignMode =
    filter.designMode && filter.designMode !== 'random'
      ? filter.designMode
      : pickRandom<DesignMode>(['between', 'within', 'mixed']);

  const eligibleTemplates =
    designMode === 'within' || designMode === 'mixed'
      ? SCENARIO_TEMPLATES.filter((t) => t.supportsWithin)
      : SCENARIO_TEMPLATES;
  const template = pickRandom(eligibleTemplates);

  const availablePatterns: EffectPattern[] = [
    'all_significant',
    'main_only',
    'interaction_only',
    'small_interaction',
    'single_main',
    'null',
  ];
  const pattern = pickRandom(availablePatterns);

  const isModeratorQuasiExperimental = designMode !== 'within' && !template.supportsWithin;

  const factorA: FactorDefinition = {
    key: 'A',
    name: template.factorA.name,
    levels: [...template.factorA.levels2],
    role: 'manipulation',
    isWithin: designMode === 'within',
  };

  const bLevels =
    dimensions === '2x3' ? [...template.factorBModerator.levels3] : [...template.factorBModerator.levels2];

  const factorB: FactorDefinition = {
    key: 'B',
    name: template.factorBModerator.name,
    levels: bLevels,
    role: 'moderator',
    isWithin: designMode === 'within' || designMode === 'mixed',
  };

  const factorC: FactorDefinition | undefined =
    dimensions === '2x2x2'
      ? {
          key: 'C',
          name: template.factorC.name,
          levels: [...template.factorC.levels2],
          role: 'manipulation',
          isWithin: designMode === 'within' || designMode === 'mixed',
        }
      : undefined;

  let summary: RawDataSummary | null = null;
  for (let attempt = 0; attempt < 30; attempt++) {
    const candidate =
      designMode === 'between'
        ? simulateBetweenSubjects(template, factorA, factorB, factorC, pattern)
        : designMode === 'within'
        ? simulateWithinSubjects(template, factorA, factorB, factorC, pattern)
        : simulateMixed(template, factorA, factorB, factorC, pattern);

    if (verifyPatternMatch(candidate, pattern)) {
      summary = candidate;
      break;
    }
    summary = candidate;
  }

  const finalSummary = summary!;

  // Compose natural Polish study description matching Załącznik 1
  const nBetweenGroup =
    designMode === 'between'
      ? finalSummary.nTotal / 2
      : designMode === 'mixed'
      ? finalSummary.nTotal / 2
      : finalSummary.nTotal;

  let desc = '';
  if (designMode === 'between') {
    desc = `W jednym z przeprowadzonych badań psychologicznych (N = ${finalSummary.nTotal}) ${template.factorA.manipDescBetween} (N = ${nBetweenGroup} vs N = ${nBetweenGroup}). ${
      dimensions === '2x3' ? template.factorBModerator.descBetween3 : template.factorBModerator.descBetween2
    }.${factorC ? ` ${template.factorC.descBetween}.` : ''} Główną zmienną zależną był ilościowy pomiar: ${template.dvName} (${template.dvUnit}).`;
  } else if (designMode === 'within') {
    desc = `W jednym z przeprowadzonych badań psychologicznych wzięło udział N = ${finalSummary.nTotal} uczestników. W ramach procedury ${template.factorA.manipDescWithin}. ${
      dimensions === '2x3' ? template.factorBModerator.descWithin3 : template.factorBModerator.descWithin2
    }.${factorC ? ` ${template.factorC.descWithin}.` : ''} W każdym warunku mierzono zmienną zależną: ${template.dvName} (${template.dvUnit}).`;
  } else {
    // Mixed: Factor A between, Factor B (and C) within
    desc = `W jednym z przeprowadzonych badań psychologicznych wzięło udział łącznie N = ${finalSummary.nTotal} uczestników: ${template.factorA.manipDescBetween} (po n = ${nBetweenGroup} osób w każdej z dwóch grup). ${
      dimensions === '2x3' ? template.factorBModerator.descWithin3 : template.factorBModerator.descWithin2
    }.${factorC ? ` ${template.factorC.descWithin}.` : ''} Zmienną zależną w każdym pomiarze był ilościowy wskaźnik: ${template.dvName} (${template.dvUnit}).`;
  }

  const questions = buildQuestions(
    dimensions,
    designMode,
    isModeratorQuasiExperimental,
    factorA,
    factorB,
    factorC,
    'B',
    template.dvName,
    finalSummary
  );

  const tableNote =
    designMode === 'between'
      ? 'Uwaga. Suma kwadratów typu III. Przedziały ufności 95% CI wyliczono na podstawie błędów standardowych w warunkach.'
      : designMode === 'within'
      ? 'Uwaga. Suma kwadratów typu III (pomiary powtarzane). Każdy efekt testowany względem dedykowanego składnika błędu resztowego.'
      : 'Uwaga. Suma kwadratów typu III (plan mieszany). Efekty wewnątrzgrupowe i międzygrupowe testowane względem właściwych błędów resztowych.';

  return {
    id: `study_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    scenarioTitle: template.title,
    dimensions,
    designMode,
    pattern,
    description: desc,
    nTotal: finalSummary.nTotal,
    nPerCell: finalSummary.nPerCell,
    dvName: template.dvName,
    dvShortLabel: template.dvShortLabel,
    dvUnit: template.dvUnit,
    factors: { A: factorA, B: factorB, C: factorC },
    moderatorKey: 'B',
    isModeratorQuasiExperimental,
    anovaRows: finalSummary.anovaRows,
    cells: finalSummary.cells,
    questions,
    tableNote,
  };
}
