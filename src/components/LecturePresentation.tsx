import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  MessageSquare, 
  Lightbulb, 
  AlertTriangle, 
  HelpCircle,
  Eye,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Info
} from 'lucide-react';
import { SLIDES_CONTENT, ORIGINAL_STUDY_DATA } from '../data/originalStudy';
import { compute2x2ANOVA, formatNum, formatPValue } from '../utils/statistics';

interface LecturePresentationProps {
  onOpenSandboxWithPreset?: (presetId: string) => void;
}

export const LecturePresentation: React.FC<LecturePresentationProps> = ({ onOpenSandboxWithPreset }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showTeacherNotes, setShowTeacherNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [interactiveHighlight, setInteractiveHighlight] = useState<string | null>(null);

  const totalSlides = SLIDES_CONTENT.length;
  const currentSlide = SLIDES_CONTENT[currentSlideIndex];
  const anovaResults = compute2x2ANOVA(ORIGINAL_STUDY_DATA);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key.toLowerCase() === 'n') {
        setShowTeacherNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Presentation Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="font-semibold text-indigo-400">Slajd {currentSlideIndex + 1}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalSlides}</span>
          </div>
          <span className="hidden sm:inline-block w-px h-4 bg-slate-700" />
          <h2 className="hidden md:inline-block text-sm font-medium text-slate-200 truncate max-w-md">
            {currentSlide.title}
          </h2>
        </div>

        {/* Slide jump pills */}
        <div className="hidden lg:flex items-center gap-1.5">
          {SLIDES_CONTENT.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`w-7 h-7 rounded-md text-xs font-semibold transition-all ${
                idx === currentSlideIndex
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
              title={`Slajd ${idx + 1}: ${s.title}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTeacherNotes(!showTeacherNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              showTeacherNotes
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Wskazówki dydaktyczne i pytania do studentów (klawisz N)"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Notatki dydaktyka</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Pełny ekran (klawisz F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Poprzedni slajd (Strzałka w lewo)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1))}
              disabled={currentSlideIndex === totalSlides - 1}
              className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Następny slajd (Strzałka w prawo / Spacja)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="relative w-full min-h-[580px] bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden flex flex-col justify-between">
        {/* Slide Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <span>Materiały Dydaktyczne SWPS</span>
            <span>·</span>
            <span>Slajd {currentSlideIndex + 1} z {totalSlides}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight text-balance">
            {currentSlide.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Dynamic Slide Content Body */}
        <div className="flex-1 flex flex-col justify-center my-2">
          {/* SLAJD 1: WPROWADZENIE I PLAN NIEZALEŻNY */}
          {currentSlideIndex === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">A</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">Czynnik A: Strategia uczenia się</div>
                      <div className="text-xs text-slate-400 mt-0.5">A₁: Ponowne czytanie vs A₂: Testowanie się (fiszki / retrieval)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">B</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">Czynnik B: Długość snu</div>
                      <div className="text-xs text-slate-400 mt-0.5">B₁: Krótki sen (deprywacja) vs B₂: Długi sen (pełna noc)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">Y</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">Zmienna zależna (Wynik)</div>
                      <div className="text-xs text-slate-400 mt-0.5">Liczba poprawnie przypomnianych słów (skala ilościowa)</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 leading-relaxed">
                  <strong className="text-indigo-200">Plan niezależny (międzygrupowy):</strong> Każdy z 20 uczestników brał udział wyłącznie w jednej z 4 kombinacji warunków (<span className="font-mono">n = 5</span> osób w grupie).
                </div>
              </div>

              {/* 2x2 Grid Visualization */}
              <div className="lg:col-span-7">
                <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
                  <span>Średnie liczby zapamiętanych słów (M)</span>
                  <span className="text-indigo-400 font-mono">N = 20 (4 grupy po 5 osób)</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Cell 1: Czytanie, krótki */}
                  <div className="group relative bg-gradient-to-br from-blue-900/60 to-blue-950/80 border-2 border-blue-600/60 rounded-2xl p-6 text-center shadow-lg transition-transform hover:scale-[1.02]">
                    <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold block mb-1">
                      Czytanie, krótki sen
                    </span>
                    <div className="text-5xl font-black text-white font-mono my-2">8</div>
                    <span className="text-xs text-blue-200/80">słów średnio</span>
                    <div className="mt-3 text-[11px] text-blue-300/70 border-t border-blue-800/50 pt-2 font-mono">
                      n = 5 · min = 6, max = 10
                    </div>
                  </div>

                  {/* Cell 2: Czytanie, długi */}
                  <div className="group relative bg-gradient-to-br from-blue-800/60 to-blue-900/80 border-2 border-blue-500/60 rounded-2xl p-6 text-center shadow-lg transition-transform hover:scale-[1.02]">
                    <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold block mb-1">
                      Czytanie, długi sen
                    </span>
                    <div className="text-5xl font-black text-white font-mono my-2">14</div>
                    <span className="text-xs text-blue-200/80">słów średnio</span>
                    <div className="mt-3 text-[11px] text-blue-300/70 border-t border-blue-800/50 pt-2 font-mono">
                      n = 5 · min = 12, max = 16
                    </div>
                  </div>

                  {/* Cell 3: Testowanie, krótki */}
                  <div className="group relative bg-gradient-to-br from-indigo-800/60 to-indigo-950/80 border-2 border-indigo-500/60 rounded-2xl p-6 text-center shadow-lg transition-transform hover:scale-[1.02]">
                    <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold block mb-1">
                      Testowanie, krótki sen
                    </span>
                    <div className="text-5xl font-black text-white font-mono my-2">13</div>
                    <span className="text-xs text-indigo-200/80">słów średnio</span>
                    <div className="mt-3 text-[11px] text-indigo-300/70 border-t border-indigo-800/50 pt-2 font-mono">
                      n = 5 · min = 11, max = 15
                    </div>
                  </div>

                  {/* Cell 4: Testowanie, długi */}
                  <div className="group relative bg-gradient-to-br from-indigo-800/60 to-indigo-950/80 border-2 border-indigo-500/60 rounded-2xl p-6 text-center shadow-lg transition-transform hover:scale-[1.02]">
                    <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold block mb-1">
                      Testowanie, długi sen
                    </span>
                    <div className="text-5xl font-black text-white font-mono my-2">13</div>
                    <span className="text-xs text-indigo-200/80">słów średnio</span>
                    <div className="mt-3 text-[11px] text-indigo-300/70 border-t border-indigo-800/50 pt-2 font-mono">
                      n = 5 · min = 11, max = 15
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
                  <span>💡 <strong>Zagadka dla studentów:</strong> Czy długi sen zawsze pomaga tak samo?</span>
                  <span className="text-amber-400 font-medium">Czytanie zyskuje +6, Testowanie +0!</span>
                </div>
              </div>
            </div>
          )}

          {/* SLAJD 2: DANE SUROWE I ŚREDNIE */}
          {currentSlideIndex === 1 && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4 bg-slate-950/40 rounded-tl-xl">Strategia (Czynnik A)</th>
                      <th className="py-3 px-4 bg-slate-950/40 text-center">B₁: Krótki sen</th>
                      <th className="py-3 px-4 bg-slate-950/40 text-center">B₂: Długi sen</th>
                      <th className="py-3 px-4 bg-indigo-950/50 text-indigo-300 text-center font-bold rounded-tr-xl">
                        Średnia brzegowa A
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {/* Row A1: Ponowne czytanie */}
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-200 bg-slate-900/60">
                        <span className="text-blue-400 block font-mono text-xs">A₁</span>
                        Ponowne czytanie
                      </td>
                      <td className="py-4 px-4 text-center bg-slate-900/30">
                        <div className="font-mono text-xs text-slate-400 tracking-wide mb-1">
                          6, 8, 7, 9, 10
                        </div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-900/40 border border-blue-700/50">
                          <span className="font-bold text-white font-mono text-base">M = 8</span>
                          <span className="text-xs text-slate-400 font-mono">SS = 10</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center bg-slate-900/30">
                        <div className="font-mono text-xs text-slate-400 tracking-wide mb-1">
                          12, 14, 13, 15, 16
                        </div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-900/40 border border-blue-700/50">
                          <span className="font-bold text-white font-mono text-base">M = 14</span>
                          <span className="text-xs text-slate-400 font-mono">SS = 10</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center bg-indigo-950/40 font-mono font-bold text-2xl text-indigo-300">
                        11
                        <span className="block text-[11px] font-normal text-slate-400 font-sans mt-0.5">
                          (8 + 14) / 2
                        </span>
                      </td>
                    </tr>

                    {/* Row A2: Testowanie się */}
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-200 bg-slate-900/60">
                        <span className="text-pink-400 block font-mono text-xs">A₂</span>
                        Testowanie się
                      </td>
                      <td className="py-4 px-4 text-center bg-slate-900/30">
                        <div className="font-mono text-xs text-slate-400 tracking-wide mb-1">
                          11, 13, 12, 14, 15
                        </div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-pink-900/40 border border-pink-700/50">
                          <span className="font-bold text-white font-mono text-base">M = 13</span>
                          <span className="text-xs text-slate-400 font-mono">SS = 10</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center bg-slate-900/30">
                        <div className="font-mono text-xs text-slate-400 tracking-wide mb-1">
                          11, 14, 12, 15, 13
                        </div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-pink-900/40 border border-pink-700/50">
                          <span className="font-bold text-white font-mono text-base">M = 13</span>
                          <span className="text-xs text-slate-400 font-mono">SS = 10</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center bg-indigo-950/40 font-mono font-bold text-2xl text-indigo-300">
                        13
                        <span className="block text-[11px] font-normal text-slate-400 font-sans mt-0.5">
                          (13 + 13) / 2
                        </span>
                      </td>
                    </tr>

                    {/* Bottom Row: Marginal Means B */}
                    <tr className="bg-emerald-950/30 font-semibold border-t-2 border-slate-700">
                      <td className="py-3 px-4 text-emerald-300 font-semibold">
                        Średnia brzegowa B
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-xl text-emerald-300">
                        10,5
                        <span className="block text-[11px] font-normal text-slate-400 font-sans mt-0.5">
                          (8 + 13) / 2
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-xl text-emerald-300">
                        13,5
                        <span className="block text-[11px] font-normal text-slate-400 font-sans mt-0.5">
                          (14 + 13) / 2
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center bg-amber-950/40 text-amber-300 font-mono font-black text-2xl">
                        M = 12
                        <span className="block text-[11px] font-normal text-amber-200/80 font-sans mt-0.5">
                          Średnia ogólna
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="font-semibold text-indigo-300 block mb-1">Średnie komórek (Cell Means)</span>
                  <p className="text-slate-400">
                    Konkretne kombinacje (8, 14, 13, 13). Tylko one pokazują pełną strukturę wyników i ewentualną interakcję.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="font-semibold text-emerald-300 block mb-1">Średnie brzegowe (Marginal)</span>
                  <p className="text-slate-400">
                    Uśredniają drugi czynnik: Czytanie (11) vs Testowanie (13), Krótki sen (10,5) vs Długi sen (13,5).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
                  <span className="font-semibold text-amber-300 block mb-1">Jednorodność wariancji (SS=10)</span>
                  <p className="text-slate-400">
                    W każdej z 4 komórek SS = 10, więc wariancja wewnątrzgrupowa wynosi dokładnie 2,5. Założenie homogeniczności spełnione idealnie.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLAJD 3: ROZKŁAD ZMIENNOŚCI */}
          {currentSlideIndex === 2 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Całkowita suma kwadratów (Total Variance)
                  </div>
                  <div className="text-3xl font-black font-mono text-white mt-1">
                    SS<sub className="text-sm font-normal text-slate-400">całkowite</sub> = Σ(X − M)² = 150
                  </div>
                </div>
                <div className="text-xs text-slate-300 max-w-sm">
                  Każdy punkt oddalony od średniej ogólnej (12) tworzy zmienność. ANOVA dzieli te 150 punktów na 4 niezależne źródła.
                </div>
              </div>

              {/* Visual Proportion Bar (100% distribution) */}
              <div className="space-y-2">
                <div className="flex h-14 w-full rounded-xl overflow-hidden shadow-lg border border-slate-700">
                  <div 
                    style={{ width: '13.33%' }} 
                    className="bg-blue-600 hover:bg-blue-500 transition-all flex flex-col items-center justify-center text-white px-2 cursor-pointer group"
                    title="Czynnik A (Strategia): SS = 20 (13,3%)"
                  >
                    <span className="font-bold text-xs">A</span>
                    <span className="text-[11px] font-mono opacity-90">13,3%</span>
                  </div>
                  <div 
                    style={{ width: '30.00%' }} 
                    className="bg-emerald-600 hover:bg-emerald-500 transition-all flex flex-col items-center justify-center text-white px-2 cursor-pointer group"
                    title="Czynnik B (Sen): SS = 45 (30,0%)"
                  >
                    <span className="font-bold text-xs">B</span>
                    <span className="text-[11px] font-mono opacity-90">30,0%</span>
                  </div>
                  <div 
                    style={{ width: '30.00%' }} 
                    className="bg-amber-600 hover:bg-amber-500 transition-all flex flex-col items-center justify-center text-white px-2 cursor-pointer group"
                    title="Interakcja A × B: SS = 45 (30,0%)"
                  >
                    <span className="font-bold text-xs">A × B</span>
                    <span className="text-[11px] font-mono opacity-90">30,0%</span>
                  </div>
                  <div 
                    style={{ width: '26.67%' }} 
                    className="bg-slate-600 hover:bg-slate-500 transition-all flex flex-col items-center justify-center text-white px-2 cursor-pointer group"
                    title="Błąd wewnątrzgrupowy: SS = 40 (26,7%)"
                  >
                    <span className="font-bold text-xs">Błąd</span>
                    <span className="text-[11px] font-mono opacity-90">26,7%</span>
                  </div>
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
                  <span>0%</span>
                  <span>13,3%</span>
                  <span>43,3%</span>
                  <span>73,3%</span>
                  <span>100% (SS = 150)</span>
                </div>
              </div>

              {/* 4 Cards matching PDF layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-semibold text-blue-300">A: Strategia</span>
                    </div>
                    <div className="text-3xl font-black font-mono text-white my-2">13,3%</div>
                  </div>
                  <div className="font-mono text-xs text-blue-300/80 pt-2 border-t border-blue-900/60">
                    SS = 20
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-semibold text-emerald-300">B: Sen</span>
                    </div>
                    <div className="text-3xl font-black font-mono text-white my-2">30%</div>
                  </div>
                  <div className="font-mono text-xs text-emerald-300/80 pt-2 border-t border-emerald-900/60">
                    SS = 45
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-semibold text-amber-300">A × B</span>
                    </div>
                    <div className="text-3xl font-black font-mono text-white my-2">30%</div>
                  </div>
                  <div className="font-mono text-xs text-amber-300/80 pt-2 border-t border-amber-900/60">
                    SS = 45
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                      <span className="text-xs font-semibold text-slate-300">Błąd (szum)</span>
                    </div>
                    <div className="text-3xl font-black font-mono text-white my-2">26,7%</div>
                  </div>
                  <div className="font-mono text-xs text-slate-400 pt-2 border-t border-slate-700/60">
                    SS = 40
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-900/50 text-xs text-indigo-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>
                  <strong>Zauważ:</strong> Aż <strong>73,3% zmienności</strong> zostało wyjaśnione przez nasz eksperyment (efekty manipulacji), a tylko 26,7% to błąd niewyjaśniony.
                </span>
              </div>
            </div>
          )}

          {/* SLAJD 4: OBLICZENIA SUM KWADRATÓW */}
          {currentSlideIndex === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Wzór SSA */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                      <span className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center font-bold">A</span>
                      <span>Suma kwadratów dla czynnika A (Strategia):</span>
                    </div>
                    <div className="font-mono text-sm sm:text-base text-slate-200">
                      SS<sub className="text-xs">A</sub> = n · b · Σ(M<sub className="text-xs">Ai</sub> − M)²
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      = 5 · 2 · [(11 − 12)² + (13 − 12)²] = 10 · [1 + 1] = 10 · 2
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black font-mono text-blue-400 bg-blue-950/60 border border-blue-800/80 px-4 py-2 rounded-xl inline-block">
                      20
                    </span>
                  </div>
                </div>

                {/* Wzór SSB */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center font-bold">B</span>
                      <span>Suma kwadratów dla czynnika B (Sen):</span>
                    </div>
                    <div className="font-mono text-sm sm:text-base text-slate-200">
                      SS<sub className="text-xs">B</sub> = n · a · Σ(M<sub className="text-xs">Bj</sub> − M)²
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      = 5 · 2 · [(10,5 − 12)² + (13,5 − 12)²] = 10 · [2,25 + 2,25] = 10 · 4,5
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-4 py-2 rounded-xl inline-block">
                      45
                    </span>
                  </div>
                </div>

                {/* Wzór SSAxB */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                      <span className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center font-bold">A×B</span>
                      <span>Suma kwadratów dla interakcji A × B:</span>
                    </div>
                    <div className="font-mono text-sm sm:text-base text-slate-200">
                      SS<sub className="text-xs">A×B</sub> = SS<sub className="text-xs">komórek</sub> − SS<sub className="text-xs">A</sub> − SS<sub className="text-xs">B</sub>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      = 5 · [(8−12)² + (14−12)² + (13−12)² + (13−12)²] − 20 − 45 = 5 · (16 + 4 + 1 + 1) − 65 = 110 − 65
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-4 py-2 rounded-xl inline-block">
                      45
                    </span>
                  </div>
                </div>

                {/* Wzór SS Błąd */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <span className="w-5 h-5 rounded-md bg-slate-700 flex items-center justify-center font-bold">Błąd</span>
                      <span>Suma kwadratów błędu (wewnątrz grup):</span>
                    </div>
                    <div className="font-mono text-sm sm:text-base text-slate-200">
                      SS<sub className="text-xs">błąd</sub> = suma SS w czterech grupach
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      = 10 + 10 + 10 + 10 = 4 · 10
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-3xl font-black font-mono text-slate-300 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl inline-block">
                      40
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLAJD 5: TABELA WYNIKÓW ANOVA */}
          {currentSlideIndex === 4 && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 shadow">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 border-b border-slate-700 font-semibold text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Źródło zmienności</th>
                      <th className="py-3 px-4 text-right">SS</th>
                      <th className="py-3 px-4 text-right">df</th>
                      <th className="py-3 px-4 text-right">MS</th>
                      <th className="py-3 px-4 text-right">F</th>
                      <th className="py-3 px-4 text-right">p</th>
                      <th className="py-3 px-4 text-right">η²p</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-sm">
                    {/* A */}
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">
                        A: Strategia uczenia się
                      </td>
                      <td className="py-3.5 px-4 text-right text-blue-400 font-bold">20,00</td>
                      <td className="py-3.5 px-4 text-right text-slate-400">1</td>
                      <td className="py-3.5 px-4 text-right text-slate-200">20,00</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">8,00</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400">0,012</td>
                      <td className="py-3.5 px-4 text-right text-indigo-300">0,33</td>
                    </tr>

                    {/* B */}
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">
                        B: Długość snu
                      </td>
                      <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">45,00</td>
                      <td className="py-3.5 px-4 text-right text-slate-400">1</td>
                      <td className="py-3.5 px-4 text-right text-slate-200">45,00</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">18,00</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400">&lt; 0,001</td>
                      <td className="py-3.5 px-4 text-right text-indigo-300">0,53</td>
                    </tr>

                    {/* AxB */}
                    <tr className="hover:bg-amber-950/20 bg-amber-950/10">
                      <td className="py-3.5 px-4 font-sans font-bold text-amber-300 flex items-center gap-1.5">
                        <span>A × B (Interakcja)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Kluczowa!
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-amber-400 font-bold">45,00</td>
                      <td className="py-3.5 px-4 text-right text-slate-400">1</td>
                      <td className="py-3.5 px-4 text-right text-slate-200">45,00</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">18,00</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400">&lt; 0,001</td>
                      <td className="py-3.5 px-4 text-right text-indigo-300">0,53</td>
                    </tr>

                    {/* Error */}
                    <tr className="hover:bg-slate-800/40 text-slate-400">
                      <td className="py-3 px-4 font-sans">Błąd (wewnątrzgrupowy)</td>
                      <td className="py-3 px-4 text-right">40,00</td>
                      <td className="py-3 px-4 text-right">16</td>
                      <td className="py-3 px-4 text-right">2,50</td>
                      <td className="py-3 px-4 text-right">—</td>
                      <td className="py-3 px-4 text-right">—</td>
                      <td className="py-3 px-4 text-right">—</td>
                    </tr>

                    {/* Total */}
                    <tr className="bg-slate-950 font-bold border-t border-slate-700 text-slate-200">
                      <td className="py-3.5 px-4 font-sans">Ogółem (Total)</td>
                      <td className="py-3.5 px-4 text-right text-white">150,00</td>
                      <td className="py-3.5 px-4 text-right">19</td>
                      <td className="py-3.5 px-4 text-right">—</td>
                      <td className="py-3.5 px-4 text-right">—</td>
                      <td className="py-3.5 px-4 text-right">—</td>
                      <td className="py-3.5 px-4 text-right">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Formula & Rule Footnote */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/70 text-xs text-slate-300 space-y-1 font-mono">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span><strong>MS</strong> = SS / df</span>
                  <span><strong>F</strong> = MS efektu / MS błędu</span>
                  <span><strong>η²p</strong> = SS efektu / (SS efektu + SS błędu)</span>
                </div>
                <div className="text-slate-400 font-sans pt-1">
                  Wartość krytyczna <span className="font-mono text-slate-200">F(1; 16) dla α = 0,05</span> wynosi <strong>4,49</strong>; stopnie swobody błędu: <span className="font-mono text-slate-200">df błędu = N − a·b = 20 − 4 = 16</span>.
                </div>
              </div>
            </div>
          )}

          {/* SLAJD 6: WYKRES INTERAKCJI */}
          {currentSlideIndex === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span className="font-medium">Średnia liczba zapamiętanych słów</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <span className="w-3 h-0.5 bg-blue-500 rounded"></span>
                      Ponowne czytanie (8 → 14)
                    </span>
                    <span className="flex items-center gap-1.5 text-pink-400">
                      <span className="w-3 h-0.5 bg-pink-500 rounded"></span>
                      Testowanie się (13 → 13)
                    </span>
                  </div>
                </div>

                {/* SVG Interaction Chart */}
                <div className="w-full h-72">
                  <svg viewBox="0 0 500 280" className="w-full h-full">
                    {/* Grid Lines */}
                    {[6, 8, 10, 12, 14, 16].map((val) => {
                      const y = 250 - ((val - 6) / 10) * 210;
                      return (
                        <g key={val}>
                          <line x1="60" y1={y} x2="460" y2={y} stroke="#334155" strokeDasharray="3 3" />
                          <text x="45" y={y + 4} fill="#94a3b8" fontSize="11" textAnchor="end" fontFamily="monospace">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* X Axis labels */}
                    <text x="140" y="270" fill="#cbd5e1" fontSize="13" fontWeight="600" textAnchor="middle">
                      Krótki sen (B₁)
                    </text>
                    <text x="380" y="270" fill="#cbd5e1" fontSize="13" fontWeight="600" textAnchor="middle">
                      Długi sen (B₂)
                    </text>

                    {/* Coordinates:
                        X1 = 140, X2 = 380
                        Scale: Y(val) = 250 - ((val - 6)/10) * 210
                        8  -> 250 - (2/10)*210 = 250 - 42 = 208
                        14 -> 250 - (8/10)*210 = 250 - 168 = 82
                        13 -> 250 - (7/10)*210 = 250 - 147 = 103
                    */}

                    {/* Blue line: Ponowne czytanie (8 -> 14) */}
                    <line
                      x1="140"
                      y1="208"
                      x2="380"
                      y2="82"
                      stroke="#3B82F6"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Blue dots */}
                    <circle cx="140" cy="208" r="7" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
                    <text x="140" y="230" fill="#60A5FA" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      M = 8
                    </text>

                    <circle cx="380" cy="82" r="7" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
                    <text x="380" y="68" fill="#60A5FA" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      M = 14
                    </text>

                    {/* Pink line: Testowanie się (13 -> 13) */}
                    <line
                      x1="140"
                      y1="103"
                      x2="380"
                      y2="103"
                      stroke="#EC4899"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Pink dots */}
                    <circle cx="140" cy="103" r="7" fill="#EC4899" stroke="#831843" strokeWidth="2" />
                    <text x="140" y="88" fill="#F472B6" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      M = 13
                    </text>

                    <circle cx="380" cy="103" r="7" fill="#EC4899" stroke="#831843" strokeWidth="2" />
                    <text x="380" y="125" fill="#F472B6" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      M = 13
                    </text>
                  </svg>
                </div>
              </div>

              {/* Insight Callout */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-800/60 shadow-lg">
                  <div className="text-amber-400 font-bold text-lg mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Linie nie są równoległe!
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Ponowne czytanie działa znacznie lepiej po długim śnie (wzrost z 8 aż do 14 słów), podczas gdy testowanie się daje niezmiennie 13 słów niezależnie od ilości snu.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-amber-300">
                    To klasyczny, podręcznikowy sygnał interakcji.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-slate-200">Dlaczego efekt główny snu jest mylący?</div>
                  <p className="text-slate-400">
                    Średnia brzegowa mówi: "Sen poprawia wynik o 3 słowa (10,5 → 13,5)". Ale dla grupy testującej się poprawa wynosi <strong>okrągłe 0 słów</strong>!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLAJD 7: INTERPRETACJA I EFEKTY PROSTE */}
          {currentSlideIndex === 6 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-sm text-indigo-200">
                <strong>Złota zasada wnioskowania:</strong> Interakcja jest statystycznie istotna (<span className="font-mono">p &lt; 0,001</span>), więc nie poprzestajemy na efektach głównych. Sprawdzamy <strong>efekty proste</strong>: wpływ strategii osobno przy każdej długości snu!
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Condition 1: Krótki sen */}
                <div className="p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Warunek 1</span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                      Istotny efekt!
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Krótki sen (deprywacja)</h3>
                    <div className="text-3xl font-black font-mono text-emerald-400 mt-2">
                      13 vs 8
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Testowanie się vs Ponowne czytanie</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800 font-mono text-sm text-slate-200 border border-slate-700">
                    F(1; 16) = 25,00; <span className="text-emerald-400 font-bold">p &lt; 0,001</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Przy deficycie snu technika uczenia się ma kolosalne znaczenie: testowanie daje aż o 5 zapamiętanych słów więcej.
                  </p>
                </div>

                {/* Condition 2: Długi sen */}
                <div className="p-6 rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Warunek 2</span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs font-semibold">
                      Brak różnicy
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Długi sen (pełna noc)</h3>
                    <div className="text-3xl font-black font-mono text-slate-300 mt-2">
                      13 vs 14
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Testowanie się vs Ponowne czytanie</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800 font-mono text-sm text-slate-200 border border-slate-700">
                    F(1; 16) = 1,00; <span className="text-slate-400">p = 0,33 (nieistotne)</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Po dobrze przespanej nocy obie techniki dają niemal identyczny, wysoki rezultat — brak istotnej statystycznie różnicy.
                  </p>
                </div>
              </div>

              {/* Main Psychological Takeaway */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-orange-600/30 border border-amber-500/50 text-amber-200 shadow-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Wniosek psychologiczny (Testing Effect / Roediger &amp; Karpicke):
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-200">
                      <strong>Testowanie się chroni pamięć przed negatywnymi skutkami krótkiego snu</strong> (działa jak bufor poznawczy), natomiast <strong>ponowne czytanie działa dobrze dopiero po długim śnie</strong>, kiedy zachodzi pełna konsolidacja śladu pamięciowego.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slide Footer with Controls */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>Użyj strzałek <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">→</kbd> do nawigacji</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">N</kbd> notatki</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSandboxWithPreset && (
              <button
                onClick={() => onOpenSandboxWithPreset('original')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/40 font-medium transition-colors"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Otwórz w symulatorze</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Teacher / Pedagogy Notes Collapsible Drawer */}
      {showTeacherNotes && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Lightbulb className="w-4 h-4" />
              <span>Wskazówki metodyczne dla wykładowcy — Slajd {currentSlideIndex + 1}</span>
            </div>
            <button
              onClick={() => setShowTeacherNotes(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Zamknij
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-1.5">
                  Cel dydaktyczny tego slajdu:
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  {currentSlide.teacherNotes.goal}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-amber-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Kluczowe punkty do omówienia ze studentami:
                </h4>
                <ul className="space-y-2">
                  {currentSlide.teacherNotes.talkingPoints.map((tp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                      <span>{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-rose-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Typowe pułapki myślowe studentów:
                </h4>
                <ul className="space-y-2">
                  {currentSlide.teacherNotes.commonStudentMistakes.map((csm, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-rose-200/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5"></span>
                      <span>{csm}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50">
                <h4 className="font-semibold text-indigo-300 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Pytanie aktywizujące grupę (do rzucenia na sali):
                </h4>
                <p className="text-white italic leading-relaxed">
                  "{currentSlide.teacherNotes.discussionQuestion}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
