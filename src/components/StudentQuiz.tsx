import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';
import { STUDENT_QUIZ } from '../data/originalStudy';

export const StudentQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const question = STUDENT_QUIZ[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[question.id];
  const isAnswered = selectedOptionId !== undefined;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < STUDENT_QUIZ.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  // Score calculation
  const totalCorrect = STUDENT_QUIZ.reduce((acc, q) => {
    const selectedId = selectedAnswers[q.id];
    const option = q.options.find((o) => o.id === selectedId);
    return acc + (option?.correct ? 1 : 0);
  }, 0);

  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Trening Interpretacji i Quiz dla Studentów</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Sprawdź zrozumienie ANOVA 2×2
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Pytania sprawdzające umiejętność czytania wykresów, interpretowania interakcji i unikania błędów poznawczych.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Pytanie:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700">
              {currentQuestionIndex + 1} / {STUDENT_QUIZ.length}
            </span>
          </div>
        </div>

        {!showResults ? (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / STUDENT_QUIZ.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {question.question}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {question.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let cardStyle = 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200';

                if (isAnswered) {
                  if (opt.correct) {
                    cardStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50';
                  } else if (isSelected && !opt.correct) {
                    cardStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 ring-1 ring-rose-500/50';
                  } else {
                    cardStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${cardStyle}`}
                  >
                    <span className="w-6 h-6 rounded-md bg-slate-700/60 border border-slate-600 font-mono text-xs flex items-center justify-center shrink-0 uppercase">
                      {opt.id}
                    </span>
                    <div className="flex-1">
                      <span>{opt.text}</span>
                      {isAnswered && (isSelected || opt.correct) && (
                        <div
                          className={`mt-2 pt-2 border-t text-xs leading-relaxed font-medium ${
                            opt.correct
                              ? 'border-emerald-800/60 text-emerald-300'
                              : 'border-rose-800/60 text-rose-300'
                          }`}
                        >
                          {opt.feedback}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Didactic explanation upon answer */}
            {isAnswered && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Komentarz dydaktyczny: </strong>
                  <span>{question.didacticExplanation}</span>
                </div>
              </div>
            )}

            {/* Next / Finish Button */}
            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
              >
                <span>{currentQuestionIndex < STUDENT_QUIZ.length - 1 ? 'Następne pytanie' : 'Zobacz wynik końcowy'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Final Results View */
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Quiz ukończony!</h3>
              <p className="text-sm text-slate-400 mt-1">
                Twój wynik ze zrozumienia dwuczynnikowej analizy wariancji:
              </p>
            </div>

            <div className="inline-block p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono">
              <div className="text-5xl font-black text-indigo-400">
                {totalCorrect} <span className="text-2xl text-slate-500 font-normal">/ {STUDENT_QUIZ.length}</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-sans">
                {totalCorrect === 5
                  ? '🌟 Perfekcyjnie! Gotowy na egzamin i interpretację badań.'
                  : totalCorrect >= 3
                  ? '👍 Dobry wynik! Przejrzyj slajd 6 i 7 dotyczące efektów prostych.'
                  : '📚 Warto powtórzyć: zwróć uwagę na różnicę między efektami głównymi a prostymi.'}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rozwiąż ponownie</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
