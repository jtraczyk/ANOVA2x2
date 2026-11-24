import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Shuffle,
  RotateCcw,
  ClipboardCheck,
  Award,
} from 'lucide-react';
import { DesignDimensions, DesignMode, GeneratedStudy } from '../types/quiz';
import {
  formatDecimal,
  formatPVal,
  generateRandomAnovaStudy,
  GeneratorFilter,
} from '../utils/factorialAnovaGenerator';
import { QuizInteractionPlot } from './QuizInteractionPlot';

const DIMENSION_FILTERS: Array<{ value: DesignDimensions | 'random'; label: string }> = [
  { value: 'random', label: 'Dowolny wymiar' },
  { value: '2x2', label: '2 × 2' },
  { value: '2x3', label: '2 × 3' },
  { value: '2x2x2', label: '2 × 2 × 2' },
];

const MODE_FILTERS: Array<{ value: DesignMode | 'random'; label: string }> = [
  { value: 'random', label: 'Dowolny typ' },
  { value: 'between', label: 'Niezależny' },
  { value: 'within', label: 'Zależny' },
  { value: 'mixed', label: 'Mieszany' },
];

export const AnovaQuizLab: React.FC = () => {
  const [filter, setFilter] = useState<GeneratorFilter>({
    dimensions: 'random',
    designMode: 'random',
  });
  const [study, setStudy] = useState<GeneratedStudy>(() => generateRandomAnovaStudy());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerate = (nextFilter: GeneratorFilter = filter) => {
    setStudy(generateRandomAnovaStudy(nextFilter));
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleDimensionChange = (dimensions: DesignDimensions | 'random') => {
    const next = { ...filter, dimensions };
    setFilter(next);
    handleGenerate(next);
  };

  const handleModeChange = (designMode: DesignMode | 'random') => {
    const next = { ...filter, designMode };
    setFilter(next);
    handleGenerate(next);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleRetrySameStudy = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  const answeredCount = study.questions.filter((q) => answers[q.id] !== undefined).length;
  const allAnswered = answeredCount === study.questions.length;

  const correctCount = isSubmitted
    ? study.questions.reduce((acc, q) => {
        const chosen = q.options.find((o) => o.id === answers[q.id]);
        return acc + (chosen?.isCorrect ? 1 : 0);
      }, 0)
    : 0;

  return (
    <div className="w-full flex flex-col gap-3 py-1">
      {/* Control Toolbar */}
      <div className="w-full bg-white border border-[#cfd8dd] rounded-xl px-3.5 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Dimensions Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-[#5a6c77] whitespace-nowrap">Plan:</span>
            <div className="inline-flex items-center p-0.5 bg-[#f4f6f7] border border-[#dfe5e8] rounded-lg gap-0.5">
              {DIMENSION_FILTERS.map((opt) => {
                const active = (filter.dimensions ?? 'random') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleDimensionChange(opt.value)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef9421] ${
                      active
                        ? 'bg-[#344b57] text-white shadow-2xs'
                        : 'text-[#5a6c77] hover:text-[#344b57] hover:bg-white/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Design Mode Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-[#5a6c77] whitespace-nowrap">Grupy:</span>
            <div className="inline-flex items-center p-0.5 bg-[#f4f6f7] border border-[#dfe5e8] rounded-lg gap-0.5">
              {MODE_FILTERS.map((opt) => {
                const active = (filter.designMode ?? 'random') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleModeChange(opt.value)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef9421] ${
                      active
                        ? 'bg-[#344b57] text-white shadow-2xs'
                        : 'text-[#5a6c77] hover:text-[#344b57] hover:bg-white/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleGenerate()}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#e28b1f] hover:bg-[#cf7a12] text-white text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#344b57]"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Losuj nowe badanie</span>
        </button>
      </div>

      {/* Main Split Workspace: Left = Attachment (Description + APA7 Table + Extended Descriptives + Plot), Right = 6 Quiz Questions */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* LEFT ZONE: Załącznik 1 (7 columns on xl) */}
        <section
          aria-label="Załącznik 1 — opis badania, tabele i wykres"
          className="xl:col-span-7 bg-white border border-[#cfd8dd] rounded-xl p-4 sm:p-5 shadow-2xs space-y-5"
        >
          {/* Attachment Heading + Study Description */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2 border-b border-[#e2e7ea]">
              <h2 className="text-sm sm:text-base font-bold text-[#344b57]">
                Załącznik 1. {study.scenarioTitle}
              </h2>
              <span className="text-[11px] text-[#6d7b83] font-mono tabular-nums">
                <em>N</em> = {study.nTotal} · zmienna zależna: {study.dvUnit}
              </span>
            </div>

            <p className="text-xs sm:text-[13.5px] leading-relaxed text-[#253640]">
              {study.description}
            </p>
            <p className="text-xs text-[#5a6c77]">
              Wyniki tego badania są podsumowane w Tabeli 1, Tabeli 2 oraz na Wykresie 1.
            </p>
          </div>

          {/* Tabela 1: APA 7 ANOVA Summary Table */}
          <div className="space-y-1.5">
            <div className="text-xs sm:text-[13px] text-[#253640]">
              <strong className="font-bold">Tabela 1.</strong>{' '}
              <span className="italic">Podsumowanie analizy wariancji.</span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-[11.5px] sm:text-xs border-collapse text-[#1f2d35]">
                <thead>
                  <tr className="border-t-2 border-b border-[#344b57] text-[#253640]">
                    <th className="py-2 pr-3 text-left font-semibold">Efekty</th>
                    <th className="py-2 px-2 text-right font-semibold whitespace-nowrap">
                      Suma kwadratów
                    </th>
                    <th className="py-2 px-2 text-right font-semibold whitespace-nowrap">
                      <em>df</em>
                    </th>
                    <th className="py-2 px-2 text-right font-semibold whitespace-nowrap">
                      Średni kwadrat
                    </th>
                    <th className="py-2 px-2 text-right font-semibold whitespace-nowrap">
                      <em>F</em>
                    </th>
                    <th className="py-2 px-2 text-right font-semibold whitespace-nowrap">
                      <em>p</em>
                    </th>
                    <th className="py-2 px-2 text-right font-semibold whitespace-nowrap">
                      η<sub>p</sub><sup>2</sup>
                    </th>
                    <th className="py-2 pl-2 text-right font-semibold whitespace-nowrap">
                      ω<sup>2</sup>
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono tabular-nums border-b-2 border-[#344b57]">
                  {study.anovaRows.map((row) => {
                    if (row.isSectionHeader) {
                      return (
                        <tr key={row.id} className="bg-[#f7f9fa] border-t border-[#dfe5e8]">
                          <td
                            colSpan={8}
                            className="py-1.5 px-1 font-sans text-[11px] font-bold text-[#344b57]"
                          >
                            {row.sectionTitle}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={row.id}
                        className={
                          row.isError
                            ? 'text-[#5a6c77] bg-[#fafbfc] border-b border-[#eef2f4]'
                            : 'text-[#1f2d35] hover:bg-[#f7f9fa] transition-colors'
                        }
                      >
                        <td
                          className={`py-1.5 pr-3 text-left font-sans ${
                            row.isError ? 'pl-2 italic text-[11.5px]' : 'font-medium'
                          }`}
                        >
                          {row.label}
                        </td>
                        <td className="py-1.5 px-2 text-right whitespace-nowrap">
                          {formatDecimal(row.ss, 3)}
                        </td>
                        <td className="py-1.5 px-2 text-right whitespace-nowrap">
                          {row.df}
                        </td>
                        <td className="py-1.5 px-2 text-right whitespace-nowrap">
                          {formatDecimal(row.ms, 3)}
                        </td>
                        <td className="py-1.5 px-2 text-right whitespace-nowrap font-semibold">
                          {row.f !== undefined ? formatDecimal(row.f, 3) : ''}
                        </td>
                        <td className="py-1.5 px-2 text-right whitespace-nowrap font-semibold">
                          {row.p !== undefined ? formatPVal(row.p) : ''}
                        </td>
                        <td className="py-1.5 px-2 text-right whitespace-nowrap">
                          {row.etaSqP !== undefined ? formatDecimal(row.etaSqP, 3) : ''}
                        </td>
                        <td className="py-1.5 pl-2 text-right whitespace-nowrap">
                          {row.omegaSq !== undefined ? formatDecimal(row.omegaSq, 3) : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#5a6c77]">
              <span className="italic">Uwaga.</span> {study.tableNote}
            </p>
          </div>

          {/* Tabela 2: Extended Cell Means, SD & 95% CI */}
          <div className="space-y-1.5 pt-2 border-t border-[#e2e7ea]">
            <div className="text-xs sm:text-[13px] text-[#253640]">
              <strong className="font-bold">Tabela 2.</strong>{' '}
              <span className="italic">Średnie (M), odchylenia standardowe (SD) oraz 95% przedziały ufności (95% CI) w poszczególnych warunkach.</span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-[11.5px] sm:text-xs border-collapse text-[#1f2d35]">
                <thead>
                  <tr className="border-t-2 border-b border-[#344b57] text-[#253640]">
                    <th className="py-1.5 pr-2 text-left font-semibold">{study.factors.A.name}</th>
                    <th className="py-1.5 px-2 text-left font-semibold">{study.factors.B.name}</th>
                    {study.factors.C && (
                      <th className="py-1.5 px-2 text-left font-semibold">{study.factors.C.name}</th>
                    )}
                    <th className="py-1.5 px-2 text-right font-semibold">
                      <em>n</em>
                    </th>
                    <th className="py-1.5 px-2 text-right font-semibold">
                      <em>M</em>
                    </th>
                    <th className="py-1.5 px-2 text-right font-semibold">
                      <em>SD</em>
                    </th>
                    <th className="py-1.5 pl-2 text-right font-semibold whitespace-nowrap">
                      95% CI [dolna; górna]
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono tabular-nums border-b-2 border-[#344b57]">
                  {study.cells.map((cell, idx) => (
                    <tr
                      key={`${cell.aIdx}-${cell.bIdx}-${cell.cIdx}`}
                      className={idx % 2 === 1 ? 'bg-[#fafbfc]' : 'bg-white'}
                    >
                      <td className="py-1.5 pr-2 text-left font-sans font-medium text-[#344b57]">
                        {cell.aLabel}
                      </td>
                      <td className="py-1.5 px-2 text-left font-sans text-[#344b57]">
                        {cell.bLabel}
                      </td>
                      {study.factors.C && (
                        <td className="py-1.5 px-2 text-left font-sans text-[#344b57]">
                          {cell.cLabel}
                        </td>
                      )}
                      <td className="py-1.5 px-2 text-right text-[#6d7b83]">{cell.n}</td>
                      <td className="py-1.5 px-2 text-right font-bold text-[#253640]">
                        {formatDecimal(cell.mean, 2)}
                      </td>
                      <td className="py-1.5 px-2 text-right text-[#5a6c77]">
                        {formatDecimal(cell.sd, 2)}
                      </td>
                      <td className="py-1.5 pl-2 text-right whitespace-nowrap text-[#344b57]">
                        [{formatDecimal(cell.ciLow, 2)}; {formatDecimal(cell.ciHigh, 2)}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wykres 1: Interaction Plot */}
          <div className="space-y-2 pt-2 border-t border-[#e2e7ea]">
            <div className="text-xs sm:text-[13px] text-[#253640]">
              <strong className="font-bold">Wykres 1.</strong>{' '}
              <span className="italic">Średnie i 95% CI w poszczególnych warunkach.</span>
            </div>
            <QuizInteractionPlot study={study} />
          </div>
        </section>

        {/* RIGHT ZONE: Interactive Quiz Sheet (5 columns on xl) */}
        <section
          aria-label="Arkusz pytań sprawdzających interpretację wyników"
          className="xl:col-span-5 bg-white border border-[#cfd8dd] rounded-xl p-4 sm:p-5 shadow-2xs space-y-4"
        >
          {/* Quiz Header & Progress */}
          <div className="space-y-2 pb-3 border-b border-[#e2e7ea]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#344b57]">
                Pytania sprawdzające
              </h2>
              <span className="text-xs font-mono tabular-nums font-semibold text-[#5a6c77]">
                Odpowiedzi: {answeredCount} / {study.questions.length}
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#eef2f4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ef9421] transition-all duration-200"
                style={{ width: `${(answeredCount / study.questions.length) * 100}%` }}
              />
            </div>

            {!isSubmitted && (
              <p className="text-xs text-[#6d7b83]">
                Zaznacz odpowiedzi na wszystkie {study.questions.length} pytań na podstawie Załącznika 1, a następnie kliknij „Sprawdź odpowiedzi”.
              </p>
            )}
          </div>

          {/* Score Summary Banner (Only visible after submission) */}
          {isSubmitted && (
            <div
              className={`p-3.5 rounded-xl border space-y-2.5 ${
                correctCount >= 5
                  ? 'bg-[#ecf7f4] border-[#84c5ba] text-[#15453d]'
                  : correctCount >= 3
                  ? 'bg-[#fef5e7] border-[#f4cc92] text-[#7c4305]'
                  : 'bg-[#fef2f2] border-[#fca5a5] text-[#7f1d1d]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>
                    Wynik: {correctCount} / {study.questions.length} (
                    {Math.round((correctCount / study.questions.length) * 100)}%)
                  </span>
                </div>
                <span className="text-xs font-semibold">
                  {correctCount === study.questions.length
                    ? 'Bezbłędna interpretacja'
                    : correctCount >= 4
                    ? 'Bardzo dobry wynik'
                    : 'Warto przeanalizować komentarze'}
                </span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                Poniżej znajdziesz szczegółowe wyjaśnienia powiązane bezpośrednio z liczbami z Tabeli 1, Tabeli 2 i Wykresu 1.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleRetrySameStudy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#f7f7f7] text-[#344b57] border border-[#cfd8dd] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rozwiąż ponownie</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e28b1f] hover:bg-[#cf7a12] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Losuj nowe badanie</span>
                </button>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="divide-y divide-[#e2e7ea]">
            {study.questions.map((q, qIdx) => {
              const selectedOptId = answers[q.id];
              const selectedOpt = q.options.find((o) => o.id === selectedOptId);
              const isQuestionCorrect = Boolean(selectedOpt?.isCorrect);

              return (
                <div key={q.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs sm:text-[13px] font-semibold text-[#253640] leading-snug">
                      <span className="font-mono text-[#6d7b83] mr-1.5">{qIdx + 1}.</span>
                      {q.prompt}
                    </h3>

                    {isSubmitted && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold shrink-0 whitespace-nowrap ${
                          isQuestionCorrect ? 'text-[#1f5e54]' : 'text-[#b91c1c]'
                        }`}
                      >
                        {isQuestionCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Poprawnie</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Niepoprawnie</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5">
                    {q.options.map((opt) => {
                      const isSelected = selectedOptId === opt.id;

                      let btnClasses =
                        'bg-[#fafbfc] border-[#dfe5e8] text-[#344b57] hover:bg-[#f1f5f7] hover:border-[#b8c7cf]';

                      if (!isSubmitted && isSelected) {
                        btnClasses =
                          'bg-[#fef5e7] border-[#e28b1f] text-[#253640] font-semibold ring-1 ring-[#e28b1f]';
                      } else if (isSubmitted) {
                        if (opt.isCorrect) {
                          btnClasses =
                            'bg-[#ecf7f4] border-[#2a7b6f] text-[#15453d] font-semibold';
                        } else if (isSelected && !opt.isCorrect) {
                          btnClasses =
                            'bg-[#fef2f2] border-[#dc2626] text-[#991b1b] font-medium';
                        } else {
                          btnClasses =
                            'bg-white border-[#eef2f4] text-[#85868c] opacity-75';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`w-full min-h-[40px] px-3 py-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between gap-2 ${
                            isSubmitted ? 'cursor-default' : 'cursor-pointer'
                          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef9421] ${btnClasses}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-5 h-5 rounded text-[10.5px] font-mono font-bold flex items-center justify-center shrink-0 uppercase border ${
                                !isSubmitted && isSelected
                                  ? 'bg-[#e28b1f] text-white border-[#cf7a12]'
                                  : isSubmitted && opt.isCorrect
                                  ? 'bg-[#2a7b6f] text-white border-[#1f5e54]'
                                  : isSubmitted && isSelected && !opt.isCorrect
                                  ? 'bg-[#dc2626] text-white border-[#b91c1c]'
                                  : 'bg-white text-[#5a6c77] border-[#cfd8dd]'
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </div>

                          {isSubmitted && opt.isCorrect && (
                            <span className="text-[10.5px] font-bold text-[#1f5e54] whitespace-nowrap shrink-0">
                              Poprawna odpowiedź
                            </span>
                          )}
                          {isSubmitted && isSelected && !opt.isCorrect && (
                            <span className="text-[10.5px] font-bold text-[#b91c1c] whitespace-nowrap shrink-0">
                              Twoja odpowiedź
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Deferred Data-Driven Feedback */}
                  {isSubmitted && (
                    <div className="p-2.5 rounded-lg bg-[#f7f7f7] border border-[#dfe5e8] text-[11.5px] text-[#344b57] leading-relaxed">
                      <strong className="font-semibold text-[#253640]">Uzasadnienie na podstawie danych: </strong>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action Footer */}
          {!isSubmitted && (
            <div className="pt-3 border-t border-[#e2e7ea] flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#6d7b83]">
                {allAnswered
                  ? 'Wszystkie odpowiedzi zaznaczone — możesz sprawdzić wynik.'
                  : `Pozostało pytań bez odpowiedzi: ${study.questions.length - answeredCount}`}
              </span>
              <button
                type="button"
                disabled={!allAnswered}
                onClick={() => setIsSubmitted(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#344b57] hover:bg-[#253640] disabled:bg-[#b8c7cf] disabled:cursor-not-allowed text-white text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef9421]"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Sprawdź odpowiedzi</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
