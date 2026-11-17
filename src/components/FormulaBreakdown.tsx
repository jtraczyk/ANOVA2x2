import React, { useState } from 'react';
import { Calculator, HelpCircle, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { compute2x2ANOVA, formatNum } from '../utils/statistics';
import { ORIGINAL_STUDY_DATA } from '../data/originalStudy';

export const FormulaBreakdown: React.FC = () => {
  const [activeFormula, setActiveFormula] = useState<'ssA' | 'ssB' | 'ssAxB' | 'ssError' | 'fRatio' | 'etaSq'>('ssA');
  const anova = compute2x2ANOVA(ORIGINAL_STUDY_DATA);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Przewodnik Obliczeniowy i Rozbijacz Wzorów</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Jak obliczyć ANOVA 2×2 krok po kroku
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Wybierz wzór poniżej, aby zrozumieć skąd bierze się każdy symbol i liczba.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Parametry badania:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700">
              n = 5 · a = 2 · b = 2 · N = 20
            </span>
          </div>
        </div>

        {/* Formula Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-4">
          {[
            { id: 'ssA', label: '1. SS_A (Strategia)', color: 'text-blue-400 border-blue-500/50' },
            { id: 'ssB', label: '2. SS_B (Sen)', color: 'text-emerald-400 border-emerald-500/50' },
            { id: 'ssAxB', label: '3. SS_A×B (Interakcja)', color: 'text-amber-400 border-amber-500/50' },
            { id: 'ssError', label: '4. SS_błąd (Wewnątrzgrupowy)', color: 'text-slate-300 border-slate-500/50' },
            { id: 'fRatio', label: '5. Statystyka F & df', color: 'text-purple-400 border-purple-500/50' },
            { id: 'etaSq', label: '6. Wielkość efektu (η²p)', color: 'text-pink-400 border-pink-500/50' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFormula(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeFormula === tab.id
                  ? `bg-indigo-600/30 text-white ${tab.color} shadow-sm ring-1 ring-indigo-500/40`
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Explanation Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* 1. SS_A */}
        {activeFormula === 'ssA' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">Krok 1</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Suma kwadratów dla czynnika A (Strategia uczenia się)
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Mierzy, o ile średnie brzegowe poziomów strategii (Czytanie = 11, Testowanie = 13) odbiegają od średniej ogólnej (12).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-blue-900/60 font-mono text-center space-y-3">
              <div className="text-lg sm:text-2xl text-blue-300 font-bold">
                SS<sub className="text-sm">A</sub> = n · b · Σ(M<sub className="text-sm">Ai</sub> − M)²
              </div>
              <div className="text-sm sm:text-lg text-slate-300">
                = 5 · 2 · [(11 − 12)² + (13 − 12)²]
              </div>
              <div className="text-sm sm:text-base text-slate-400">
                = 10 · [(-1)² + (1)²] = 10 · [1 + 1] = 10 · 2 = <strong className="text-blue-400 text-2xl font-black">20</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Dlaczego mnożymy przez (n · b)?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Każda średnia brzegowa poziomu A opiera się na obserwacjach z obu poziomów czynnika B. W tym badaniu dla ponownego czytania mamy <span className="font-mono text-white">5 osób w krótkim śnie + 5 osób w długim śnie = 10 osób</span> (<span className="font-mono text-white">n · b = 5 · 2 = 10</span>). Mnożenie przez 10 przywraca wagę pojedynczych uczestników!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Stopnie swobody df dla czynnika A
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Liczba poziomów czynnika minus jeden: <span className="font-mono text-white">df_A = a − 1 = 2 − 1 = 1</span>. Ponieważ mamy tylko 2 strategie, dysponujemy 1 niezależnym porównaniem.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. SS_B */}
        {activeFormula === 'ssB' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Krok 2</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Suma kwadratów dla czynnika B (Długość snu)
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Mierzy, o ile średnie brzegowe poziomów snu (Krótki = 10,5, Długi = 13,5) odbiegają od średniej ogólnej (12).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/60 font-mono text-center space-y-3">
              <div className="text-lg sm:text-2xl text-emerald-300 font-bold">
                SS<sub className="text-sm">B</sub> = n · a · Σ(M<sub className="text-sm">Bj</sub> − M)²
              </div>
              <div className="text-sm sm:text-lg text-slate-300">
                = 5 · 2 · [(10,5 − 12)² + (13,5 − 12)²]
              </div>
              <div className="text-sm sm:text-base text-slate-400">
                = 10 · [(-1,5)² + (1,5)²] = 10 · [2,25 + 2,25] = 10 · 4,5 = <strong className="text-emerald-400 text-2xl font-black">45</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Dlaczego mnożymy przez (n · a)?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Każda średnia brzegowa dla snu obejmuje uczestników ze wszystkich strategii uczenia się. Dla krótkiego snu mamy <span className="font-mono text-white">5 osób czytających + 5 osób testujących się = 10 osób</span> (<span className="font-mono text-white">n · a = 5 · 2 = 10</span>).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Stopnie swobody df dla czynnika B
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Liczba poziomów snu minus jeden: <span className="font-mono text-white">df_B = b − 1 = 2 − 1 = 1</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. SS_AxB */}
        {activeFormula === 'ssAxB' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">Krok 3</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Suma kwadratów dla interakcji A × B
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Interakcja to zmienność między 4 komórkami, której NIE da się wytłumaczyć prostą sumą efektu A i efektu B.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-900/60 font-mono text-center space-y-3">
              <div className="text-lg sm:text-2xl text-amber-300 font-bold">
                SS<sub className="text-sm">A×B</sub> = SS<sub className="text-sm">komórek</sub> − SS<sub className="text-sm">A</sub> − SS<sub className="text-sm">B</sub>
              </div>
              <div className="text-xs sm:text-sm text-slate-400">
                Gdzie SS<sub className="text-[10px]">komórek</sub> = n · Σ(M<sub className="text-[10px]">ij</sub> − M)² = 5 · [(8−12)² + (14−12)² + (13−12)² + (13−12)²] = 5 · (16 + 4 + 1 + 1) = 110
              </div>
              <div className="text-sm sm:text-lg text-slate-300">
                SS<sub className="text-sm">A×B</sub> = 110 − 20 − 45 = <strong className="text-amber-400 text-2xl font-black">45</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Intuicja matematyczna odejmowania
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Całkowita zmienność między 4 grupami wynosi 110. Gdyby nie było interakcji (model addytywny), różnice między grupami byłyby w 100% równe <span className="font-mono text-white">SS_A + SS_B = 20 + 45 = 65</span>. Różnica <span className="font-mono text-white">110 − 65 = 45</span> to "nadwyżka" wariancji powstała wyłącznie przez to, że czytanie i testowanie reagują na sen zupełnie inaczej!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Stopnie swobody df dla interakcji
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Iloczyn stopni swobody obu czynników: <span className="font-mono text-white">df_AxB = (a − 1) · (b − 1) = (2 − 1) · (2 − 1) = 1</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. SS_Error */}
        {activeFormula === 'ssError' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Krok 4</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Suma kwadratów błędu (Wewnątrzgrupowa / Residual)
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Mierzy różnice indywidualne między osobami będącymi w dokładnie tych samych warunkach eksperymentalnych.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-700 font-mono text-center space-y-3">
              <div className="text-lg sm:text-2xl text-slate-200 font-bold">
                SS<sub className="text-sm">błąd</sub> = Σ SS<sub className="text-sm">wewnątrz grup</sub>
              </div>
              <div className="text-sm sm:text-lg text-slate-300">
                = SS<sub className="text-xs">A1B1</sub> + SS<sub className="text-xs">A1B2</sub> + SS<sub className="text-xs">A2B1</sub> + SS<sub className="text-xs">A2B2</sub>
              </div>
              <div className="text-sm sm:text-base text-slate-400">
                = 10 + 10 + 10 + 10 = <strong className="text-white text-2xl font-black">40</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Czym jest "błąd" w statystyce?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  To nie jest pomyłka eksperymentatora! To naturalne różnice biologiczne, zdolności poznawcze, uwaga czy motywacja osób w tej samej grupie, których nie kontrolujemy naszymi czynnikami A i B.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Stopnie swobody df dla błędu
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Każda komórka traci 1 stopień swobody na wyliczenie swojej średniej: <span className="font-mono text-white">df_błąd = N − a · b = 20 − 4 = 16</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. F-Ratio */}
        {activeFormula === 'fRatio' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">Krok 5</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Średnie kwadraty (MS) i statystyka F Snedecora
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Statystyka F porównuje zmienność wywołaną manipulacją badawczą do szumu losowego.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-center">
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/50 space-y-2">
                <div className="text-xs uppercase text-slate-400">Średni kwadrat błędu:</div>
                <div className="text-lg font-bold text-purple-300">
                  MS<sub className="text-xs">błąd</sub> = SS<sub className="text-xs">błąd</sub> / df<sub className="text-xs">błąd</sub>
                </div>
                <div className="text-sm text-slate-200">= 40 / 16 = <strong className="text-white">2,50</strong></div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/50 space-y-2">
                <div className="text-xs uppercase text-slate-400">Statystyka testowa F:</div>
                <div className="text-lg font-bold text-purple-300">
                  F = MS<sub className="text-xs">efektu</sub> / MS<sub className="text-xs">błędu</sub>
                </div>
                <div className="text-xs text-slate-400">Dla interakcji: 45,00 / 2,50 = <strong className="text-white text-base">18,00</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-2">
              <h4 className="font-bold text-slate-200 text-sm">Zasada podejmowania decyzji o istotności:</h4>
              <p className="text-slate-300 leading-relaxed">
                Porównujemy obliczoną statystykę F z tabelaryczną <strong>wartością krytyczną F_kryt(1, 16) = 4,49</strong> przy poziomie istotności α = 0,05:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong className="text-blue-400 font-mono">F_A = 8,00 &gt; 4,49</strong> → Efekt strategii jest istotny (p = 0,012).</li>
                <li><strong className="text-emerald-400 font-mono">F_B = 18,00 &gt; 4,49</strong> → Efekt snu jest istotny (p &lt; 0,001).</li>
                <li><strong className="text-amber-400 font-mono">F_AxB = 18,00 &gt; 4,49</strong> → Efekt interakcji jest istotny (p &lt; 0,001).</li>
              </ul>
            </div>
          </div>
        )}

        {/* 6. Partial Eta Squared */}
        {activeFormula === 'etaSq' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs uppercase tracking-wider text-pink-400 font-bold">Krok 6</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Wielkość efektu: Cząstkowe eta-kwadrat (η²p)
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Określa siłę oddziaływania zmiennej niezależnej w oderwaniu od wielkości próby.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-pink-900/60 font-mono text-center space-y-3">
              <div className="text-lg sm:text-2xl text-pink-300 font-bold">
                η²<sub className="text-sm">p</sub> = SS<sub className="text-sm">efektu</sub> / (SS<sub className="text-sm">efektu</sub> + SS<sub className="text-sm">błędu</sub>)
              </div>
              <div className="text-sm sm:text-base text-slate-300">
                Dla interakcji: η²<sub className="text-xs">p</sub> = 45 / (45 + 40) = 45 / 85 ≈ <strong className="text-pink-400 text-2xl font-black">0,53</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm">Klasyfikacja Cohena dla η²p:</h4>
                <ul className="space-y-1 text-slate-300">
                  <li><span className="font-mono text-slate-400">0,01</span> — Mały efekt</li>
                  <li><span className="font-mono text-slate-400">0,06</span> — Średni efekt</li>
                  <li><span className="font-mono text-slate-400">0,14</span> — Duży efekt</li>
                </ul>
                <p className="text-pink-300 pt-1 font-medium">
                  Wartość 0,53 w naszym badaniu oznacza kolosalną siłę wyjaśniającą interakcji!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-sm">Dlaczego η² cząstkowe, a nie zwykłe η²?</h4>
                <p className="text-slate-300 leading-relaxed">
                  Zwykłe eta kwadrat (SS_efekt / SS_total) zależy od liczby pozostałych czynników wprowadzonych do modelu. Cząstkowe eta kwadrat izoluje dany efekt, usuwając pozostałe czynniki z mianownika.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
