import { ScenarioPreset } from '../types/anova';

export const ORIGINAL_STUDY_DATA = {
  A1B1: [6, 8, 7, 9, 10],   // Czytanie, Krótki sen (M = 8, SS = 10)
  A1B2: [12, 14, 13, 15, 16], // Czytanie, Długi sen (M = 14, SS = 10)
  A2B1: [11, 13, 12, 14, 15], // Testowanie, Krótki sen (M = 13, SS = 10)
  A2B2: [11, 14, 12, 15, 13], // Testowanie, Długi sen (M = 13, SS = 10)
};

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'original',
    name: '1. Oryginalne badanie: Interakcja buforująca',
    description: 'Testowanie chroni pamięć przed brakiem snu (wzorzec z prezentacji).',
    didacticPoint: 'Linie nie są równoległe: dla testowania linia jest płaska (13 → 13), dla czytania stromo rośnie (8 → 14). Badamy efekty proste!',
    cells: {
      A1B1: [6, 8, 7, 9, 10],     // M = 8
      A1B2: [12, 14, 13, 15, 16], // M = 14
      A2B1: [11, 13, 12, 14, 15], // M = 13
      A2B2: [11, 14, 12, 15, 13], // M = 13
    },
  },
  {
    id: 'parallel_additive',
    name: '2. Brak interakcji: Czyste efekty główne (linie równoległe)',
    description: 'Oba czynniki działają addytywnie i niezależnie od siebie.',
    didacticPoint: 'Linie są idealnie równoległe! Długi sen dodaje dokładnie +4 słowa zarówno przy czytaniu, jak i przy testowaniu. Efekt interakcji F ≈ 0.',
    cells: {
      A1B1: [6, 8, 7, 9, 10],     // M = 8
      A1B2: [10, 12, 11, 13, 14], // M = 12 (+4)
      A2B1: [9, 11, 10, 12, 13],  // M = 11
      A2B2: [13, 15, 14, 16, 17], // M = 15 (+4)
    },
  },
  {
    id: 'crossover',
    name: '3. Interakcja krzyżowa (Crossover / efekt X)',
    description: 'Klasyczna pułapka: efekty główne znoszą się do zera, a interakcja jest potężna!',
    didacticPoint: 'Średnie brzegowe są równe (M_A1 = M_A2 = 12 oraz M_B1 = M_B2 = 12), więc testy efektów głównych dadzą F = 0! Gdyby badacz zignorował interakcję, uznałby, że ani strategia, ani sen nic nie zmieniają. To koronny dowód, dlaczego badamy interakcje!',
    cells: {
      A1B1: [6, 8, 7, 9, 10],     // M = 8
      A1B2: [14, 16, 15, 17, 18], // M = 16
      A2B1: [14, 16, 15, 17, 18], // M = 16
      A2B2: [6, 8, 7, 9, 10],     // M = 8
    },
  },
  {
    id: 'strategy_only',
    name: '4. Tylko efekt strategii uczenia się',
    description: 'Testowanie zawsze lepsze o 5 słów, sen nie ma żadnego znaczenia.',
    didacticPoint: 'Linie są poziome i leżą jedna nad drugą w stałej odległości. Istotny wyłącznie czynnik A (strategia).',
    cells: {
      A1B1: [6, 8, 7, 9, 10],     // M = 8
      A1B2: [6, 8, 7, 9, 10],     // M = 8
      A2B1: [11, 13, 12, 14, 15], // M = 13
      A2B2: [11, 13, 12, 14, 15], // M = 13
    },
  },
  {
    id: 'null_hypothesis',
    name: '5. Prawdziwa hipoteza zerowa H₀ (brak efektów)',
    description: 'Wszystkie różnice wynikają wyłącznie z losowego błędu pomiaru.',
    didacticPoint: 'Wszystkie średnie krążą wokół 10. Żadne F nie przekracza wartości krytycznej 4,49. Wariancja wyjaśniona to czysty szum wewnątrzgrupowy.',
    cells: {
      A1B1: [8, 10, 9, 11, 12],   // M = 10
      A1B2: [9, 11, 10, 8, 12],   // M = 10
      A2B1: [10, 9, 11, 12, 8],   // M = 10
      A2B2: [11, 10, 8, 12, 9],   // M = 10
    },
  },
];

export interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  keyConcepts: string[];
  teacherNotes: {
    goal: string;
    talkingPoints: string[];
    commonStudentMistakes: string[];
    discussionQuestion: string;
  };
}

export const SLIDES_CONTENT: SlideContent[] = [
  {
    id: 1,
    title: 'ANOVA 2 × 2: Plan niezależny',
    subtitle: 'Strategia uczenia się × Długość snu',
    keyConcepts: [
      'Plan czynnikowy międzygrupowy (between-subjects / niezależny)',
      'Czynnik A: Strategia uczenia się (A₁: ponowne czytanie vs A₂: testowanie się)',
      'Czynnik B: Długość snu (B₁: krótki sen vs B₂: długi sen)',
      'Zmienna zależna (Y): Liczba zapamiętanych słów',
      'Liczebność: n = 5 w każdej komórce, N = 20 uczestników łącznie',
    ],
    teacherNotes: {
      goal: 'Zbudowanie intuicji badawczej i odróżnienie planu czynnikowego 2x2 od dwóch niezależnych testów t-Studenta.',
      talkingPoints: [
        'Zapytaj studentów: Dlaczego robimy jedno badanie 2x2, zamiast dwóch osobnych badań (jedno o śnie, drugie o strategii uczenia)? Odpowiedź: Tylko w planie czynnikowym możemy wykryć INTERAKCJĘ!',
        'Zwróć uwagę, że każda osoba uczestniczy tylko w JEDNEJ z 4 kombinacji (plan w pełni międzygrupowy / niezależny).',
        'Zwróć uwagę na wartości średnich: 8, 14, 13, 13. Czy widać już coś ciekawego w wynikach?',
      ],
      commonStudentMistakes: [
        'Mylenie planu niezależnego (różne osoby w 4 grupach) z planem powtarzanych pomiarów (ta sama osoba badana 4 razy).',
        'Przekonanie, że "2 x 2" oznacza "dwa pytania badawcze", zamiast "dwa czynniki, każdy o 2 poziomach".',
      ],
      discussionQuestion: 'Spójrzcie na średnie: 8, 14, 13, 13. Kto radzi sobie najgorzej? Czy długi sen zawsze pomaga w takim samym stopniu?',
    },
  },
  {
    id: 2,
    title: 'Dane surowe i średnie',
    subtitle: 'Rozróżnienie średnich komórek, średnich brzegowych i średniej ogólnej',
    keyConcepts: [
      'Średnie w komórkach (Cell Means): M₁₁ = 8, M₁₂ = 14, M₂₁ = 13, M₂₂ = 13',
      'Średnie brzegowe A (Marginal Means A): Czytanie = 11, Testowanie = 13',
      'Średnie brzegowe B (Marginal Means B): Krótki sen = 10,5, Długi sen = 13,5',
      'Średnia ogólna (Grand Mean): M = 12',
      'Suma kwadratów wewnątrz grup (SS): SS = 10 w każdej komórce (homogeniczna wariancja)',
    ],
    teacherNotes: {
      goal: 'Nauczyć studentów czytania macierzy 2x2 i rozróżniania średnich brzegowych (efekty główne) od średnich komórek (interakcja).',
      talkingPoints: [
        'Pokaż, skąd biorą się średnie brzegowe: Średnia dla Czytania (11) to po prostu (8 + 14) / 2.',
        'Podkreśl, że średnie brzegowe "uśredniają" drugi czynnik, ignorując go na chwilę.',
        'Zwróć uwagę na SS = 10 w każdej grupie. Dlaczego to idealny przykład dydaktyczny? Bo wariancje w grupach są równe (s² = 10 / 4 = 2,5), co spełnia założenie o jednorodności wariancji Levene\'a!',
      ],
      commonStudentMistakes: [
        'Próba dodawania surowych punktów bez uwzględnienia wielkości grup.',
        'Zapominanie, że średnia brzegowa maskuje to, co dzieje się wewnątrz poszczególnych warunków snu.',
      ],
      discussionQuestion: 'Średnia brzegowa testowania wynosi 13, a czytania 11. Czy to oznacza, że testowanie jest ZAWSZE lepsze od czytania?',
    },
  },
  {
    id: 3,
    title: 'Rozkład zmienności (Dekompozycja SS)',
    subtitle: 'SS całkowite = Σ(X − M)² = 150 dzieli się na efekty i błąd',
    keyConcepts: [
      'SS całkowite (Total) = 150 (100% całkowitej zmienności w badaniu)',
      'SS A (strategia) = 20 (13,3% zmienności)',
      'SS B (sen) = 45 (30,0% zmienności)',
      'SS A × B (interakcja) = 45 (30,0% zmienności)',
      'SS błąd (błąd losowy / wewnątrzgrupowy) = 40 (26,7% zmienności)',
    ],
    teacherNotes: {
      goal: 'Zrozumienie fundamentalnej idei analizy wariancji: rozbicie całkowitej wariancji wyników na składowe systematyczne i losowe.',
      talkingPoints: [
        'Użyj metafory tortu: Całkowity tort zmienności (150 punktów) dzielimy na 4 kawałki.',
        'Aż 60% zmienności to sen (30%) i interakcja (30%)!',
        'Błąd losowy (26,7%) to różnice indywidualne między osobami będącymi w tej samej grupie (np. dlaczego ktoś po czytaniu i krótkim śnie miał 6 słów, a inny 10).',
        'Zasada ortogonalności: W zrównoważonym planie (równe liczebności n=5), SS_total = SS_A + SS_B + SS_AxB + SS_error bez żadnych resztek czy kowariancji!',
      ],
      commonStudentMistakes: [
        'Mylenie błędu wewnątrzgrupowego (SS error) z "błędem badacza / pomyłką". Wyjaśnij, że to naturalna wariancja między ludźmi.',
        'Niezrozumienie, że suma procentów musi wynosić dokładnie 100%.',
      ],
      discussionQuestion: 'Co w tym badaniu wyjaśnia większą część zmienności zapamiętanych słów: rodzaj strategii czy długość snu?',
    },
  },
  {
    id: 4,
    title: 'Obliczenia sum kwadratów (Wzory)',
    subtitle: 'Dlaczego mnożymy przez n · b i jak obliczamy interakcję',
    keyConcepts: [
      'SSA = n · b · Σ(MAi − M)² = 5 · 2 · [(11 − 12)² + (13 − 12)²] = 10 · 2 = 20',
      'SSB = n · a · Σ(MBj − M)² = 5 · 2 · [(10,5 − 12)² + (13,5 − 12)²] = 10 · 4,5 = 45',
      'SS komórek = n · Σ(Mij − M)² = 5 · (16 + 4 + 1 + 1) = 110',
      'SSA×B = SS komórek − SSA − SSB = 110 − 20 − 45 = 45',
      'SS błąd = suma SS w 4 grupach = 10 + 10 + 10 + 10 = 40',
    ],
    teacherNotes: {
      goal: 'Odczarowanie wzorów matematycznych. Pokazanie, że każda suma kwadratów to po prostu odchylenia podniesione do kwadratu i przemnożone przez liczbę osób.',
      talkingPoints: [
        'Dlaczego we wzorze na SSA mnożymy przez n · b? Bo każda średnia brzegowa opiera się na n · b = 5 · 2 = 10 osobach!',
        'Pokaż logikę obliczania interakcji: SS komórek mierzy całą zmienność między 4 grupami (110). Odejmujemy od tego czysty efekt strategii (20) i czysty efekt snu (45). Co zostaje? Dokładnie to, co wynika ze współdziałania obu czynników (45)!',
        'Podkreśl, że SS błędu to po prostu suma wariancji wewnątrz poszczególnych komórek.',
      ],
      commonStudentMistakes: [
        'Zapominanie o przemnożeniu przez n (liczebność w komórce).',
        'Próba obliczania interakcji ze wzoru na średnie brzegowe zamiast jako różnicy odchyleń komórek.',
      ],
      discussionQuestion: 'Gdyby nie było interakcji (czyli gdyby linie na wykresie były równoległe), ile wynosiłoby SS komórek?',
    },
  },
  {
    id: 5,
    title: 'Tabela wyników ANOVA',
    subtitle: 'Od sum kwadratów przez stopnie swobody do testu F i siły efektu',
    keyConcepts: [
      'Stopnie swobody (df): df_A = 1, df_B = 1, df_AxB = 1, df_błąd = 16, df_total = 19',
      'Średni kwadrat (MS = SS / df): MS_A = 20, MS_B = 45, MS_AxB = 45, MS_błąd = 2,50',
      'Statystyka F = MS efektu / MS błędu: F_A = 8,00; F_B = 18,00; F_AxB = 18,00',
      'Wartość krytyczna F(1; 16) przy α = 0,05 wynosi 4,49 (wszystkie F > 4,49, więc p < 0,05)',
      'Cząstkowe eta-kwadrat: η²p = SS efektu / (SS efektu + SS błędu)',
    ],
    teacherNotes: {
      goal: 'Nauka sprawnego czytania i konstruowania tabeli ANOVA w sprawozdaniach naukowych i programach statystycznych (SPSS, JASP, Jamovi, R).',
      talkingPoints: [
        'Wyjaśnij intuicję statystyki F: to stosunek zmienności systematycznej (spowodowanej manipulacją eksperymentalną) do zmienności losowej (szumu/błędu).',
        'Wartość F = 18 oznacza, że różnice między grupami są 18 razy większe niż losowy szum wewnątrz grup!',
        'Wskaż stopnie swobody błędu: N - a · b = 20 - 4 = 16. Każda komórka traci 1 stopień swobody na wyliczenie swojej średniej, czyli 4 × (5 - 1) = 16.',
        'Wielkość efektu: η²p = 0,53 oznacza potężny efekt (wg konwencji Cohena > 0,14 to duży efekt).',
      ],
      commonStudentMistakes: [
        'Dzielenie MS błędu przez MS efektu (odwrotny iloraz).',
        'Mylenie całkowitego eta-kwadrat (SS efekt / SS total) z cząstkowym eta-kwadrat (SS efekt / (SS efekt + SS błąd)). W ANOVA 2x2 standardem jest cząstkowe eta-kwadrat!',
      ],
      discussionQuestion: 'Czy fakt, że oba efekty główne (A i B) są istotne, upoważnia nas do powiedzenia: "Długi sen zawsze poprawia pamięć, a testowanie zawsze pomaga"? Zastanówcie się przed przejściem do następnego slajdu!',
    },
  },
  {
    id: 6,
    title: 'Wykres interakcji: Wizualny test',
    subtitle: 'Linie nie są równoległe – kluczowy sygnał interakcji',
    keyConcepts: [
      'Oś X: Długość snu (Krótki sen vs Długi sen)',
      'Oś Y: Średnia liczba zapamiętanych słów (zakres 6 - 16)',
      'Linia niebieska: Ponowne czytanie (strome przejście 8 → 14)',
      'Linia różowa: Testowanie się (stały poziom 13 → 13)',
      'Brak równoległości: Efekt snu ZALEŻY od tego, jakiej strategii uczenia użyto!',
    ],
    teacherNotes: {
      goal: 'Rozwinięcie intuicji wizualnej: wykres interakcji jest najważniejszym narzędziem diagnostycznym w analizie czynnikowej.',
      talkingPoints: [
        'Złota reguła: Jeśli linie NIE są równoległe, to mamy do czynienia z interakcją!',
        'Gdyby linie były równoległe, oznaczałoby to brak interakcji (efekty addytywne).',
        'Pokaż studentom paradoks: Średnia brzegowa snu mówi, że długi sen poprawia pamięć o 3 słowa (10,5 → 13,5). Ale spójrzcie na linię testowania: 13 → 13! Dla osób testujących się sen nie zmienił absolutnie nic! To dlatego efekt główny jest mylący bez wykresu interakcji.',
      ],
      commonStudentMistakes: [
        'Przekonanie, że linie muszą się koniecznie przecinać (efekt krzyżowy), aby była interakcja. Nie! Wystarczy, że nie są równoległe (interakcja rzędowa lub nierządowa).',
        'Ignorowanie faktu, że zamiana osi miejscami (strategia na osi X, a sen jako linie) przedstawia dokładnie tę samą interakcję z innej perspektywy.',
      ],
      discussionQuestion: 'Wyobraźcie sobie studenta, który spał tylko 4 godziny przed egzaminem. Jaką strategię powinien wybrać na podstawie tego wykresu?',
    },
  },
  {
    id: 7,
    title: 'Interpretacja i efekty proste',
    subtitle: 'Wnioski merytoryczne i rozbicie interakcji (Simple Main Effects)',
    keyConcepts: [
      'Główna zasada interpretacji: Przy istotnej interakcji efekty główne są zniekształcone, dlatego testujemy EFEKTY PROSTE.',
      'Efekt prosty 1 (Krótki sen): Testowanie (13) vs Czytanie (8) → F(1, 16) = 25,00, p < 0,001 (ogromna przewaga testowania!)',
      'Efekt prosty 2 (Długi sen): Testowanie (13) vs Czytanie (14) → F(1, 16) = 1,00, p = 0,33 (brak istotnej różnicy!)',
      'Wniosek psychologiczny: Testowanie się działa jak "bufor" / pancerz ochronny przed skutkami niewyspania!',
      'Ponowne czytanie jest "wrażliwe" i działa dobrze tylko wtedy, gdy mózg miał czas na konsolidację w trakcie długiego snu.',
    ],
    teacherNotes: {
      goal: 'Nauczenie studentów formułowania precyzyjnych wniosków merytorycznych i raportowania efektów prostych zamiast naiwnych interpretacji efektów głównych.',
      talkingPoints: [
        'Podkreśl kluczową regułę metodologiczną: Gdy interakcja jest istotna statystycznie, NIE wolno interpretować efektów głównych wprost w sekcji Dyskusji wyników.',
        'Pokaż, skąd bierze się F = 25,00: Wzór na efekt prosty używa tego samego MS błędu (2,50) z całej tabeli ANOVA!',
        'Aplikacja praktyczna dla studentów: Testowanie się (fiszki, rozwiązywanie zadań) to technika odporna na zmęczenie poznawcze i brak snu, potwierdzona słynnym efektem testowania (Roediger & Karpicke, 2006).',
      ],
      commonStudentMistakes: [
        'Formułowanie wniosku: "I strategia ma znaczenie, i sen ma znaczenie", bez sprecyzowania warunków (czyli braku uwzględnienia interakcji).',
        'Wykonywanie osobnych testów t dla każdej pary komórek bez korekty lub bez wykorzystania błędu zbiorczego z ANOVA.',
      ],
      discussionQuestion: 'Czy gdyby interakcja NIE była istotna (np. p = 0,45), czy również sprawdzalibyśmy efekty proste? (Odpowiedź: Nie, wtedy interpretujemy po prostu efekty główne!)',
    },
  },
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: { id: string; text: string; correct: boolean; feedback: string }[];
  didacticExplanation: string;
}

