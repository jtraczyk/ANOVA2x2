import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  ArrowLeftRight, 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  Layers, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { SCENARIO_PRESETS, ORIGINAL_STUDY_DATA } from '../data/originalStudy';
import { compute2x2ANOVA, formatNum, formatPValue } from '../utils/statistics';

interface InteractiveSandboxProps {
  initialPresetId?: string;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({ initialPresetId = 'original' }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>(initialPresetId);
  const [xAxisFactor, setXAxisFactor] = useState<'sleep' | 'strategy'>('sleep');
  const [withinGroupSS, setWithinGroupSS] = useState<number>(10); // Default SS = 10 per group

  // The 4 cell means
  const [m11, setM11] = useState<number>(8);  // Czytanie, Krótki
  const [m12, setM12] = useState<number>(14); // Czytanie, Długi
  const [m21, setM21] = useState<number>(13); // Testowanie, Krótki
  const [m22, setM22] = useState<number>(13); // Testowanie, Długi

  // Apply a preset
  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = SCENARIO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const calcMean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    setM11(calcMean(preset.cells.A1B1));
    setM12(calcMean(preset.cells.A1B2));
    setM21(calcMean(preset.cells.A2B1));
    setM22(calcMean(preset.cells.A2B2));
    setWithinGroupSS(10);
  };

  // Generate synthetic 5-point distributions around each mean with exact desired SS
  const rawCells = useMemo(() => {
    // A standard offset vector [-2, 0, -1, 1, 2] has sum = 0 and sum of squares = 4+0+1+1+4 = 10.
    // Scale it to match `withinGroupSS`
    const scale = Math.sqrt(withinGroupSS / 10);
    const offsets = [-2 * scale, 0, -1 * scale, 1 * scale, 2 * scale];

    return {
      A1B1: offsets.map((o) => m11 + o),
      A1B2: offsets.map((o) => m12 + o),
      A2B1: offsets.map((o) => m21 + o),
      A2B2: offsets.map((o) => m22 + o),
    };
  }, [m11, m12, m21, m22, withinGroupSS]);

  const anova = useMemo(() => {
    return compute2x2ANOVA(rawCells);
  }, [rawCells]);

  // Diagnosis string
  const diagnosis = useMemo(() => {
    const pA = anova.table[0].p ?? 1;
    const pB = anova.table[1].p ?? 1;
    const pAxB = anova.table[2].p ?? 1;

    const sigA = pA < 0.05;
    const sigB = pB < 0.05;
    const sigAxB = pAxB < 0.05;

    if (sigAxB) {
      if (!sigA && !sigB) {
        return {
          title: 'Czysta interakcja krzyżowa (Crossover)',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          desc: 'Efekty główne są zerowe lub nieistotne, ponieważ linie przecinają się i średnie brzegowe się znoszą! Same efekty główne dałyby fałszywy wniosek "brak wpływu czynników".',
        };
      }
      return {
        title: 'Istotna interakcja (A × B)',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        desc: 'Linie nie są równoległe. Wpływ jednego czynnika zmienia się w zależności od drugiego. Koniecznie analizujemy EFEKTY PROSTE.',
      };
    } else {
      if (sigA && sigB) {
        return {
          title: 'Dwa czyste efekty główne (Model addytywny)',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          desc: 'Linie są równoległe. Oba czynniki działają niezależnie i dodają swój wpływ bez żadnych wzajemnych modyfikacji.',
        };
      } else if (sigA) {
        return {
          title: 'Tylko efekt strategii uczenia się',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          desc: 'Linie są poziome i rozsunięte w pionie. Długość snu nie wpływa na wyniki, liczy się wyłącznie technika nauki.',
        };
      } else if (sigB) {
        return {
          title: 'Tylko efekt długości snu',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          desc: 'Linie pokrywają się i są nachylone. Długi sen poprawia pamięć tak samo u wszystkich, rodzaj techniki nie ma znaczenia.',
        };
      } else {
        return {
          title: 'Brak efektów (Hipoteza zerowa H₀)',
          badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
          desc: 'Wszystkie różnice to czysty błąd losowy. Żaden czynnik ani interakcja nie osiąga progu istotności α = 0,05.',
        };
      }
    }
  }, [anova]);

  // SVG Chart boundaries
  const allMeans = [m11, m12, m21, m22];
  const minVal = Math.floor(Math.min(...allMeans) - 2);
  const maxVal = Math.ceil(Math.max(...allMeans) + 2);
  const yDomainMin = Math.min(minVal, 4);
  const yDomainMax = Math.max(maxVal, 16);

