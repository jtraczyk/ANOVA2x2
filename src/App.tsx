import React from 'react';
import cridmLogo from './assets/cridm-logo.png';
import { AnimatedAnovaSteps } from './components/AnimatedAnovaSteps';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#344b57] flex flex-col font-sans selection:bg-[#ef9421] selection:text-white">
      {/* Clean CRIDM Light Compact Top Bar */}
      <header className="no-print bg-white border-b border-[#dfe5e8] border-t-2 border-t-[#ef9421] px-4 py-2 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand with official CRIDM logo */}
          <div className="flex items-center gap-3">
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
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#344b57] leading-tight">
                ANOVA 2 × 2: Procedura obliczeniowa
              </h1>
              <p className="text-[11px] text-[#6d7b83] hidden sm:block">
                Strategia uczenia się × Długość snu · <em>n</em> = 5 w grupie, <em>N</em> = 20
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <AnimatedAnovaSteps />
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
