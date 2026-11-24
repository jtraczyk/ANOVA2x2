import React, { useState } from 'react';
import { DescriptiveCell, GeneratedStudy } from '../types/quiz';
import { formatDecimal } from '../utils/factorialAnovaGenerator';

interface QuizInteractionPlotProps {
  study: GeneratedStudy;
}

const SERIES_COLORS = [
  { stroke: '#344b57', fill: '#344b57', labelText: '#344b57' },
  { stroke: '#ef9421', fill: '#ef9421', labelText: '#9a5508' },
  { stroke: '#2a7b6f', fill: '#2a7b6f', labelText: '#1f5e54' },
];

function computeNiceScale(minVal: number, maxVal: number): { min: number; max: number; ticks: number[] } {
  const span = Math.max(1e-3, maxVal - minVal);
  const paddedMin = minVal - span * 0.14;
  const paddedMax = maxVal + span * 0.14;
  const rawStep = (paddedMax - paddedMin) / 4;

  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  let niceNorm = 1;
  if (norm > 5) niceNorm = 10;
  else if (norm > 2.5) niceNorm = 5;
  else if (norm > 1.2) niceNorm = 2;
  const step = niceNorm * mag;

  const niceMin = Math.floor(paddedMin / step) * step;
  const niceMax = Math.ceil(paddedMax / step) * step;

  const ticks: number[] = [];
  for (let t = niceMin; t <= niceMax + step * 0.001; t += step) {
    ticks.push(Number(t.toFixed(4)));
  }

  return { min: niceMin, max: niceMax, ticks };
}

