import React, { useState } from 'react';
import { FileText, Copy, Check, BookOpen, Globe } from 'lucide-react';
import { compute2x2ANOVA } from '../utils/statistics';
import { ORIGINAL_STUDY_DATA } from '../data/originalStudy';

export const ApaReportGenerator: React.FC = () => {
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');
  const [copied, setCopied] = useState(false);

  const anova = compute2x2ANOVA(ORIGINAL_STUDY_DATA);

  const reportTextPL = `Przeprowadzono dwuczynnikową analizę wariancji (ANOVA 2 × 2) w schemacie międzygrupowym w celu zbadania wpływu strategii uczenia się (ponowne czytanie vs testowanie się) oraz długości snu (krótki vs długi sen) na liczbę zapamiętanych słów.

Stwierdzono istotny statystycznie efekt główny strategii uczenia się, F(1, 16) = 8,00; p = 0,012; η²p = 0,33. Osoby testujące się zapamiętały ogólnie więcej słów (M = 13,00) niż osoby ponownie czytające (M = 11,00). Istotny okazał się również efekt główny długości snu, F(1, 16) = 18,00; p < 0,001; η²p = 0,53 — uczestnicy po długim śnie osiągnęli wyższe wyniki (M = 13,50) niż po krótkim śnie (M = 10,50).

Kluczowy dla hipotez badawczych efekt interakcji strategii uczenia się i długości snu okazał się statystycznie istotny, F(1, 16) = 18,00; p < 0,001; η²p = 0,53. Ze względu na istotność interakcji przeprowadzono analizę efektów prostych. Wykazała ona, że w warunku krótkiego snu technika testowania się prowadziła do istotnie lepszych wyników niż ponowne czytanie, F(1, 16) = 25,00; p < 0,001; η²p = 0,61 (M = 13,00 vs M = 8,00). Z kolei w warunku długiego snu różnica między strategiami uczenia się okazała się nieistotna statystycznie, F(1, 16) = 1,00; p = 0,332; η²p = 0,06 (M = 13,00 vs M = 14,00).

Uzyskane wyniki wskazują, że testowanie się działa jak poznawczy bufor chroniący pamięć przed negatywnymi skutkami deprywacji snu, podczas gdy skuteczność ponownego czytania jest silnie uzależniona od długiego odpoczynku nocnego.`;

  const reportTextEN = `A 2 × 2 between-subjects Analysis of Variance (ANOVA) was conducted to evaluate the effects of learning strategy (rereading vs. retrieval practice/testing) and sleep duration (short vs. long sleep) on the number of recalled words.

The main effect of learning strategy was statistically significant, F(1, 16) = 8.00, p = .012, η²p = .33, with testing yielding higher recall overall (M = 13.00) than rereading (M = 11.00). The main effect of sleep duration was also significant, F(1, 16) = 18.00, p < .001, η²p = .53, with participants in the long sleep condition outperforming those in the short sleep condition (M = 13.50 vs. M = 10.50).

Crucially, the interaction between learning strategy and sleep duration was statistically significant, F(1, 16) = 18.00, p < .001, η²p = .53. Analysis of simple main effects revealed that under short sleep conditions, testing produced significantly higher recall than rereading, F(1, 16) = 25.00, p < .001, η²p = .61 (M = 13.00 vs. M = 8.00). In contrast, following a full night of sleep, the difference between learning strategies was not statistically significant, F(1, 16) = 1.00, p = .332, η²p = .06 (M = 13.00 vs. M = 14.00).

These findings demonstrate that retrieval practice buffers memory consolidation against sleep deprivation, whereas passive rereading requires adequate sleep to facilitate memory retention.`;

  const handleCopy = () => {
    const textToCopy = language === 'pl' ? reportTextPL : reportTextEN;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Standard Raportowania Naukowego (APA 7th Edition)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Wzorcowy raport wyników do pracy badawczej
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Gotowy opis sekcji wyników i dyskusji z prawidłowymi konwencjami edytorskimi.
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setLanguage('pl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                language === 'pl'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Język polski
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                language === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English (APA 7th)
            </button>
          </div>
        </div>

        {/* Report Output Box */}
        <div className="relative bg-slate-950 rounded-2xl p-6 border border-slate-800 font-sans leading-relaxed text-sm text-slate-200 whitespace-pre-line shadow-inner">
          {language === 'pl' ? reportTextPL : reportTextEN}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Skopiowano do schowka!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopiuj tekst raportu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* APA Style Rules Checklist */}
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3 text-xs">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Zasady zapisu APA 7th, na które warto zwrócić uwagę studentów:
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="font-mono text-indigo-400 font-bold">1.</span>
              <span>
                <strong>Kursywa dla symboli statystycznych:</strong> litery <em>F</em>, <em>p</em>, <em>M</em>, <em>SD</em>, <em>N</em>, <em>n</em> piszemy zawsze kursywą.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="font-mono text-indigo-400 font-bold">2.</span>
              <span>
                <strong>Stopnie swobody w nawiasie:</strong> <em>F</em>(1, 16) oznacza 1 stopień swobody dla efektu i 16 dla błędu.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="font-mono text-indigo-400 font-bold">3.</span>
              <span>
                <strong>Zapis p w APA po angielsku:</strong> nie piszemy zera przed kropką (np. <em>p</em> = .012 lub <em>p</em> &lt; .001), ponieważ <em>p</em> nigdy nie przekracza 1.
              </span>
            </li>
            <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="font-mono text-indigo-400 font-bold">4.</span>
              <span>
                <strong>Wielkość efektu:</strong> zawsze podajemy cząstkowe eta-kwadrat (η²p) jako miarę siły efektu.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