  const getYCoord = (val: number) => {
    const range = yDomainMax - yDomainMin;
    if (range <= 0) return 130;
    return 240 - ((val - yDomainMin) / range) * 200;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Scenario Presets Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-white">Presety dydaktyczne do demonstracji na zajęciach:</span>
          </div>
          <span className="text-xs text-slate-400">
            Wybierz gotowy wzorzec lub manipuluj suwakami poniżej
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                selectedPreset === preset.id
                  ? 'bg-indigo-950/70 border-indigo-500 shadow-sm ring-1 ring-indigo-500/50'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div>
                <div className={`text-xs font-bold mb-1 ${selectedPreset === preset.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                  {preset.name}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Preset Didactic takeaway */}
        {selectedPreset && (
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs text-slate-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Wskazówka dydaktyczna: </strong>
              <span>{SCENARIO_PRESETS.find((p) => p.id === selectedPreset)?.didacticPoint}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sliders Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Średnie w komórkach (M)</h3>
              </div>
              <button
                onClick={() => applyPreset('original')}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                title="Przywróć wartości oryginalne"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Cell 1: Czytanie, Krótki */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-blue-900/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    Czytanie + Krótki sen (A₁B₁)
                  </span>
                  <span className="font-mono font-bold text-sm text-white px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                    M = {m11.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="0.5"
                  value={m11}
                  onChange={(e) => {
                    setM11(parseFloat(e.target.value));
                    setSelectedPreset('');
                  }}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Cell 2: Czytanie, Długi */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-blue-900/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    Czytanie + Długi sen (A₁B₂)
                  </span>
                  <span className="font-mono font-bold text-sm text-white px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                    M = {m12.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="0.5"
                  value={m12}
                  onChange={(e) => {
                    setM12(parseFloat(e.target.value));
                    setSelectedPreset('');
                  }}
                  className="w-full accent-blue-400 cursor-pointer"
                />
              </div>

              {/* Cell 3: Testowanie, Krótki */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-pink-900/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-pink-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                    Testowanie + Krótki sen (A₂B₁)
                  </span>
                  <span className="font-mono font-bold text-sm text-white px-2 py-0.5 rounded bg-pink-950 border border-pink-800">
                    M = {m21.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="0.5"
                  value={m21}
                  onChange={(e) => {
                    setM21(parseFloat(e.target.value));
                    setSelectedPreset('');
                  }}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>

              {/* Cell 4: Testowanie, Długi */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-pink-900/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-pink-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
                    Testowanie + Długi sen (A₂B₂)
                  </span>
                  <span className="font-mono font-bold text-sm text-white px-2 py-0.5 rounded bg-pink-950 border border-pink-800">
                    M = {m22.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="0.5"
                  value={m22}
                  onChange={(e) => {
                    setM22(parseFloat(e.target.value));
                    setSelectedPreset('');
                  }}
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Error variance control */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span className="font-medium">Wariancja wewnątrzgrupowa (SS błędu w komórce):</span>
                <span className="font-mono text-slate-400">SS = {withinGroupSS}</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="2"
                value={withinGroupSS}
                onChange={(e) => setWithinGroupSS(parseInt(e.target.value))}
                className="w-full accent-slate-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Mały błąd (ostry test)</span>
                <span>SS = 10 (oryginał)</span>
                <span>Duży szum losowy</span>
              </div>
            </div>
          </div>

          {/* Diagnosis Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Automatyczna diagnoza statystyczna:
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${diagnosis.badgeColor}`}>
                {diagnosis.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {diagnosis.desc}
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic SVG Chart + ANOVA Table */}
        <div className="lg:col-span-7 space-y-6">
          {/* Chart Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Dynamiczny wykres interakcji</h3>
              </div>

              {/* Axis Switcher */}
              <button
                onClick={() => setXAxisFactor(xAxisFactor === 'sleep' ? 'strategy' : 'sleep')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                title="Zamień zmienne na osi X i w legendzie"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  Oś X: <strong>{xAxisFactor === 'sleep' ? 'Długość snu' : 'Strategia uczenia'}</strong> (kliknij, by zamienić)
                </span>
              </button>
            </div>

            {/* Interactive SVG Canvas */}
            <div className="w-full h-72 bg-slate-950 rounded-xl p-4 border border-slate-800 relative">
              <svg viewBox="0 0 500 270" className="w-full h-full">
                {/* Horizontal grid lines */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const val = yDomainMin + (i * (yDomainMax - yDomainMin)) / 5;
                  const y = getYCoord(val);
                  return (
                    <g key={i}>
                      <line x1="60" y1={y} x2="460" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                      <text x="45" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                        {val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Perspective 1: Sleep on X axis */}
                {xAxisFactor === 'sleep' ? (
                  <>
                    {/* X labels */}
                    <text x="140" y="260" fill="#cbd5e1" fontSize="12" fontWeight="600" textAnchor="middle">
                      Krótki sen
                    </text>
                    <text x="380" y="260" fill="#cbd5e1" fontSize="12" fontWeight="600" textAnchor="middle">
                      Długi sen
                    </text>

                    {/* Blue line: Czytanie (m11 -> m12) */}
                    <line
                      x1="140"
                      y1={getYCoord(m11)}
                      x2="380"
                      y2={getYCoord(m12)}
                      stroke="#3B82F6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="140" cy={getYCoord(m11)} r="6" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
                    <text x="140" y={getYCoord(m11) - 12} fill="#93C5FD" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {m11.toFixed(1)}
                    </text>

                    <circle cx="380" cy={getYCoord(m12)} r="6" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
                    <text x="380" y={getYCoord(m12) - 12} fill="#93C5FD" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {m12.toFixed(1)}
                    </text>

                    {/* Pink line: Testowanie (m21 -> m22) */}
                    <line
                      x1="140"
                      y1={getYCoord(m21)}
                      x2="380"
                      y2={getYCoord(m22)}
                      stroke="#EC4899"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="140" cy={getYCoord(m21)} r="6" fill="#EC4899" stroke="#831843" strokeWidth="2" />
                    <text x="140" y={getYCoord(m21) + 20} fill="#F472B6" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {m21.toFixed(1)}
                    </text>

                    <circle cx="380" cy={getYCoord(m22)} r="6" fill="#EC4899" stroke="#831843" strokeWidth="2" />
                    <text x="380" y={getYCoord(m22) + 20} fill="#F472B6" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {m22.toFixed(1)}
                    </text>
                  </>
                ) : (
                  <>
                    {/* Perspective 2: Strategy on X axis */}
                    <text x="140" y="260" fill="#cbd5e1" fontSize="12" fontWeight="600" textAnchor="middle">
                      Ponowne czytanie
                    </text>
                    <text x="380" y="260" fill="#cbd5e1" fontSize="12" fontWeight="600" textAnchor="middle">
                      Testowanie się
                    </text>

                    {/* Green line: Krótki sen (m11 -> m21) */}
                    <line
                      x1="140"
                      y1={getYCoord(m11)}
                      x2="380"
                      y2={getYCoord(m21)}
                      stroke="#10B981"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="140" cy={getYCoord(m11)} r="6" fill="#10B981" stroke="#064E3B" strokeWidth="2" />
                    <text x="140" y={getYCoord(m11) - 12} fill="#6EE7B7" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {m11.toFixed(1)}
                    </text>

                    <circle cx="380" cy={getYCoord(m21)} r="6" fill="#10B981" stroke="#064E3B" strokeWidth="2" />
                    <text x="380" y={getYCoord(m21) - 12} fill="#6EE7B7" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {m21.toFixed(1)}
                    </text>

                    {/* Violet line: Długi sen (m12 -> m22) */}
                    <line
                      x1="140"
                      y1={getYCoord(m12)}
                      x2="380"
                      y2={getYCoord(m22)}
                      stroke="#8B5CF6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="140" cy={getYCoord(m12)} r="6" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2" />
                    <text x="140" y={getYCoord(m12) + 20} fill="#C4B5FD" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {m12.toFixed(1)}
                    </text>

                    <circle cx="380" cy={getYCoord(m22)} r="6" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2" />
                    <text x="380" y={getYCoord(m22) + 20} fill="#C4B5FD" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {m22.toFixed(1)}
                    </text>
                  </>
                )}
              </svg>

              {/* Legend overlay */}
              <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700/80 rounded-lg p-2.5 text-xs space-y-1 shadow">
                {xAxisFactor === 'sleep' ? (
                  <>
                    <div className="flex items-center gap-2 text-blue-400 font-medium">
                      <span className="w-3 h-1 bg-blue-500 rounded"></span>
                      <span>Ponowne czytanie</span>
                    </div>
                    <div className="flex items-center gap-2 text-pink-400 font-medium">
                      <span className="w-3 h-1 bg-pink-500 rounded"></span>
                      <span>Testowanie się</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      <span className="w-3 h-1 bg-emerald-500 rounded"></span>
                      <span>Krótki sen</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400 font-medium">
                      <span className="w-3 h-1 bg-purple-500 rounded"></span>
                      <span>Długi sen</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Live SS Decomposition Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Podział zmienności całkowitej (SS Total = {formatNum(anova.table[4].ss, 1)}):
                </span>
                <span className="font-mono text-slate-400">100%</span>
              </div>
              <div className="flex h-5 w-full rounded-lg overflow-hidden border border-slate-700 text-[10px] font-bold text-white">
                <div 
                  style={{ width: `${Math.max(1, anova.percentages.ssA)}%` }} 
                  className="bg-blue-600 flex items-center justify-center transition-all truncate px-1"
                  title={`SS A: ${formatNum(anova.percentages.ssA, 1)}%`}
                >
                  {anova.percentages.ssA > 8 && `A: ${Math.round(anova.percentages.ssA)}%`}
                </div>
                <div 
                  style={{ width: `${Math.max(1, anova.percentages.ssB)}%` }} 
                  className="bg-emerald-600 flex items-center justify-center transition-all truncate px-1"
                  title={`SS B: ${formatNum(anova.percentages.ssB, 1)}%`}
                >
                  {anova.percentages.ssB > 8 && `B: ${Math.round(anova.percentages.ssB)}%`}
                </div>
                <div 
                  style={{ width: `${Math.max(1, anova.percentages.ssAxB)}%` }} 
                  className="bg-amber-600 flex items-center justify-center transition-all truncate px-1"
                  title={`SS A×B: ${formatNum(anova.percentages.ssAxB, 1)}%`}
                >
                  {anova.percentages.ssAxB > 8 && `A×B: ${Math.round(anova.percentages.ssAxB)}%`}
                </div>
                <div 
                  style={{ width: `${Math.max(1, anova.percentages.ssError)}%` }} 
                  className="bg-slate-600 flex items-center justify-center transition-all truncate px-1"
                  title={`Błąd: ${formatNum(anova.percentages.ssError, 1)}%`}
                >
                  {anova.percentages.ssError > 8 && `Błąd: ${Math.round(anova.percentages.ssError)}%`}
                </div>
              </div>
            </div>
          </div>

          {/* Live ANOVA Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Tabela ANOVA przeliczana na żywo</span>
              <span className="text-xs font-normal text-slate-400">α = 0,05 · F_kryt = 4,49</span>
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Źródło</th>
                    <th className="py-2.5 px-3 text-right">SS</th>
                    <th className="py-2.5 px-3 text-right">df</th>
                    <th className="py-2.5 px-3 text-right">MS</th>
                    <th className="py-2.5 px-3 text-right">F</th>
                    <th className="py-2.5 px-3 text-right">p</th>
                    <th className="py-2.5 px-3 text-right">η²p</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-xs">
                  {anova.table.map((row) => (
                    <tr
                      key={row.sourceKey}
                      className={
                        row.significant
                          ? 'bg-indigo-950/20 text-slate-200'
                          : row.sourceKey === 'total'
                          ? 'bg-slate-950 font-bold text-white'
                          : 'text-slate-400'
                      }
                    >
                      <td className="py-2.5 px-3 font-sans font-medium flex items-center gap-1.5">
                        <span>{row.source}</span>
                        {row.significant && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Istotny statystycznie"></span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">{formatNum(row.ss)}</td>
                      <td className="py-2.5 px-3 text-right">{row.df}</td>
                      <td className="py-2.5 px-3 text-right">{row.ms !== undefined ? formatNum(row.ms) : '—'}</td>
                      <td className={`py-2.5 px-3 text-right font-bold ${row.significant ? 'text-emerald-400' : ''}`}>
                        {row.f !== undefined ? formatNum(row.f) : '—'}
                      </td>
                      <td className={`py-2.5 px-3 text-right ${row.significant ? 'text-emerald-400 font-bold' : ''}`}>
                        {row.p !== undefined ? formatPValue(row.p) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {row.etaSqP !== undefined ? formatNum(row.etaSqP) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Live Simple Effects Summary */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Efekty proste (Simple Main Effects dla obecnego stanu danych):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="font-semibold text-slate-200 mb-0.5">Strategia przy krótkim śnie:</div>
                  <div className="font-mono text-slate-300">
                    F(1, 16) = {formatNum(anova.simpleEffects.strategyAtShortSleep.f)}, p {formatPValue(anova.simpleEffects.strategyAtShortSleep.p)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {anova.simpleEffects.strategyAtShortSleep.interpretation}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="font-semibold text-slate-200 mb-0.5">Strategia przy długim śnie:</div>
                  <div className="font-mono text-slate-300">
                    F(1, 16) = {formatNum(anova.simpleEffects.strategyAtLongSleep.f)}, p {formatPValue(anova.simpleEffects.strategyAtLongSleep.p)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {anova.simpleEffects.strategyAtLongSleep.interpretation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