export const QuizInteractionPlot: React.FC<QuizInteractionPlotProps> = ({ study }) => {
  const [hoveredCell, setHoveredCell] = useState<DescriptiveCell | null>(null);

  const allLows = study.cells.map((c) => c.ciLow);
  const allHighs = study.cells.map((c) => c.ciHigh);
  const minVal = Math.min(...allLows);
  const maxVal = Math.max(...allHighs);
  const { min: yMin, max: yMax, ticks } = computeNiceScale(minVal, maxVal);

  const cLevels = study.factors.C ? study.factors.C.levels : [undefined];
  const bLevels = study.factors.B.levels;
  const aLevels = study.factors.A.levels;

  const isThreeWay = cLevels.length === 2;
  const dodgeOffsets = bLevels.length === 3 ? [-11, 0, 11] : [-7, 7];

  const renderPanel = (cIdx: number, cLabel?: string) => {
    const svgW = isThreeWay ? 270 : 380;
    const svgH = 210;
    const padLeft = 46;
    const padRight = 24;
    const padTop = cLabel ? 26 : 16;
    const padBottom = 38;
    const plotW = svgW - padLeft - padRight;
    const plotH = svgH - padTop - padBottom;

    const xPositions = [padLeft + plotW * 0.27, padLeft + plotW * 0.73];
    const toY = (val: number) => padTop + plotH - ((val - yMin) / Math.max(1e-6, yMax - yMin)) * plotH;

    return (
      <div
        key={cIdx}
        className="flex-1 min-w-0 bg-[#f7f7f7] border border-[#dfe5e8] rounded-lg p-2"
      >
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto block" role="img" aria-label={`Wykres średnich i 95% CI ${cLabel || ''}`}>
          {/* Optional Panel Title for 2x2x2 */}
          {cLabel && (
            <text
              x={padLeft + plotW / 2}
              y={14}
              fill="#344b57"
              fontSize="10"
              fontWeight="700"
              textAnchor="middle"
            >
              {study.factors.C?.name}: {cLabel}
            </text>
          )}

          {/* Plot background box */}
          <rect
            x={padLeft}
            y={padTop}
            width={plotW}
            height={plotH}
            fill="#ffffff"
            stroke="#cfd8dd"
            strokeWidth="1"
          />

          {/* Horizontal Grid Lines & Y-Axis Ticks */}
          {ticks.map((tick, idx) => {
            const y = toY(tick);
            if (y < padTop - 1 || y > padTop + plotH + 1) return null;
            const formattedTick = Number.isInteger(tick) ? String(tick) : formatDecimal(tick, 1);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + plotW}
                  y2={y}
                  stroke="#e7ecef"
                  strokeDasharray="3 3"
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  fill="#6d7b83"
                  fontSize="8.5"
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                >
                  {formattedTick}
                </text>
              </g>
            );
          })}

          {/* Vertical guide lines at A levels */}
          {xPositions.map((xPos, aIdx) => (
            <line
              key={aIdx}
              x1={xPos}
              y1={padTop}
              x2={xPos}
              y2={padTop + plotH}
              stroke="#f0f3f5"
              strokeWidth="1"
            />
          ))}

          {/* Series Lines, Error Bars, and Points */}
          {bLevels.map((bLabel, bIdx) => {
            const palette = SERIES_COLORS[bIdx % SERIES_COLORS.length];
            const dodge = dodgeOffsets[bIdx] ?? 0;

            const c0 = study.cells.find((c) => c.aIdx === 0 && c.bIdx === bIdx && c.cIdx === cIdx);
            const c1 = study.cells.find((c) => c.aIdx === 1 && c.bIdx === bIdx && c.cIdx === cIdx);
            if (!c0 || !c1) return null;

            const pts = [
              { cell: c0, x: xPositions[0] + dodge },
              { cell: c1, x: xPositions[1] + dodge },
            ];

            return (
              <g key={bLabel}>
                {/* Connecting line */}
                <line
                  x1={pts[0].x}
                  y1={toY(pts[0].cell.mean)}
                  x2={pts[1].x}
                  y2={toY(pts[1].cell.mean)}
                  stroke={palette.stroke}
                  strokeWidth="2.1"
                />

                {/* 95% CI bars and points */}
                {pts.map(({ cell, x }) => {
                  const yMean = toY(cell.mean);
                  const yLow = toY(cell.ciLow);
                  const yHigh = toY(cell.ciHigh);

                  return (
                    <g
                      key={`${cell.aIdx}-${cell.bIdx}-${cell.cIdx}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <title>
                        {`${cell.aLabel} / ${cell.bLabel}${cell.cLabel ? ` / ${cell.cLabel}` : ''}: M = ${formatDecimal(
                          cell.mean,
                          2
                        )}, 95% CI [${formatDecimal(cell.ciLow, 2)}; ${formatDecimal(cell.ciHigh, 2)}]`}
                      </title>
                      <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={palette.stroke} strokeWidth="1.5" />
                      <line x1={x - 4.5} y1={yHigh} x2={x + 4.5} y2={yHigh} stroke={palette.stroke} strokeWidth="1.5" />
                      <line x1={x - 4.5} y1={yLow} x2={x + 4.5} y2={yLow} stroke={palette.stroke} strokeWidth="1.5" />
                      <circle cx={x} cy={yMean} r="4.2" fill={palette.fill} stroke="#ffffff" strokeWidth="1.2" />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* X-axis Level Labels */}
          {aLevels.map((aLabel, aIdx) => {
            const shortLabel = aLabel.length > 22 ? aLabel.split('(')[0].trim() : aLabel;
            return (
              <text
                key={aLabel}
                x={xPositions[aIdx]}
                y={padTop + plotH + 14}
                fill="#344b57"
                fontSize="8.5"
                fontWeight="600"
                textAnchor="middle"
              >
                {shortLabel}
              </text>
            );
          })}

          {/* X-axis Factor Title */}
          <text
            x={padLeft + plotW / 2}
            y={svgH - 6}
            fill="#5a6c77"
            fontSize="9"
            fontWeight="700"
            textAnchor="middle"
          >
            {study.factors.A.name}
          </text>

          {/* Y-axis label */}
          <text
            x={12}
            y={padTop + plotH / 2}
            fill="#5a6c77"
            fontSize="8.5"
            fontWeight="700"
            textAnchor="middle"
            transform={`rotate(-90, 12, ${padTop + plotH / 2})`}
          >
            {study.dvShortLabel}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className={`grid gap-2.5 ${isThreeWay ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {cLevels.map((cLabel, cIdx) => renderPanel(cIdx, cLabel))}
      </div>

      {/* Legend + Optional Hover Readout */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-0.5 text-[11px] text-[#5a6c77]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-[#344b57]">{study.factors.B.name}:</span>
          {bLevels.map((lvl, idx) => {
            const palette = SERIES_COLORS[idx % SERIES_COLORS.length];
            return (
              <span key={lvl} className="inline-flex items-center gap-1.5 font-semibold text-[#344b57]">
                <span
                  className="inline-block w-3 h-0.5 rounded-full"
                  style={{ backgroundColor: palette.stroke }}
                />
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: palette.fill }}
                />
                <span>{lvl}</span>
              </span>
            );
          })}
        </div>

        <div className="font-mono tabular-nums text-[10.5px] text-[#6d7b83]">
          {hoveredCell ? (
            <span className="text-[#344b57] font-semibold">
              {hoveredCell.aLabel} · {hoveredCell.bLabel}
              {hoveredCell.cLabel ? ` · ${hoveredCell.cLabel}` : ''}:{' '}
              <em>M</em> = {formatDecimal(hoveredCell.mean, 2)}, 95% CI [{formatDecimal(hoveredCell.ciLow, 2)};{' '}
              {formatDecimal(hoveredCell.ciHigh, 2)}]
            </span>
          ) : (
            <span>Najedź na punkt, aby odczytać dokładne M i 95% CI</span>
          )}
        </div>
      </div>
    </div>
  );
};
