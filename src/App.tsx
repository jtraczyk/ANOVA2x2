import React, { useState } from 'react';
import { Calculator, HelpCircle } from 'lucide-react';
import cridmLogo from './assets/cridm-logo.png';
import { AnimatedAnovaSteps } from './components/AnimatedAnovaSteps';
import { AnovaQuizLab } from './components/AnovaQuizLab';

type AppMode = 'walkthrough' | 'quiz';

export default function App() {
  const [activeMode, setActiveMode] = useState<AppMode>('walkthrough');

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#344b57] flex flex-col font-sans selection:bg-[#ef9421] selection:text-white">
      {/* Clean CRIDM Light Compact Top Bar with Mode Switcher */}
      <header className="no-print bg-white border-b border-[#dfe5e8] border-t-2 border-t-[#ef9421] px-4 py-2 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand with official CRIDM logo */}
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="https://www.cridm.edu.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center"
              title="CRIDM — Center for Research on Improving Decision Making"
            >
              <img
                src={cridmLogo}
                alt="CRIDM"
                className="h-7 sm:h-8 w-auto object-contain shrink-0"
              />
            </a>
            <span className="h-6 w-px bg-[#dfe5e8] shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#344b57] leading-tight truncate">
                ANOVA 2 × 2: Procedura obliczeniowa
              </h1>
              <p className="text-[11px] text-[#6d7b83] hidden md:block truncate">
                Analiza wariancji w planach czynnikowych · materiały dydaktyczne i quiz interpretacyjny
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <nav aria-label="Tryb aplikacji" className="inline-flex items-center p-0.5 bg-[#f4f6f7] border border-[#dfe5e8] rounded-lg gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveMode('walkthrough')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef9421] ${
                activeMode === 'walkthrough'
                  ? 'bg-[#344b57] text-white shadow-2xs'
                  : 'text-[#5a6c77] hover:text-[#344b57] hover:bg-white/70'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Procedura obliczeniowa</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('quiz')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef9421] ${
                activeMode === 'quiz'
                  ? 'bg-[#e28b1f] text-white shadow-2xs'
                  : 'text-[#5a6c77] hover:text-[#344b57] hover:bg-white/70'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quiz i interpretacja</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className={activeMode === 'walkthrough' ? 'block' : 'hidden'}>
          <AnimatedAnovaSteps />
        </div>
        <div className={activeMode === 'quiz' ? 'block' : 'hidden'}>
          <AnovaQuizLab />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#dfe5e8] px-4 py-2 text-[11px] text-[#6d7b83]">
        <div className="max-w-7xl mx-auto text-center">
          Autor: <strong className="font-semibold text-[#344b57]">Jakub Traczyk</strong>, Uniwersytet SWPS, Wydział Psychologii we Wrocławiu,{' '}
          <a
            href="https://www.cridm.edu.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#344b57] hover:text-[#e28b1f] font-medium transition-colors"
          >
            Centrum Badań nad Wspieraniem Podejmowania Decyzji (CRIDM)
          </a>
        </div>
      </footer>
    </div>
  );
}
