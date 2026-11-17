import React from 'react';
import { Printer, BookMarked, Download, CheckCircle2 } from 'lucide-react';

export const StudentHandout: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Top action bar */}
      <div className="no-print flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <BookMarked className="w-4 h-4 text-indigo-400" />
          <span>Materiały dydaktyczne dla studentów (Wersja do druku / PDF)</span>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow"
        >
          <Printer className="w-4 h-4" />
          <span>Drukuj / Zapisz jako PDF</span>
        </button>
      </div>

      {/* Handout Sheet */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-8 font-sans border border-slate-200">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-700">
                Statystyka w Psychologii i Naukach Społecznych
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                ANOVA 2 × 2: Kompendium i Ściągawka Dydaktyczna
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Dwuczynnikowa analiza wariancji w planie międzygrupowym (niezależnym)
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              N = 20 · n = 5<br />
              SWPS Didactics
            </div>
          </div>
        </div>

        {/* Section 1: Kluczowe Pojęcia */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-200 pb-1 flex items-center gap-2">
            <span>1. Anatomia planu czynnikowego 2 × 2</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong>Czynnik A (Strategia uczenia się):</strong>
              <p className="text-slate-600">
                Poziomy: A₁ (ponowne czytanie) vs A₂ (testowanie się). Zmienna nominalna manipulowana eksperymentalnie.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong>Czynnik B (Długość snu):</strong>
              <p className="text-slate-600">
                Poziomy: B₁ (krótki sen) vs B₂ (długi sen). Zmienna nominalna.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong>Zmienna zależna (Y):</strong>
              <p className="text-slate-600">
                Liczba poprawnie odtworzonych słów. Skala ilościowa/przedziałowa.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong>Plan niezależny (międzygrupowy):</strong>
              <p className="text-slate-600">
                Każdy badany uczestniczy tylko w jednej z 4 grup. Łącznie N = 2 · 2 · 5 = 20 osób.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Macierz Danych i Średnich */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-200 pb-1">
            2. Macierz wyników, średnie komórek i średnie brzegowe
          </h2>
          <table className="w-full text-xs border border-slate-300 text-center">
            <thead className="bg-slate-100 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 text-left">Strategia (A)</th>
                <th className="p-2">Krótki sen (B₁)</th>
                <th className="p-2">Długi sen (B₂)</th>
                <th className="p-2 bg-indigo-50 text-indigo-900">Średnia brzegowa A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2 text-left font-semibold">Ponowne czytanie (A₁)</td>
                <td className="p-2 font-mono">M = 8 (SS = 10)</td>
                <td className="p-2 font-mono">M = 14 (SS = 10)</td>
                <td className="p-2 font-mono font-bold bg-indigo-50/50">M_A1 = 11</td>
              </tr>
              <tr>
                <td className="p-2 text-left font-semibold">Testowanie się (A₂)</td>
                <td className="p-2 font-mono">M = 13 (SS = 10)</td>
                <td className="p-2 font-mono">M = 13 (SS = 10)</td>
                <td className="p-2 font-mono font-bold bg-indigo-50/50">M_A2 = 13</td>
              </tr>
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                <td className="p-2 text-left">Średnia brzegowa B</td>
                <td className="p-2 font-mono">M_B1 = 10,5</td>
                <td className="p-2 font-mono">M_B2 = 13,5</td>
                <td className="p-2 font-mono text-indigo-900 bg-indigo-100 font-black">M_ogólna = 12</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Wzory Sum Kwadratów */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-200 pb-1">
            3. Zestawienie wzorów sum kwadratów (SS) i stopni swobody (df)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 font-sans block mb-1">Czynnik A (Strategia):</span>
              SS_A = n · b · Σ(M_Ai − M)² = 10 · [(11−12)² + (13−12)²] = <strong>20</strong><br />
              df_A = a − 1 = 2 − 1 = <strong>1</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 font-sans block mb-1">Czynnik B (Sen):</span>
              SS_B = n · a · Σ(M_Bj − M)² = 10 · [(10,5−12)² + (13,5−12)²] = <strong>45</strong><br />
              df_B = b − 1 = 2 − 1 = <strong>1</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 font-sans block mb-1">Interakcja A × B:</span>
              SS_AxB = SS_komórek − SS_A − SS_B = 110 − 20 − 45 = <strong>45</strong><br />
              df_AxB = (a − 1)(b − 1) = <strong>1</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800 font-sans block mb-1">Błąd (wewnątrzgrupowy):</span>
              SS_błąd = Σ SS_wewnątrz = 10 + 10 + 10 + 10 = <strong>40</strong><br />
              df_błąd = N − a·b = 20 − 4 = <strong>16</strong>
            </div>
          </div>
        </div>

        {/* Section 4: Złote Zasady Interpretacji */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-950 border-b border-slate-200 pb-1">
            4. Złote zasady wnioskowania statystycznego
          </h2>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Linie na wykresie nie są równoległe:</strong> To wizualny dowód interakcji. Oznacza to, że wpływ snu różni się w zależności od przyjętej techniki uczenia się.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Gdy interakcja jest istotna:</strong> NIE wolno interpretować efektów głównych wprost! Należy wykonać analizę <strong>efektów prostych</strong> (np. sprawdzić wpływ strategii osobno dla krótkiego snu: F = 25,00, p &lt; 0,001 oraz dla długiego: F = 1,00, p = 0,33).
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Wniosek psychologiczny:</strong> Testowanie się działa jak bufor poznawczy chroniący przed negatywnymi skutkami deprywacji snu. Ponowne czytanie wymaga pełnego snu, aby doszło do konsolidacji.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