export const STUDENT_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'W badaniu interakcja między strategią uczenia się a długością snu okazała się istotna statystycznie (p < 0,001). Co powinien zrobić badacz w pierwszej kolejności przy interpretacji wyników?',
    options: [
      {
        id: 'a',
        text: 'Zignorować interakcję i opisać jedynie efekty główne strategii oraz snu.',
        correct: false,
        feedback: 'Błąd! Efekty główne uśredniają poziomy drugiego czynnika i przy istotnej interakcji mogą dawać fałszywy, zniekształcony obraz rzeczywistości.',
      },
      {
        id: 'b',
        text: 'Zbadać efekty proste (simple main effects) – np. wpływ strategii osobno dla krótkiego i długiego snu.',
        correct: true,
        feedback: 'Dokładnie tak! Istotna interakcja oznacza, że wpływ jednego czynnika zależy od poziomu drugiego. Musimy więc "rozciąć" analizę i zbadać efekty proste.',
      },
      {
        id: 'c',
        text: 'Powtórzyć badanie, ponieważ interakcja świadczy o błędzie pomiarowym.',
        correct: false,
        feedback: 'Nie! Interakcja to cenna i naturalna zależność psychologiczna, a nie błąd pomiaru.',
      },
      {
        id: 'd',
        text: 'Wykonać test korelacji r-Pearsona między czynnikami A i B.',
        correct: false,
        feedback: 'Czynniki A i B to zmienne nominalne w planie eksperymentalnym, nie korelujemy ich.',
      },
    ],
    didacticExplanation: 'Złota zasada ANOVA: Istotna interakcja jest nadrzędna wobec efektów głównych. Gdy interakcja jest istotna, sprawdzamy efekty proste.',
  },
  {
    id: 2,
    question: 'Spoglądasz na wykres średnich w planie 2x2. Dwie linie łączące średnie komórek biegną do siebie niemal idealnie równolegle. Czego się spodziewasz w tabeli ANOVA?',
    options: [
      {
        id: 'a',
        text: 'Bardzo wysokiej, istotnej statystyki F dla efektu interakcji A × B.',
        correct: false,
        feedback: 'Przeciwnie! Równoległość linii to podręcznikowy znak BRAKU interakcji.',
      },
      {
        id: 'b',
        text: 'Niskiej statystyki F dla interakcji A × B i wartości p > 0,05 (brak istotnej interakcji).',
        correct: true,
        feedback: 'Świetnie! Równoległe linie oznaczają czysty model addytywny: wpływ czynnika B jest identyczny na każdym poziomie czynnika A.',
      },
      {
        id: 'c',
        text: 'Że oba efekty główne muszą wynosić zero.',
        correct: false,
        feedback: 'Nie! Linie równoległe mogą być strome (efekt czynnika na osi X) i leżeć w dużej odległości (efekt czynnika reprezentowanego przez linie).',
      },
      {
        id: 'd',
        text: 'Wielkości efektu eta-kwadrat równej 1,00 dla błędu.',
        correct: false,
        feedback: 'Brak związku.',
      },
    ],
    didacticExplanation: 'Wizualnym sygnałem braku interakcji są linie równoległe. Im większe odchylenie od równoległości (różne nachylenie lub przecinanie się), tym silniejsza interakcja.',
  },
  {
    id: 3,
    question: 'W tabeli ANOVA stopnie swobody dla błędu wynoszą df = 16. Skąd wzięła się ta liczba w badanym planie 2×2?',
    options: [
      {
        id: 'a',
        text: 'N − 1 = 19 − 3 = 16.',
        correct: false,
        feedback: 'To przypadkowa zbieżność arytmetyczna, ale nie odzwierciedla logiki wzoru df błędu.',
      },
      {
        id: 'b',
        text: 'Liczba komórek pomnożona przez 4.',
        correct: false,
        feedback: 'Nie, w badaniu są 4 komórki, a w każdej n = 5.',
      },
      {
        id: 'c',
        text: 'N − (a · b) = 20 − (2 · 2) = 20 − 4 = 16 (czyli 4 grupy po n − 1 = 4 stopnie swobody).',
        correct: true,
        feedback: 'Doskonale! W każdej z 4 komórek mamy 5 osób. Wewnątrz każdej komórki tracimy 1 stopień swobody na oszacowanie jej średniej: 4 × (5 - 1) = 16.',
      },
      {
        id: 'd',
        text: 'To stała wartość, która w planie 2x2 zawsze wynosi 16.',
        correct: false,
        feedback: 'Nie! Stopnie swobody błędu zależą od łącznej liczby badanych osób N.',
      },
    ],
    didacticExplanation: 'df błędu w planie międzygrupowym to zawsze N - k (gdzie k to łączna liczba grup/komórek). Przy 4 grupach i 20 osobach: 20 - 4 = 16.',
  },
  {
    id: 4,
    question: 'Cząstkowe eta-kwadrat (η²p) dla efektu interakcji wynosi 0,53. Jak poprawnie zinterpretować tę wielkość?',
    options: [
      {
        id: 'a',
        text: 'Interakcja wyjaśnia 53% zmienności zmiennej zależnej po wyłączeniu wpływu pozostałych efektów systematycznych.',
        correct: true,
        feedback: 'Bardzo dobrze! Wzór η²p = SS_efekt / (SS_efekt + SS_błąd) mierzy proporcję wariancji przypisaną interakcji w odniesieniu do wariancji niewyjaśnionej.',
      },
      {
        id: 'b',
        text: 'Badanie miało 53% szans na wykrycie błędu I rodzaju.',
        correct: false,
        feedback: 'Nie, to mylenie wielkości efektu z poziomem istotności lub mocą testu.',
      },
      {
        id: 'c',
        text: '53% badanych studentów zdało egzamin.',
        correct: false,
        feedback: 'To nie ma żadnego związku z parametrem statystycznym.',
      },
      {
        id: 'd',
        text: 'Efekt jest znikomy i nieistotny praktycznie wg Cohena.',
        correct: false,
        feedback: 'Wręcz przeciwnie! Wartość 0,53 to efekt gigantyczny (duży efekt zaczyna się już od 0,14).',
      },
    ],
    didacticExplanation: 'Cząstkowe eta kwadrat informuje o sile efektu: 0,01 = mały, 0,06 = średni, 0,14 = duży. Wynik 0,53 to ogromna siła wyjaśniająca.',
  },
  {
    id: 5,
    question: 'Na podstawie wyników badania, jaka jest najważniejsza rekomendacja praktyczna dla studenta przygotowującego się do trudnego egzaminu?',
    options: [
      {
        id: 'a',
        text: 'Wystarczy samo wielokrotne czytanie notatek, nawet przy bezsennej nocy.',
        correct: false,
        feedback: 'Absolutnie nie! Przy krótkim śnie czytanie dało zaledwie 8 zapamiętanych słów (najgorszy wynik w całym badaniu).',
      },
      {
        id: 'b',
        text: 'Testowanie się (np. fiszki, rozwiązywanie pytań) daje wysokie rezultaty (13 słów) nawet wtedy, gdy student zmuszony jest spać krótko.',
        correct: true,
        feedback: 'Wspaniale! To kluczowy psychologiczny wniosek: aktywny retrieval practice tworzy ślad pamięciowy odporny na niedobór snu.',
      },
      {
        id: 'c',
        text: 'Strategia uczenia się nie ma żadnego znaczenia, liczy się tylko długość snu.',
        correct: false,
        feedback: 'Nieprawda — przy krótkim śnie różnica między strategiami wynosiła aż 5 słów (F = 25,00, p < 0,001).',
      },
    ],
    didacticExplanation: 'Efekt testowania (Testing Effect) działa jak bufor poznawczy chroniący przed negatywnymi skutkami deprywacji snu.',
  },
];
