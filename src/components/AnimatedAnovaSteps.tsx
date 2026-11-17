import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calculator,
  TrendingUp,
  Info,
  Check,
  Copy,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { LatexFormula } from './LatexFormula';

interface StepData {
  step: number;
  label: React.ReactNode;
  labelText: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  cellDisplayMode: 'raw_only' | 'with_means' | 'with_ss' | 'full';
  highlightedCells: string[]; // 'A1B1', 'A1B2', 'A2B1', 'A2B2', 'margA', 'margB', 'grandMean', 'ssA', 'ssB', 'ssAxB', 'ssErr', 'ssTot'
  explanation: React.ReactNode;
  formulaTex: string;
  calcBreakdown: {
    label: React.ReactNode;
    subValues: React.ReactNode[];
    result: React.ReactNode;
    finalNumber: React.ReactNode;
  };
  tableProgress: {
    activeRow?: 'A' | 'B' | 'AxB' | 'err' | 'tot' | 'df' | 'ms' | 'f' | 'eta';
    showA_SS: boolean;
    showB_SS: boolean;
    showAxB_SS: boolean;
    showError_SS: boolean;
    showDF: boolean;
    showMS: boolean;
    showF_P: boolean;
    showEta: boolean;
  };
}

const STEPS: StepData[] = [
  {
    step: 1,
    label: '1. Dane surowe',
    labelText: '1. Dane surowe',
    title: 'Krok 1: Punkt wyjścia — Surowe dane z badania',
    subtitle: <>W komórkach widzimy wyłącznie surowe wyniki uczestników (po <em>n</em> = 5 osób w 4 grupach).</>,
    cellDisplayMode: 'raw_only',
    highlightedCells: ['A1B1', 'A1B2', 'A2B1', 'A2B2'],
    explanation: <>Badanie objęło <em>N</em> = 20 osób w 4 grupach. Każda liczba to wynik jednej osoby (liczba zapamiętanych słów). Na tym etapie nie znamy jeszcze średnich ani sum kwadratów — to czyste dane pomiarowe.</>,
    formulaTex: 'N = 20,\\quad a = 2,\\quad b = 2,\\quad n = 5',
    calcBreakdown: {
      label: 'Surowe wyniki w 4 komórkach:',
      subValues: [
        'Grupa 1 (Czytanie, krótki sen): [ 6, 8, 7, 9, 10 ]',
        'Grupa 2 (Czytanie, długi sen): [ 12, 14, 13, 15, 16 ]',
        'Grupa 3 (Testowanie, krótki sen): [ 11, 13, 12, 14, 15 ]',
        'Grupa 4 (Testowanie, długi sen): [ 11, 14, 12, 15, 13 ]',
      ],
      result: 'Pierwsze zadanie:',
      finalNumber: <>Obliczyć średnie (<em>M</em>)</>,
    },
    tableProgress: {
      showA_SS: false,
      showB_SS: false,
      showAxB_SS: false,
      showError_SS: false,
      showDF: false,
      showMS: false,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 2,
    label: <>2. Średnie (<em>M</em>)</>,
    labelText: '2. Średnie (M)',
    title: 'Krok 2: Obliczenie średnich komórek i średnich brzegowych',
    subtitle: 'Z surowych punktów wyliczamy średnią w każdej komórce, a następnie średnie brzegowe i ogólną.',
    cellDisplayMode: 'with_means',
    highlightedCells: ['A1B1', 'A1B2', 'A2B1', 'A2B2', 'margA', 'margB', 'grandMean'],
    explanation: <>Sumujemy wyniki w każdej grupie i dzielimy przez <em>n</em> = 5. Otrzymujemy średnie komórek: <em>M</em> = 8,00; <em>M</em> = 14,00; <em>M</em> = 13,00; <em>M</em> = 13,00. Następnie uśredniamy wiersze (<em>A</em><sub>1</sub>: <em>M</em> = 11,00; <em>A</em><sub>2</sub>: <em>M</em> = 13,00), kolumny (<em>B</em><sub>1</sub>: <em>M</em> = 10,50; <em>B</em><sub>2</sub>: <em>M</em> = 13,50) oraz wyznaczamy średnią ogólną <em>M</em> = 12,00.</>,
    formulaTex: '\\begin{gathered} M = \\frac{\\sum X}{n} \\\\[4pt] M_{\\text{ogólna}} = \\frac{\\sum X}{N} = \\frac{240}{20} = 12{,}00 \\end{gathered}',
    calcBreakdown: {
      label: 'Wyliczone średnie:',
      subValues: [
        <>Czytanie, krótki: <LatexFormula tex="M = \frac{6+8+7+9+10}{5} = \frac{40}{5} = 8{,}00" /></>,
        <>Czytanie, długi: <LatexFormula tex="M = \frac{12+14+13+15+16}{5} = \frac{70}{5} = 14{,}00" /></>,
        <>Testowanie, krótki: <LatexFormula tex="M = \frac{11+13+12+14+15}{5} = \frac{65}{5} = 13{,}00" /></>,
        <>Testowanie, długi: <LatexFormula tex="M = \frac{11+14+12+15+13}{5} = \frac{65}{5} = 13{,}00" /></>,
        <>Brzegowe: <LatexFormula tex="M_{A_1}=11{,}00;\ M_{A_2}=13{,}00;\ M_{B_1}=10{,}50;\ M_{B_2}=13{,}50" /></>,
      ],
      result: 'Średnia ogólna z całego badania:',
      finalNumber: <LatexFormula tex="M = 12{,}00" />,
    },
    tableProgress: {
      showA_SS: false,
      showB_SS: false,
      showAxB_SS: false,
      showError_SS: false,
      showDF: false,
      showMS: false,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 3,
    label: <>3. <em>SS</em> wewnątrz (Błąd)</>,
    labelText: '3. SS wewnątrz (Błąd)',
    title: <>Krok 3: Obliczenie <em>SS</em> wewnątrz grup i zasilenie wiersza Błędu</>,
    subtitle: <>Dla każdej grupy liczymy <LatexFormula tex="SS = \sum (X - M)^2" />. Suma wewnątrz 4 grup tworzy <em>SS</em><sub>błąd</sub> w tabeli ANOVA.</>,
    cellDisplayMode: 'with_ss',
    highlightedCells: ['A1B1', 'A1B2', 'A2B1', 'A2B2', 'ssErr'],
    explanation: <>W każdej komórce sprawdzamy odchylenia surowych punktów od średniej tej grupy: <LatexFormula tex="(X - M)^2" />. W tym badaniu każda z 4 grup ma identyczną sumę kwadratów: <em>SS</em> = 10,00. Sumujemy je: 10 + 10 + 10 + 10 = 40,00. Ta wartość to <em>SS</em><sub>błąd</sub>, która zasila bezpośrednio wiersz „Błąd (wewnątrzgrupowy)” w tabeli ANOVA.</>,
    formulaTex: '\\begin{gathered} SS_{\\text{błąd}} = \\sum SS_{\\text{komórek}} \\\\[4pt] = 10{,}00 + 10{,}00 + 10{,}00 + 10{,}00 = 40{,}00 \\end{gathered}',
    calcBreakdown: {
      label: 'Suma kwadratów wewnątrz 4 grup:',
      subValues: [
        <><em>A</em><sub>1</sub><em>B</em><sub>1</sub> (Czytanie, krótki; <em>M</em> = 8,00): <LatexFormula tex="(6-8)^2 + (8-8)^2 + (7-8)^2 + (9-8)^2 + (10-8)^2 = 10{,}00" /></>,
        <><em>A</em><sub>1</sub><em>B</em><sub>2</sub> (Czytanie, długi; <em>M</em> = 14,00): <LatexFormula tex="(12-14)^2 + (14-14)^2 + (13-14)^2 + (15-14)^2 + (16-14)^2 = 10{,}00" /></>,
        <><em>A</em><sub>2</sub><em>B</em><sub>1</sub> (Testowanie, krótki; <em>M</em> = 13,00): <LatexFormula tex="(11-13)^2 + (13-13)^2 + (12-13)^2 + (14-13)^2 + (15-13)^2 = 10{,}00" /></>,
        <><em>A</em><sub>2</sub><em>B</em><sub>2</sub> (Testowanie, długi; <em>M</em> = 13,00): <LatexFormula tex="(11-13)^2 + (14-13)^2 + (12-13)^2 + (15-13)^2 + (13-13)^2 = 10{,}00" /></>,
      ],
      result: 'Zasilenie tabeli ANOVA (wiersz Błąd):',
      finalNumber: <LatexFormula tex="SS_{\text{błąd}} = 40{,}00" />,
    },
    tableProgress: {
      activeRow: 'err',
      showA_SS: false,
      showB_SS: false,
      showAxB_SS: false,
      showError_SS: true,
      showDF: false,
      showMS: false,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 4,
    label: <>4. <em>SS</em><sub>A</sub> (Strategia)</>,
    labelText: '4. SS(A) (Strategia)',
    title: <>Krok 4: Obliczenie <em>SS</em><sub>A</sub> i umieszczenie w tabeli</>,
    subtitle: <>Średnie brzegowe wierszy Strategii (<em>M</em> = 11,00 i <em>M</em> = 13,00) wyznaczają <em>SS</em><sub>A</sub> = 20,00.</>,
    cellDisplayMode: 'full',
    highlightedCells: ['margA', 'grandMean', 'ssA'],
    explanation: <>Porównujemy średnie brzegowe Ponownego czytania (<em>M</em> = 11,00) i Testowania (<em>M</em> = 13,00) ze średnią ogólną (<em>M</em> = 12,00). Kwadraty odchyleń mnożymy przez liczbę osób w każdym poziomie (<em>n</em> · <em>b</em> = 5 · 2 = 10). Wynik <em>SS</em><sub>A</sub> = 20,00 pojawia się bezpośrednio w kolumnie brzegowej oraz w tabeli ANOVA.</>,
    formulaTex: '\\begin{gathered} SS_A = n \\cdot b \\sum (M_{A_i} - M)^2 \\\\[4pt] = 10 \\cdot \\big[(11 - 12)^2 + (13 - 12)^2\\big] = 20{,}00 \\end{gathered}',
    calcBreakdown: {
      label: <>Obliczenie <em>SS</em> dla Czynnika <em>A</em> (Strategia):</>,
      subValues: [
        <>Czytanie (<em>A</em><sub>1</sub>): <LatexFormula tex="M_{A_1}=11{,}00;\quad (11 - 12)^2 = 1{,}00" /></>,
        <>Testowanie (<em>A</em><sub>2</sub>): <LatexFormula tex="M_{A_2}=13{,}00;\quad (13 - 12)^2 = 1{,}00" /></>,
        <>Suma kwadratów odchyleń: <LatexFormula tex="1{,}00 + 1{,}00 = 2{,}00" /></>,
        <>Mnożnik próby (<LatexFormula tex="n \cdot b = 5 \cdot 2 = 10" />): <LatexFormula tex="10 \cdot 2{,}00 = 20{,}00" /></>,
      ],
      result: <>Wpis do Tabeli ANOVA (wiersz <em>A</em>):</>,
      finalNumber: <LatexFormula tex="SS_A = 20{,}00" />,
    },
    tableProgress: {
      activeRow: 'A',
      showA_SS: true,
      showB_SS: false,
      showAxB_SS: false,
      showError_SS: true,
      showDF: false,
      showMS: false,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 5,
    label: <>5. <em>SS</em><sub>B</sub> (Sen)</>,
    labelText: '5. SS(B) (Sen)',
    title: <>Krok 5: Obliczenie <em>SS</em><sub>B</sub> i umieszczenie w tabeli</>,
    subtitle: <>Średnie brzegowe kolumn Snu (<em>M</em> = 10,50 i <em>M</em> = 13,50) wyznaczają <em>SS</em><sub>B</sub> = 45,00.</>,
    cellDisplayMode: 'full',
    highlightedCells: ['margB', 'grandMean', 'ssB'],
    explanation: <>Porównujemy średnie brzegowe Krótkiego snu (<em>M</em> = 10,50) i Długiego snu (<em>M</em> = 13,50) ze średnią ogólną (<em>M</em> = 12,00). Kwadraty odchyleń mnożymy przez liczbę osób w każdym poziomie (<em>n</em> · <em>a</em> = 5 · 2 = 10). Wynik <em>SS</em><sub>B</sub> = 45,00 wpisujemy do dolnego wiersza brzegowego oraz do tabeli ANOVA.</>,
    formulaTex: '\\begin{gathered} SS_B = n \\cdot a \\sum (M_{B_j} - M)^2 \\\\[4pt] = 10 \\cdot \\big[(10{,}5 - 12)^2 + (13{,}5 - 12)^2\\big] = 45{,}00 \\end{gathered}',
    calcBreakdown: {
      label: <>Obliczenie <em>SS</em> dla Czynnika <em>B</em> (Sen):</>,
      subValues: [
        <>Krótki sen (<em>B</em><sub>1</sub>): <LatexFormula tex="M_{B_1}=10{,}50;\quad (10{,}5 - 12)^2 = 2{,}25" /></>,
        <>Długi sen (<em>B</em><sub>2</sub>): <LatexFormula tex="M_{B_2}=13{,}50;\quad (13{,}5 - 12)^2 = 2{,}25" /></>,
        <>Suma kwadratów odchyleń: <LatexFormula tex="2{,}25 + 2{,}25 = 4{,}50" /></>,
        <>Mnożnik próby (<LatexFormula tex="n \cdot a = 5 \cdot 2 = 10" />): <LatexFormula tex="10 \cdot 4{,}50 = 45{,}00" /></>,
      ],
      result: <>Wpis do Tabeli ANOVA (wiersz <em>B</em>):</>,
      finalNumber: <LatexFormula tex="SS_B = 45{,}00" />,
    },
    tableProgress: {
      activeRow: 'B',
      showA_SS: true,
      showB_SS: true,
      showAxB_SS: false,
      showError_SS: true,
      showDF: false,
      showMS: false,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 6,
    label: <>6. <em>SS</em><sub>A×B</sub> (Interakcja)</>,
    labelText: '6. SS(A×B) (Interakcja)',
    title: <>Krok 6: Obliczenie <em>SS</em><sub>A×B</sub> i umieszczenie w tabeli</>,
    subtitle: <>Wariancja między 4 komórkami (<em>SS</em> = 110,00) minus czyste efekty <em>A</em> (20,00) i <em>B</em> (45,00) daje <em>SS</em><sub>A×B</sub> = 45,00.</>,
    cellDisplayMode: 'full',
    highlightedCells: ['A1B1', 'A1B2', 'A2B1', 'A2B2', 'grandMean', 'ssAxB'],
    explanation: <>Interakcja to wariancja wynikająca ze współdziałania strategii i snu. Całkowite <em>SS</em> między 4 komórkami wynosi 110,00. Odejmujemy <em>SS</em><sub>A</sub> (20,00) oraz <em>SS</em><sub>B</sub> (45,00). Pozostałe 45,00 to czysta interakcja <em>A</em> × <em>B</em> — zasila wiersz interakcji w tabeli ANOVA.</>,
    formulaTex: '\\begin{gathered} SS_{A \\times B} = SS_{\\text{komórek}} - SS_A - SS_B \\\\[4pt] = 110{,}00 - 20{,}00 - 45{,}00 = 45{,}00 \\end{gathered}',
    calcBreakdown: {
      label: 'Dekompozycja różnicowa do wiersza Interakcji:',
      subValues: [
        <><em>SS</em> komórek: <LatexFormula tex="5 \cdot \big[(8-12)^2 + (14-12)^2 + (13-12)^2 + (13-12)^2\big] = 110{,}00" /></>,
        <>Odejmujemy efekt strategii: <LatexFormula tex="-SS_A = -20{,}00" /></>,
        <>Odejmujemy efekt długości snu: <LatexFormula tex="-SS_B = -45{,}00" /></>,
      ],
      result: <>Wpis do Tabeli ANOVA (wiersz <em>A</em> × <em>B</em>):</>,
      finalNumber: <LatexFormula tex="SS_{A \times B} = 45{,}00" />,
    },
    tableProgress: {
      activeRow: 'AxB',
      showA_SS: true,
      showB_SS: true,
      showAxB_SS: true,
      showError_SS: true,
      showDF: false,
      showMS: false,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 7,
    label: <>7. <em>SS</em><sub>total</sub> (Suma)</>,
    labelText: '7. SS(total) (Suma)',
    title: <>Krok 7: Zsumowanie zmienności całkowitej (<em>SS</em><sub>total</sub>)</>,
    subtitle: 'Wszystkie 4 składowe łączą się w wierszu „Ogółem (Total)”: 20,00 + 45,00 + 45,00 + 40,00 = 150,00.',
    cellDisplayMode: 'full',
    highlightedCells: ['ssA', 'ssB', 'ssAxB', 'ssErr', 'ssTot'],
    explanation: <>Wszystkie sumy kwadratów są już wyznaczone! Wiersz całkowity sumuje 4 niezależne źródła: <em>SS</em><sub>A</sub> (20,00) + <em>SS</em><sub>B</sub> (45,00) + <em>SS</em><sub>A×B</sub> (45,00) + <em>SS</em><sub>błąd</sub> (40,00) = 150,00. Reprezentuje to 100% zróżnicowania wyników <em>N</em> = 20 badanych osób.</>,
    formulaTex: '\\begin{gathered} SS_{\\text{total}} = SS_A + SS_B + SS_{A \\times B} + SS_{\\text{błąd}} \\\\[4pt] = 20{,}00 + 45{,}00 + 45{,}00 + 40{,}00 = 150{,}00 \\end{gathered}',
    calcBreakdown: {
      label: 'Dekompozycja 100% wariancji w badaniu:',
      subValues: [
        <><LatexFormula tex="SS_A" /> (Strategia): <LatexFormula tex="20{,}00" /> (13,3% zmienności)</>,
        <><LatexFormula tex="SS_B" /> (Sen): <LatexFormula tex="45{,}00" /> (30,0% zmienności)</>,
        <><LatexFormula tex="SS_{A \times B}" /> (Interakcja): <LatexFormula tex="45{,}00" /> (30,0% zmienności)</>,
        <><LatexFormula tex="SS_{\text{błąd}}" /> (Wewnątrzgrupowy szum): <LatexFormula tex="40{,}00" /> (26,7% zmienności)</>,
      ],
      result: 'Wpis do Tabeli ANOVA (wiersz Ogółem):',
      finalNumber: <LatexFormula tex="SS_{\text{total}} = 150{,}00" />,
    },
    tableProgress: {
      activeRow: 'tot',
      showA_SS: true,
      showB_SS: true,
      showAxB_SS: true,
      showError_SS: true,
      showDF: false,
      showMS: false,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 8,
    label: <>8. Stopnie swobody (<em>df</em>)</>,
    labelText: '8. Stopnie swobody (df)',
    title: <>Krok 8: Czym są stopnie swobody (<em>df</em>)?</>,
    subtitle: 'Liczba wartości mogących swobodnie się zmieniać po ustaleniu średniej.',
    cellDisplayMode: 'full',
    highlightedCells: [],
    explanation: <>Czym są stopnie swobody (<em>df</em>)? To liczba obserwacji lub średnich, które mogą przyjmować dowolne wartości przy ustalonej sumie/średniej. Jeśli znasz średnią ogólną (<em>M</em> = 12,00) i średnią Czytania (<em>M</em> = 11,00), średnia Testowania MUSI wynosić 13,00 — tracisz swobodę wyboru! Dlatego dla 2 poziomów <em>df</em> = 2 − 1 = 1. Dla błędu każda z 4 grup traci 1 stopień na swoją średnią, więc zostaje 4 · (5 − 1) = 16.</>,
    formulaTex: '\\begin{gathered} df_{\\text{efektu}} = k - 1 \\\\[4pt] df_{\\text{błędu}} = N - (a \\cdot b) = 20 - 4 = 16 \\end{gathered}',
    calcBreakdown: {
      label: 'Logika stopni swobody dla każdego źródła:',
      subValues: [
        <><LatexFormula tex="df_A = 2 - 1 = 1" /> swobodna średnia (Strategia)</>,
        <><LatexFormula tex="df_B = 2 - 1 = 1" /> swobodna średnia (Sen)</>,
        <><LatexFormula tex="df_{A \times B} = (a - 1)(b - 1) = 1 \cdot 1 = 1" /> (Interakcja)</>,
        <><LatexFormula tex="df_{\text{błąd}} = N - a \cdot b = 20 - 4 = 16" /> (po 4 osoby w 4 grupach)</>,
        <><LatexFormula tex="df_{\text{total}} = N - 1 = 20 - 1 = 19" /> (bo <LatexFormula tex="1+1+1+16=19" />)</>,
      ],
      result: 'Stopnie swobody błędu:',
      finalNumber: <LatexFormula tex="df_{\text{błąd}} = 16" />,
    },
    tableProgress: {
      activeRow: 'df',
      showA_SS: true,
      showB_SS: true,
      showAxB_SS: true,
      showError_SS: true,
      showDF: true,
      showMS: false,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 9,
    label: <>9. Średnie kwadraty (<em>MS</em>)</>,
    labelText: '9. Średnie kwadraty (MS)',
    title: <>Krok 9: Obliczenie Średnich Kwadratów (<LatexFormula tex="MS = \frac{SS}{df}" />)</>,
    subtitle: <>Dzielimy sumy kwadratów (<em>SS</em>) przez stopnie swobody (<em>df</em>), otrzymując wariancje.</>,
    cellDisplayMode: 'full',
    highlightedCells: [],
    explanation: <>Dzieląc sumy kwadratów przez liczbę stopni swobody, otrzymujemy czyste miary wariancji (Mean Squares). Kluczowy jest <em>MS</em><sub>błąd</sub> (40,00 / 16 = 2,50), który posłuży jako uniwersalny mianownik w testach <em>F</em>.</>,
    formulaTex: 'MS = \\frac{SS}{df}',
    calcBreakdown: {
      label: 'Wyliczenie średnich kwadratów:',
      subValues: [
        <><LatexFormula tex="MS_A = \frac{20{,}00}{1} = 20{,}00" /></>,
        <><LatexFormula tex="MS_B = \frac{45{,}00}{1} = 45{,}00" /></>,
        <><LatexFormula tex="MS_{A \times B} = \frac{45{,}00}{1} = 45{,}00" /></>,
        <><LatexFormula tex="MS_{\text{błąd}} = \frac{40{,}00}{16} = 2{,}50" /> (szum losowy w próbie)</>,
      ],
      result: 'Wariancja błędu losowego:',
      finalNumber: <LatexFormula tex="MS_{\text{błąd}} = 2{,}50" />,
    },
    tableProgress: {
      activeRow: 'ms',
      showA_SS: true,
      showB_SS: true,
      showAxB_SS: true,
      showError_SS: true,
      showDF: true,
      showMS: true,
      showF_P: false,
      showEta: false,
    },
  },
  {
    step: 10,
    label: <>10. Test <em>F</em> i <em>p</em></>,
    labelText: '10. Test F i p',
    title: <>Krok 10: Statystyka <em>F</em> i Poziom Istotności (<em>p</em>)</>,
    subtitle: <>Dzielimy wariancję efektów przez szum losowy: <LatexFormula tex="F = \frac{MS_{\text{efektu}}}{MS_{\text{błędu}}}" />.</>,
    cellDisplayMode: 'full',
    highlightedCells: [],
    explanation: <>Sprawdzamy, ile razy zmienność wywołana eksperymentem przewyższa szum losowy (<em>MS</em><sub>błąd</sub> = 2,50). Dla <em>df</em> = 1, 16 i <em>α</em> = 0,05 wartość krytyczna wynosi <em>F</em><sub>kryt</sub> = 4,49. Ponieważ wszystkie nasze <em>F</em> są wyższe, wszystkie efekty są statystycznie istotne!</>,
    formulaTex: '\\begin{gathered} F = \\frac{MS_{\\text{efektu}}}{MS_{\\text{błędu}}} \\\\[4pt] F_{\\text{kryt}}(1,\\, 16) = 4{,}49 \\end{gathered}',
    calcBreakdown: {
      label: <>Testy istotności <em>F</em>:</>,
      subValues: [
        <>Strategia: <LatexFormula tex="F_A = \frac{20{,}00}{2{,}50} = 8{,}00;\ p = 0{,}012" /> (istotny)</>,
        <>Sen: <LatexFormula tex="F_B = \frac{45{,}00}{2{,}50} = 18{,}00;\ p < 0{,}001" /> (istotny)</>,
        <>Interakcja: <LatexFormula tex="F_{A \times B} = \frac{45{,}00}{2{,}50} = 18{,}00;\ p < 0{,}001" /> (istotny!)</>,
      ],
      result: 'Wszystkie efekty przekraczają 4,49:',
      finalNumber: <LatexFormula tex="F_{A \times B} = 18{,}00" />,
    },
    tableProgress: {
      activeRow: 'f',
      showA_SS: true,
      showB_SS: true,
      showAxB_SS: true,
      showError_SS: true,
      showDF: true,
      showMS: true,
      showF_P: true,
      showEta: false,
    },
  },
  {
    step: 11,
    label: <>11. Cząstkowe η<sub>p</sub><sup>2</sup></>,
    labelText: '11. Cząstkowe η²p',
    title: <>Krok 11: Cząstkowe eta-kwadrat (η<sub>p</sub><sup>2</sup>) i interpretacja wielkości efektu</>,
    subtitle: <>Mierzymy siłę oddziaływania każdego efektu: <LatexFormula tex="\text{η}_p^2 = \frac{SS_{\text{efektu}}}{SS_{\text{efektu}} + SS_{\text{błędu}}}" />.</>,
    cellDisplayMode: 'full',
    highlightedCells: [],
    explanation: <>Cząstkowe eta-kwadrat określa procent wariancji zmiennej zależnej wyjaśniany przez dany efekt po wyłączeniu pozostałych czynników. Wg kryteriów Cohena (1988): 0,01 = mały; 0,06 = średni; 0,14 = duży efekt. Wynik η<sub>p</sub><sup>2</sup> = 0,53 oznacza potężną siłę wyjaśniającą!</>,
    formulaTex: '\\text{η}_p^2 = \\frac{SS_{\\text{efektu}}}{SS_{\\text{efektu}} + SS_{\\text{błędu}}}',
    calcBreakdown: {
      label: 'Obliczenie cząstkowego eta-kwadrat i interpretacja Cohena:',
      subValues: [
        <>Strategia: <LatexFormula tex="\text{η}_{p(A)}^2 = \frac{20{,}00}{20{,}00 + 40{,}00} = \frac{20}{60} = 0{,}33" /> (33%; duży efekt)</>,
        <>Sen: <LatexFormula tex="\text{η}_{p(B)}^2 = \frac{45{,}00}{45{,}00 + 40{,}00} = \frac{45}{85} = 0{,}53" /> (53%; bardzo duży efekt)</>,
        <>Interakcja: <LatexFormula tex="\text{η}_{p(A \times B)}^2 = \frac{45{,}00}{45{,}00 + 40{,}00} = \frac{45}{85} = 0{,}53" /> (53%; bardzo duży efekt)</>,
        'Kryteria Cohena: mały ≥ 0,01; średni ≥ 0,06; duży ≥ 0,14',
      ],
      result: 'Wielkość efektu interakcji:',
      finalNumber: <LatexFormula tex="\text{η}_p^2 = 0{,}53\ (53\%)" />,
    },
    tableProgress: {
      activeRow: 'eta',
      showA_SS: true,
      showB_SS: true,
      showAxB_SS: true,
      showError_SS: true,
      showDF: true,
      showMS: true,
      showF_P: true,
      showEta: true,
    },
  },
  {
    step: 12,
    label: '12. Wykres',
    labelText: '12. Wykres',
    title: 'Krok 12: Wykres interakcji (95% CI) i Raport APA 7',
    subtitle: 'Wykres ze słupkami 95% CI, analiza efektów prostych oraz gotowy format raportowania APA 7.',
    cellDisplayMode: 'full',
    highlightedCells: ['A1B1', 'A1B2', 'A2B1', 'A2B2'],
    explanation: <>Słupki na wykresie to 95% przedziały ufności (95% CI ± 1,50 słowa). Przy krótkim śnie przedziały nie nakładają się w ogóle (istotny efekt prosty: <em>M</em> = 13,00 vs <em>M</em> = 8,00; <em>p</em> &lt; 0,001). Przy długim śnie przedziały niemal całkowicie się pokrywają (<em>M</em> = 13,00 vs <em>M</em> = 14,00; <em>p</em> = 0,333). Testowanie chroni przed brakiem snu!</>,
    formulaTex: '\\begin{gathered} 95\\%\\ \\text{CI} = M \\pm (t_{\\text{kryt}} \\cdot SE) \\\\[4pt] = M \\pm (2{,}120 \\cdot 0{,}707) = M \\pm 1{,}50 \\end{gathered}',
    calcBreakdown: {
      label: 'Efekty proste i przedziały ufności 95% CI:',
      subValues: [
        <>Krótki sen: <LatexFormula tex="M = 13{,}00\ [11{,}50;\, 14{,}50]" /> vs <LatexFormula tex="M = 8{,}00\ [6{,}50;\, 9{,}50];\ F(1,\, 16) = 25{,}00;\ p < 0{,}001" /></>,
        <>Długi sen: <LatexFormula tex="M = 13{,}00\ [11{,}50;\, 14{,}50]" /> vs <LatexFormula tex="M = 14{,}00\ [12{,}50;\, 15{,}50];\ F(1,\, 16) = 1{,}00;\ p = 0{,}333" /></>,
        <>Błąd standardowy: <LatexFormula tex="SE = \sqrt{\frac{MS_{\text{błąd}}}{n}} = \sqrt{\frac{2{,}50}{5}} = 0{,}7071" /></>,
        'Wniosek: Testowanie stanowi bufor poznawczy chroniący przed niewyspaniem.',
      ],
      result: 'Wniosek psychologiczny:',
      finalNumber: 'Testowanie = bufor snu',
    },
    tableProgress: {
      showA_SS: true,
      showB_SS: true,
      showAxB_SS: true,
      showError_SS: true,
      showDF: true,
      showMS: true,
      showF_P: true,
      showEta: true,
    },
  },
];

const STEP_SHORT_LABELS: Record<number, React.ReactNode> = {
  1: '1. Dane surowe',
  2: <>2. Średnie (<em>M</em>)</>,
  3: <>3. <em>SS</em> błąd wewn.</>,
  4: <>4. <em>SS</em><sub>A</sub> (Strategia)</>,
  5: <>5. <em>SS</em><sub>B</sub> (Sen)</>,
  6: <>6. <em>SS</em><sub>A×B</sub> (Inter.)</>,
  7: <>7. <em>SS</em> całkowite</>,
  8: <>8. Stopnie <em>df</em></>,
  9: <>9. Średnie <em>MS</em></>,
  10: <>10. Test <em>F</em></>,
  11: <>11. Cząstkowe η<sub>p</sub><sup>2</sup></>,
  12: '12. Wykres i APA7',
};

interface TraceConnection {
  targetId: string;
  sourceIds: string[];
  formulaDesc: React.ReactNode;
}

export const AnimatedAnovaSteps: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [hoveredFormula, setHoveredFormula] = useState<React.ReactNode | null>(null);
  const [activeTrace, setActiveTrace] = useState<TraceConnection | null>(null);
  const [copiedApa, setCopiedApa] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Container ref for calculating SVG connecting lines
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgLines, setSvgLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

  const isIntroActive = currentStepIdx === -1;
  const currentStep = STEPS[Math.max(0, currentStepIdx)];

  // Calculate dynamic SVG connecting lines when activeTrace changes
  useEffect(() => {
    const updateLines = () => {
      if (isIntroActive || !activeTrace || !containerRef.current) {
        setSvgLines([]);
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const targetEl = containerRef.current.querySelector(`[data-trace-id="${activeTrace.targetId}"]`);
      
      if (!targetEl) {
        setSvgLines([]);
        return;
      }

      const targetRect = targetEl.getBoundingClientRect();
      const targetCenter = {
        x: targetRect.left + targetRect.width / 2 - containerRect.left,
        y: targetRect.top + targetRect.height / 2 - containerRect.top,
      };

      const newLines = activeTrace.sourceIds.map((sourceId) => {
        let sourceEl = containerRef.current?.querySelector(`[data-trace-id="${sourceId}"]`);
        if (!sourceEl && sourceId.includes('_')) {
          const parts = sourceId.split('_');
          const fallbackId = parts[parts.length - 1];
          sourceEl = containerRef.current?.querySelector(`[data-trace-id="${fallbackId}"]`);
        }
        if (!sourceEl) return null;
        const sourceRect = sourceEl.getBoundingClientRect();
        return {
          x1: sourceRect.left + sourceRect.width / 2 - containerRect.left,
          y1: sourceRect.top + sourceRect.height / 2 - containerRect.top,
          x2: targetCenter.x,
          y2: targetCenter.y,
        };
      }).filter(Boolean) as Array<{ x1: number; y1: number; x2: number; y2: number }>;

      setSvgLines(newLines);
    };

    updateLines();

    window.addEventListener('resize', updateLines);
    window.addEventListener('scroll', updateLines, { passive: true });
    return () => {
      window.removeEventListener('resize', updateLines);
      window.removeEventListener('scroll', updateLines);
    };
  }, [activeTrace, currentStepIdx]);

  const handleNext = () => {
    if (currentStepIdx < STEPS.length - 1) {
      setActiveTrace(null);
      setHoveredFormula(null);
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > -1) {
      setActiveTrace(null);
      setHoveredFormula(null);
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setActiveTrace(null);
    setHoveredFormula(null);
    setCurrentStepIdx(-1);
  };

  const setTraceHover = (targetId: string, sourceIds: string[], formulaDesc: React.ReactNode) => {
    setActiveTrace({ targetId, sourceIds, formulaDesc });
    setHoveredFormula(formulaDesc);
  };

  const clearTraceHover = () => {
    setActiveTrace(null);
    setHoveredFormula(null);
  };

  const copyApaToClipboard = () => {
    const apaText = `Przeprowadzono dwuczynnikową analizę wariancji w schemacie międzygrupowym 2 (Strategia uczenia się: Ponowne czytanie vs Testowanie) × 2 (Czas trwania snu: Krótki vs Długi). Wykazano statystycznie istotny efekt główny strategii uczenia się, F(1, 16) = 8,00; p = 0,012; η²ₚ = 0,33, a także istotny efekt główny czasu trwania snu, F(1, 16) = 18,00; p < 0,001; η²ₚ = 0,53.

Kluczowy dla hipotezy badawczej efekt interakcji obu czynników okazał się statystycznie istotny, F(1, 16) = 18,00; p < 0,001; η²ₚ = 0,53. Analiza efektów prostych wykazała, że w warunku krótkiego snu osoby testujące się zapamiętały istotnie więcej słów (M = 13,00; SD = 1,58; 95% CI [11,50; 14,50]) niż osoby ponownie czytające (M = 8,00; SD = 1,58; 95% CI [6,50; 9,50]), F(1, 16) = 25,00; p < 0,001; η²ₚ = 0,61. W warunku długiego snu różnica między strategiami nie była istotna statystycznie (M = 13,00 vs M = 14,00), F(1, 16) = 1,00; p = 0,333; η²ₚ = 0,06.`;
    navigator.clipboard.writeText(apaText);
    setCopiedApa(true);
    setTimeout(() => setCopiedApa(false), 2500);
  };

  // Helper to check if an element is currently a highlighted source in active trace
  const isSourceHighlighted = (id: string) => activeTrace?.sourceIds.includes(id);

  // Helper to render cell contents based on current step mode
  const renderCellContent = (
    cellId: 'A1B1' | 'A1B2' | 'A2B1' | 'A2B2',
    rawValues: number[],
    meanVal: number,
    ssVal: number,
    meanFormulaTex: string,
    meanTooltip: string,
    ssFormulaTex: string,
    ssTooltip: string
  ) => {
    const hasMean = currentStep.cellDisplayMode !== 'raw_only';
    const hasSS = currentStep.cellDisplayMode === 'with_ss' || currentStep.cellDisplayMode === 'full';
    const isStepHighlighted = currentStep.highlightedCells.includes(cellId);
    const isTraceSource = isSourceHighlighted(cellId) || isSourceHighlighted(`mean_${cellId}`) || isSourceHighlighted(`ss_${cellId}`);

    return (
      <div 
        data-trace-id={cellId}
        className={`p-1.5 rounded-lg transition-all duration-300 border flex flex-col justify-between min-h-[58px] ${
          isTraceSource
            ? 'ring-2 ring-[#ef9421] bg-[#fef5e7]/90 border-[#ef9421] shadow-sm scale-[1.01]'
            : isStepHighlighted
            ? 'bg-[#f1f5f7] border-[#6b8390] ring-1 ring-[#b8c7cf] shadow-2xs'
            : 'bg-white border-[#cfd8dd] text-[#344b57]'
        }`}
      >
        {/* Raw numbers (Always visible) */}
        <div>
          <div className="text-[9px] uppercase font-bold text-[#6d7b83] tracking-wider mb-0.5 flex items-center justify-between">
            <span>Punkty surowe</span>
            <span className="font-mono text-[#85868c]"><em>n</em> = 5</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1 font-mono text-[11px] font-semibold text-[#344b57]">
            {rawValues.map((val, idx) => (
              <span 
                key={idx} 
                data-trace-id={`raw_${cellId}_${idx}`}
                className={`px-1 py-0.2 rounded border transition-colors leading-tight ${
                  isSourceHighlighted(`raw_${cellId}_${idx}`)
                    ? 'bg-[#344b57] text-white border-[#253640] font-bold'
                    : 'bg-[#f4f6f7] border-[#cfd8dd]'
                }`}
                title={`Badana osoba #${idx + 1}: ${val} słów`}
              >
                {val}
              </span>
            ))}
          </div>
        </div>

        {/* Calculated M & SS directly in the cell (Always retain data-trace-id for line targeting) */}
        <div className="mt-1 pt-1 border-t border-[#e2e7ea] flex items-center justify-between text-xs">
          <span
            data-trace-id={`mean_${cellId}`}
            onMouseEnter={hasMean ? () => setTraceHover(`mean_${cellId}`, [`raw_${cellId}_0`, `raw_${cellId}_1`, `raw_${cellId}_2`, `raw_${cellId}_3`, `raw_${cellId}_4`], <LatexFormula tex={meanFormulaTex} />) : undefined}
            onMouseLeave={clearTraceHover}
            className={`font-bold font-mono transition-all px-1 rounded ${
              !hasMean
                ? 'text-[11px] text-[#85868c] italic'
                : isSourceHighlighted(`mean_${cellId}`)
                ? 'bg-[#344b57] text-white shadow-xs'
                : 'text-[#344b57] hover:text-[#d97d11] cursor-help'
            }`}
            title={hasMean ? meanTooltip : 'Średnia M (do wyliczenia)'}
          >
            <em>M</em> = {hasMean ? meanVal.toFixed(2).replace('.', ',') : '?'}
          </span>

          <span
            data-trace-id={`ss_${cellId}`}
            onMouseEnter={hasSS ? () => setTraceHover(`ss_${cellId}`, [`mean_${cellId}`, `raw_${cellId}_0`, `raw_${cellId}_1`, `raw_${cellId}_2`, `raw_${cellId}_3`, `raw_${cellId}_4`], <LatexFormula tex={ssFormulaTex} />) : undefined}
            onMouseLeave={clearTraceHover}
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono transition-all ${
              !hasSS
                ? 'text-[#85868c] bg-[#f7f7f7] border-[#cfd8dd]'
                : isSourceHighlighted(`ss_${cellId}`)
                ? 'bg-[#ef9421] text-white border-[#c9740c] shadow-xs ring-2 ring-[#f6cf94]'
                : 'text-[#9a5508] bg-[#fef5e7] border-[#f4cc92] hover:bg-[#fde9cb] cursor-help'
            }`}
            title={hasSS ? ssTooltip : 'SS wewnątrz grupy (do wyliczenia)'}
          >
            <em>SS</em> = {hasSS ? ssVal.toFixed(2).replace('.', ',') : '?'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-3 py-1">
      {/* High-visibility SVG Connection Overlay with white halo and robust stroke */}
      <svg 
        className="pointer-events-none absolute inset-0 w-full h-full z-30" 
        style={{ minHeight: '100%' }}
      >
        <defs>
          <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#344b57" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ef9421" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        {svgLines.map((line, idx) => {
          const dx = line.x2 - line.x1;
          const dy = line.y2 - line.y1;
          const cx1 = line.x1 + dx * 0.25;
          const cy1 = line.y1 + dy * 0.45;
          const cx2 = line.x1 + dx * 0.75;
          const cy2 = line.y2 - dy * 0.15;

          return (
            <g key={idx}>
              {/* White contrast under-stroke halo to ensure high contrast against all cards/borders */}
              <path
                d={`M ${line.x1} ${line.y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${line.x2} ${line.y2}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="4"
                strokeOpacity="0.9"
              />
              {/* Vibrant connection line */}
              <path
                d={`M ${line.x1} ${line.y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${line.x2} ${line.y2}`}
                fill="none"
                stroke="url(#traceGrad)"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              />
              <circle cx={line.x1} cy={line.y1} r="3" fill="#344b57" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx={line.x2} cy={line.y2} r="3.5" fill="#ef9421" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>

      {/* Step Main Banner (Compact, Full Width) */}
      <div className="w-full bg-white border border-[#cfd8dd] rounded-xl px-3.5 py-2 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-extrabold text-[#9a5508] tracking-wider bg-[#fef5e7] px-2 py-0.5 rounded border border-[#f4cc92] shrink-0">
            {isIntroActive ? 'Wprowadzenie' : `Krok ${currentStep.step} / ${STEPS.length}`}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-[#344b57] tracking-tight">
            {isIntroActive
              ? 'Ogólna idea ANOVA 2 × 2 — porównanie sygnału i szumu'
              : currentStep.title}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6d7b83]">
          <span className="hidden sm:inline font-normal">
            {isIntroActive
              ? 'Strategia uczenia się (A) × Długość snu (B)'
              : currentStep.subtitle}
          </span>
          <span className="text-[#cfd8dd] hidden sm:inline">|</span>
          <span className="font-mono text-[#6d7b83] text-[11px] shrink-0 font-semibold"><em>n</em> = 5; <em>N</em> = 20</span>
        </div>
      </div>

      {/* Mobile Steps Toggle Button (Visible on mobile only) */}
      <div className="lg:hidden w-full flex items-center justify-between p-2.5 bg-white border border-[#cfd8dd] rounded-xl shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#85868c] uppercase tracking-wider">Zakładka:</span>
          <span className="text-xs font-bold text-[#344b57]">
            {isIntroActive ? '0. Wprowadzenie' : currentStep.label}
          </span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fef5e7] text-[#9a5508] text-xs font-semibold border border-[#f4cc92] cursor-pointer"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{isMobileSidebarOpen ? 'Zamknij listę' : 'Menu (0–12)'}</span>
        </button>
      </div>

      {/* TOP ROW: Navigation (lg:col-span-2) + Intro (lg:col-span-10) OR 2x2 Matrix & ANOVA Table (lg:col-span-5 + lg:col-span-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch w-full">
        
        {/* Card 1: Navigation Menu (Narrower column: lg:col-span-2) */}
        <aside className={`lg:col-span-2 flex flex-col ${isMobileSidebarOpen ? 'block' : 'hidden lg:flex'}`}>
          <div className="bg-white border border-[#cfd8dd] rounded-xl p-2 shadow-2xs flex-1 flex flex-col justify-between space-y-1.5">
            
            {/* Nav Header & Prev/Next */}
            <div className="pb-1.5 border-b border-[#e2e7ea] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#5a6c77]">
                  Nawigacja
                </span>
                <span className="text-[11px] font-bold text-[#9a5508] bg-[#fef5e7] px-1.5 py-0.2 rounded border border-[#f4cc92]">
                  {isIntroActive ? 'Wstęp' : `${currentStep.step} / ${STEPS.length}`}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  disabled={currentStepIdx === -1}
                  className="flex-1 flex items-center justify-center gap-0.5 py-1 px-1 rounded-lg bg-[#f4f6f7] text-[#344b57] hover:bg-[#e8edf0] disabled:opacity-40 disabled:cursor-not-allowed border border-[#cfd8dd] text-[10.5px] font-semibold transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Wstecz</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStepIdx === STEPS.length - 1}
                  className="flex-1 flex items-center justify-center gap-0.5 py-1 px-1 rounded-lg bg-[#e28b1f] text-white hover:bg-[#cf7a12] disabled:opacity-40 disabled:cursor-not-allowed text-[10.5px] font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Dalej</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-1 rounded-lg bg-[#f4f6f7] text-[#344b57] hover:bg-[#e8edf0] hover:text-[#253640] border border-[#cfd8dd] transition-colors cursor-pointer"
                  title="Wróć do wprowadzenia"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs: Wprowadzenie + 12 Steps */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 flex-1">
              {/* Tab 0: Wprowadzenie */}
              <button
                type="button"
                onClick={() => {
                  setActiveTrace(null);
                  setHoveredFormula(null);
                  setCurrentStepIdx(-1);
                  setIsMobileSidebarOpen(false);
                }}
                title="Wprowadzenie: Ogólna idea ANOVA 2 × 2"
                className={`text-left py-0.5 px-1.5 rounded-md text-[10.5px] font-semibold transition-all flex items-center justify-between border cursor-pointer col-span-2 lg:col-span-1 ${
                  isIntroActive
                    ? 'bg-[#344b57] text-white border-[#253640] shadow-xs ring-1 ring-[#ef9421]/60'
                    : 'bg-[#f4f6f7] text-[#344b57] border-[#cfd8dd] hover:bg-[#e8edf0]'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${
                    isIntroActive
                      ? 'bg-[#ef9421] text-white'
                      : 'bg-[#fef5e7] text-[#9a5508]'
                  }`}>
                    <BookOpen className="w-2.5 h-2.5" />
                  </span>
                  <span className="truncate text-[10px] sm:text-[10.5px]">
                    Wprowadzenie
                  </span>
                </div>
              </button>

              {STEPS.map((s, idx) => {
                const isActive = idx === currentStepIdx;
                const isPassed = currentStepIdx >= 0 && idx < currentStepIdx;

                return (
                  <button
                    key={s.step}
                    onClick={() => {
                      setActiveTrace(null);
                      setHoveredFormula(null);
                      setCurrentStepIdx(idx);
                      setIsMobileSidebarOpen(false);
                    }}
                    title={s.labelText}
                    className={`text-left py-0.5 px-1.5 rounded-md text-[10.5px] font-semibold transition-all flex items-center justify-between border cursor-pointer ${
                      isActive
                        ? 'bg-[#344b57] text-white border-[#253640] shadow-xs ring-1 ring-[#ef9421]/60'
                        : isPassed
                        ? 'bg-[#f4f6f7] text-[#344b57] border-[#cfd8dd] hover:bg-[#e8edf0]'
                        : 'bg-white text-[#6d7b83] border-[#e2e7ea] hover:bg-[#f7f7f7] hover:text-[#344b57]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-mono font-bold shrink-0 ${
                        isActive
                          ? 'bg-[#ef9421] text-white'
                          : isPassed
                          ? 'bg-[#ecf7f4] text-[#1f5e54]'
                          : 'bg-[#f1f4f5] text-[#6d7b83]'
                      }`}>
                        {isPassed ? <Check className="w-2 h-2 stroke-[3]" /> : s.step}
                      </span>
                      <span className="truncate text-[10px] sm:text-[10.5px]">
                        {STEP_SHORT_LABELS[s.step] || s.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </aside>

        {isIntroActive ? (
          /* INTRODUCTION TAB CONTENT (lg:col-span-10) */
          <section
            aria-labelledby="anova-intro-heading"
            className="lg:col-span-10 bg-white border border-[#cfd8dd] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-[#344b57]"
          >
            {/* Opening Block: Example Experiment Setup */}
            <div className="bg-[#f7f7f7] border border-[#dfe5e8] rounded-xl p-3 sm:p-3.5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#344b57]">
                  Jak wyglądał eksperyment użyty w przykładzie?
                </h3>
                <span className="text-[11px] font-mono font-semibold text-[#6d7b83]">
                  Plan międzygrupowy 2 × 2 (<em>N</em> = 20, <em>n</em> = 5 w grupie)
                </span>
              </div>
              <p className="text-[#455a66]">
                Badano, jak metoda nauki i długość snu wpływają na pamięć. <strong className="font-semibold text-[#344b57]">20 uczestników</strong> przydzielono losowo do <strong className="font-semibold text-[#344b57]">4 odrębnych grup</strong> (po <em>n</em> = 5 osób): każda osoba zapamiętywała listę słów, stosując <strong className="font-semibold text-[#344b57]">ponowne czytanie</strong> albo <strong className="font-semibold text-[#344b57]">testowanie się</strong>, a po nauce spała <strong className="font-semibold text-[#344b57]">krótko</strong> lub <strong className="font-semibold text-[#344b57]">długo</strong>. Następnie wszyscy przystąpili do testu sprawdzającego <strong className="font-semibold text-[#344b57]">liczbę zapamiętanych słów</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-0.5 text-[11.5px]">
                <div className="bg-white border border-[#dfe5e8] rounded-lg px-2.5 py-1.5">
                  <span className="font-bold text-[#344b57]">Czynnik <em>A</em> (Strategia):</span>{' '}
                  <span className="text-[#5a6c77]"><em>A</em><sub>1</sub> ponowne czytanie vs <em>A</em><sub>2</sub> testowanie się</span>
                </div>
                <div className="bg-white border border-[#dfe5e8] rounded-lg px-2.5 py-1.5">
                  <span className="font-bold text-[#1f5e54]">Czynnik <em>B</em> (Długość snu):</span>{' '}
                  <span className="text-[#5a6c77]"><em>B</em><sub>1</sub> krótki sen vs <em>B</em><sub>2</sub> długi sen</span>
                </div>
                <div className="bg-white border border-[#f4cc92] rounded-lg px-2.5 py-1.5">
                  <span className="font-bold text-[#9a5508]">Zmienna zależna (<em>Y</em>):</span>{' '}
                  <span className="text-[#5a6c77]">liczba poprawnie zapamiętanych słów</span>
                </div>
              </div>
            </div>

            {/* Lead + Ratio Strip */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#e2e7ea]">
              <div className="space-y-1 flex-1 min-w-0">
                <h3 id="anova-intro-heading" className="text-sm sm:text-base font-bold text-[#344b57]">
                  Idea analizy wariancji ANOVA 2 × 2: Sygnał vs Szum
                </h3>
                <p className="text-[#455a66]">
                  Test <em>F</em> w analizie wariancji opiera się na porównaniu dwóch rodzajów zmienności liczby zapamiętanych słów: <strong className="font-semibold text-[#344b57]">wariancji międzygrupowej</strong> (potencjalnego sygnału) oraz <strong className="font-semibold text-[#344b57]">wariancji wewnątrzgrupowej</strong> (naturalnego szumu).
                </p>
              </div>

              <div className="bg-[#f7f7f7] border border-[#cfd8dd] rounded-lg px-4 py-2.5 text-xs text-[#344b57] lg:shrink-0 text-center w-full lg:w-auto">
                <div className="text-[10px] uppercase tracking-wider font-sans font-semibold text-[#6d7b83] mb-1">
                  Logika testu <em>F</em>
                </div>
                <LatexFormula
                  tex="F = \frac{\text{Sygnał (międzygrupowa)}}{\text{Szum (wewnątrzgrupowa)}}"
                  displayMode
                  className="text-[11.5px] sm:text-xs text-[#344b57]"
                />
              </div>
            </div>

            {/* 1. Within-group vs 2. Between-group */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Column 1: Within-group variance */}
              <div className="lg:col-span-5 bg-[#f7f7f7] border border-[#dfe5e8] rounded-xl p-3.5 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#344b57]">
                      1. Wariancja wewnątrzgrupowa
                    </h4>
                    <span className="text-[11px] font-medium text-[#6d7b83] shrink-0">
                      Szum / błąd pomiaru
                    </span>
                  </div>
                  <p className="text-[#455a66]">
                    Pokazuje, jak bardzo różnią się od siebie osoby znajdujące się w dokładnie tych samych warunkach. Jeśli weźmiemy wyłącznie grupę stosującą <strong className="font-semibold text-[#344b57]">ponowne czytanie po krótkim śnie</strong> (<em>A</em><sub>1</sub><em>B</em><sub>1</sub>), nie każda osoba zapamięta tyle samo słów (<span className="font-mono tabular-nums text-[#344b57]">6, 8, 7, 9, 10</span>) – jedni mają z natury lepszą pamięć lub byli bardziej wypoczęci, inni bardziej podatni na stres.
                  </p>
                </div>
                <p className="text-xs text-[#5a6c77] pt-2 border-t border-[#dfe5e8]">
                  Ta zmienność nie wynika z eksperymentu, lecz z indywidualnych różnic między ludźmi. W teście <em>F</em> służy jako <strong className="font-semibold text-[#344b57]">punkt odniesienia i miarka przypadku</strong>.
                </p>
              </div>

              {/* Column 2: Between-group variance */}
              <div className="lg:col-span-7 bg-[#f7f7f7] border border-[#dfe5e8] rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#344b57]">
                    2. Wariancja międzygrupowa
                  </h4>
                  <span className="text-[11px] font-semibold text-[#9a5508] shrink-0">
                    Sygnał / działanie czynników
                  </span>
                </div>
                <p className="text-[#455a66]">
                  Pokazuje, jak bardzo różnią się średnie wyniki pomiędzy czterema grupami eksperymentalnymi (w planie 2 × 2 mamy 4 takie grupy). Całkowitą wariancję międzygrupową rozbijamy na trzy osobne źródła:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div className="bg-white border border-[#dfe5e8] rounded-lg p-2.5 space-y-1">
                    <div className="text-xs font-bold text-[#344b57]">
                      Czynnik <em>A</em> (Strategia)
                    </div>
                    <p className="text-[11.5px] leading-snug text-[#5a6c77]">
                      Na ile średnie różnią się tylko dlatego, że zmieniamy metodę nauki (<strong>ponowne czytanie</strong> vs <strong>testowanie się</strong>).
                    </p>
                  </div>

                  <div className="bg-white border border-[#dfe5e8] rounded-lg p-2.5 space-y-1">
                    <div className="text-xs font-bold text-[#1f5e54]">
                      Czynnik <em>B</em> (Długość snu)
                    </div>
                    <p className="text-[11.5px] leading-snug text-[#5a6c77]">
                      Na ile średnie różnią się tylko dlatego, że zmieniamy czas snu (<strong>krótki sen</strong> vs <strong>długi sen</strong>).
                    </p>
                  </div>

                  <div className="bg-white border border-[#f4cc92] rounded-lg p-2.5 space-y-1">
                    <div className="text-xs font-bold text-[#9a5508]">
                      Interakcja (<em>A</em> × <em>B</em>)
                    </div>
                    <p className="text-[11.5px] leading-snug text-[#5a6c77]">
                      Specyficzna różnica między 4 średnimi, której nie wyjaśnia proste dodanie efektu strategii i snu: przy <strong>ponownym czytaniu po krótkim śnie</strong> wynik spada do <span className="font-mono tabular-nums font-semibold text-[#344b57]">8,00</span>, podczas gdy testowanie chroni pamięć (<span className="font-mono tabular-nums font-semibold text-[#344b57]">13,00</span>).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. How Test F combines them */}
            <div className="pt-3 border-t border-[#e2e7ea] space-y-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#344b57]">
                  Jak test <em>F</em> łączy oba rodzaje wariancji?
                </h4>
                <span className="text-xs text-[#6d7b83]">
                  Każdy z trzech testów <em>F</em> (dla strategii <em>A</em>, snu <em>B</em> i interakcji <em>A</em> × <em>B</em>) dzieli odpowiednią wariancję międzygrupową przez wariancję wewnątrzgrupową.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#fef5e7]/70 border border-[#f4cc92] rounded-lg p-3 space-y-1">
                  <div className="text-xs font-bold text-[#9a5508]">
                    Wysoki wynik <em>F</em> (istotna interakcja)
                  </div>
                  <p className="text-xs text-[#455a66] leading-relaxed">
                    Specyficzne różnice między średnimi czterech grup (wynikające ze splotu strategii uczenia się i długości snu) są znacznie większe niż naturalny rozrzut wyników wewnątrz pojedynczych grup. Badani w jednej grupie osiągają zbliżone wyniki, a średnie układają się w wyraźny, nieprzypadkowy wzór.
                  </p>
                </div>

                <div className="bg-[#f7f7f7] border border-[#dfe5e8] rounded-lg p-3 space-y-1">
                  <div className="text-xs font-bold text-[#344b57]">
                    Niski wynik <em>F</em> (brak interakcji)
                  </div>
                  <p className="text-xs text-[#455a66] leading-relaxed">
                    Rozrzut wyników wewnątrz samych grup jest na tyle duży, że ewentualne różnice między średnimi grup giną w naturalnym szumie – nie da się ich odróżnić od zwykłego zbiegu okoliczności.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-xs text-[#5a6c77]">
                  <strong className="font-semibold text-[#344b57]">Podsumowanie:</strong> Wariancja wewnątrzgrupowa wyznacza próg, który musi pokonać wariancja międzygrupowa. Interakcję stwierdzamy dopiero wtedy, gdy nietypowe przesunięcie średnich w kombinacjach strategii i snu jest wyraźnie silniejsze niż indywidualne różnice wewnątrz grup.
                </p>

                <button
                  type="button"
                  onClick={() => setCurrentStepIdx(0)}
                  className="px-4 py-2 rounded-lg bg-[#e28b1f] hover:bg-[#cf7a12] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto flex items-center gap-1.5"
                >
                  <span>Przejdź do obliczeń (Krok 1)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
        {/* Card 2: Macierz 2x2 z danymi surowymi, M i SS (Wider: lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white border border-[#cfd8dd] rounded-xl p-2.5 shadow-2xs flex-1 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between gap-1 text-xs pb-1.5 border-b border-[#e2e7ea]">
              <span className="font-bold text-[#344b57] truncate">
                Macierz 2 × 2: Dane, <em>M</em> oraz <em>SS</em>:
              </span>
              <span className="text-[10px] text-[#9a5508] font-semibold shrink-0">
                Najedź na <em>M</em> / <em>SS</em>
              </span>
            </div>

            {/* Table wrapper with padding to ensure outer borders are never clipped */}
            <div className="w-full overflow-x-auto p-0.5">
              <table className="w-full text-xs text-center border-separate border-spacing-0 border border-[#cfd8dd] rounded-lg overflow-hidden shadow-2xs">
                <thead>
                  <tr className="text-[#344b57] bg-[#f4f6f7] font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-1.5 text-left border-b border-r border-[#cfd8dd] w-1/4">
                      Strategia (<em>A</em>)
                    </th>
                    <th className="p-1.5 border-b border-r border-[#cfd8dd] w-1/4">
                      <em>B</em><sub>1</sub>: Krótki
                    </th>
                    <th className="p-1.5 border-b border-r border-[#cfd8dd] w-1/4">
                      <em>B</em><sub>2</sub>: Długi
                    </th>
                    <th className="p-1.5 border-b border-[#cfd8dd] w-1/4 bg-[#e9eff2] text-[#253640] font-extrabold">
                      Brzegowe <em>A</em>
                    </th>
                  </tr>
                </thead>
                    <tbody className="text-xs">
                      {/* Row 1: Czytanie */}
                      <tr>
                        <td className="p-1.5 text-left font-sans font-semibold text-[#344b57] bg-[#f7f9fa] border-b border-r border-[#cfd8dd]">
                          <em>A</em><sub>1</sub>: Czytanie
                        </td>
                        <td className="p-1 border-b border-r border-[#cfd8dd]">
                          {renderCellContent(
                            'A1B1', 
                            [6, 8, 7, 9, 10], 
                            8, 
                            10,
                            'M_{A_1 B_1} = \\frac{6 + 8 + 7 + 9 + 10}{5} = 8{,}00',
                            'M(A₁B₁) = (6 + 8 + 7 + 9 + 10) / 5 = 8,00',
                            'SS_{A_1 B_1} = (6-8)^2 + (8-8)^2 + (7-8)^2 + (9-8)^2 + (10-8)^2 = 4 + 0 + 1 + 1 + 4 = 10{,}00',
                            'SS(A₁B₁) = (6−8)² + (8−8)² + (7−8)² + (9−8)² + (10−8)² = 10,00'
                          )}
                        </td>
                        <td className="p-1 border-b border-r border-[#cfd8dd]">
                          {renderCellContent(
                            'A1B2', 
                            [12, 14, 13, 15, 16], 
                            14, 
                            10,
                            'M_{A_1 B_2} = \\frac{12 + 14 + 13 + 15 + 16}{5} = 14{,}00',
                            'M(A₁B₂) = (12 + 14 + 13 + 15 + 16) / 5 = 14,00',
                            'SS_{A_1 B_2} = (12-14)^2 + (14-14)^2 + (13-14)^2 + (15-14)^2 + (16-14)^2 = 4 + 0 + 1 + 1 + 4 = 10{,}00',
                            'SS(A₁B₂) = (12−14)² + (14−14)² + (13−14)² + (15−14)² + (16−14)² = 10,00'
                          )}
                        </td>
                        <td 
                          data-trace-id="margA1"
                          className={`p-1.5 transition-all duration-300 font-mono border-b border-[#cfd8dd] ${
                            isSourceHighlighted('margA1')
                              ? 'bg-[#344b57] text-white font-black ring-2 ring-[#ef9421] shadow-xs'
                              : currentStep.highlightedCells.includes('margA')
                              ? 'bg-[#e3ebef] text-[#253640] font-black ring-2 ring-[#344b57]'
                              : 'bg-[#f4f7f8] text-[#344b57]'
                          }`}
                        >
                          {currentStep.cellDisplayMode !== 'raw_only' ? (
                            <div 
                              onMouseEnter={() => setTraceHover('margA1', ['mean_A1B1', 'mean_A1B2'], <>Średnia brzegowa (Czytanie): <LatexFormula tex="M_{A_1} = \frac{8{,}00 + 14{,}00}{2} = 11{,}00" /></>)}
                              onMouseLeave={clearTraceHover}
                              className="cursor-help space-y-0.5"
                              title="Średnia brzegowa A₁ (Czytanie) = 11,00"
                            >
                              <span className="block text-sm font-bold"><em>M</em> = 11,00</span>
                              <span className={`text-[9px] font-sans block ${isSourceHighlighted('margA1') ? 'text-[#dce4e8]' : 'text-[#6d7b83]'}`}>
                                (8 + 14) / 2
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#85868c] text-xs font-sans italic">?</span>
                          )}
                        </td>
                      </tr>

                      {/* Row 2: Testowanie */}
                      <tr>
                        <td className="p-1.5 text-left font-sans font-semibold text-[#344b57] bg-[#f7f9fa] border-b border-r border-[#cfd8dd]">
                          <em>A</em><sub>2</sub>: Testowanie
                        </td>
                        <td className="p-1 border-b border-r border-[#cfd8dd]">
                          {renderCellContent(
                            'A2B1', 
                            [11, 13, 12, 14, 15], 
                            13, 
                            10,
                            'M_{A_2 B_1} = \\frac{11 + 13 + 12 + 14 + 15}{5} = 13{,}00',
                            'M(A₂B₁) = (11 + 13 + 12 + 14 + 15) / 5 = 13,00',
                            'SS_{A_2 B_1} = (11-13)^2 + (13-13)^2 + (12-13)^2 + (14-13)^2 + (15-13)^2 = 4 + 0 + 1 + 1 + 4 = 10{,}00',
                            'SS(A₂B₁) = (11−13)² + (13−13)² + (12−13)² + (14−13)² + (15−13)² = 10,00'
                          )}
                        </td>
                        <td className="p-1 border-b border-r border-[#cfd8dd]">
                          {renderCellContent(
                            'A2B2', 
                            [11, 14, 12, 15, 13], 
                            13, 
                            10,
                            'M_{A_2 B_2} = \\frac{11 + 14 + 12 + 15 + 13}{5} = 13{,}00',
                            'M(A₂B₂) = (11 + 14 + 12 + 15 + 13) / 5 = 13,00',
                            'SS_{A_2 B_2} = (11-13)^2 + (14-13)^2 + (12-13)^2 + (15-13)^2 + (13-13)^2 = 4 + 1 + 1 + 4 + 0 = 10{,}00',
                            'SS(A₂B₂) = (11−13)² + (14−13)² + (12−13)² + (15−13)² + (13−13)² = 10,00'
                          )}
                        </td>
                        <td 
                          data-trace-id="margA2"
                          className={`p-1.5 transition-all duration-300 font-mono border-b border-[#cfd8dd] ${
                            isSourceHighlighted('margA2')
                              ? 'bg-[#344b57] text-white font-black ring-2 ring-[#ef9421] shadow-xs'
                              : currentStep.highlightedCells.includes('margA')
                              ? 'bg-[#e3ebef] text-[#253640] font-black ring-2 ring-[#344b57]'
                              : 'bg-[#f4f7f8] text-[#344b57]'
                          }`}
                        >
                          {currentStep.cellDisplayMode !== 'raw_only' ? (
                            <div 
                              onMouseEnter={() => setTraceHover('margA2', ['mean_A2B1', 'mean_A2B2'], <>Średnia brzegowa (Testowanie): <LatexFormula tex="M_{A_2} = \frac{13{,}00 + 13{,}00}{2} = 13{,}00" /></>)}
                              onMouseLeave={clearTraceHover}
                              className="cursor-help space-y-0.5"
                              title="Średnia brzegowa A₂ (Testowanie) = 13,00"
                            >
                              <span className="block text-sm font-bold"><em>M</em> = 13,00</span>
                              <span className={`text-[9px] font-sans block ${isSourceHighlighted('margA2') ? 'text-[#dce4e8]' : 'text-[#6d7b83]'}`}>
                                (13 + 13) / 2
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#85868c] text-xs font-sans italic">?</span>
                          )}
                        </td>
                      </tr>

                      {/* Marginal Row B + Sums of Squares Integration */}
                      <tr>
                        <td className="p-1.5 text-left font-sans font-bold text-[#1f5e54] bg-[#ecf7f4] border-b border-r border-[#cfd8dd]">
                          <div>Brzegowe <em>B</em></div>
                        </td>
                        <td 
                          data-trace-id="margB1"
                          className={`p-1.5 transition-all duration-300 font-mono border-b border-r border-[#cfd8dd] ${
                            isSourceHighlighted('margB1')
                              ? 'bg-[#2a7b6f] text-white font-black ring-2 ring-[#84c5ba] shadow-xs'
                              : currentStep.highlightedCells.includes('margB')
                              ? 'bg-[#d8efe9] text-[#15453d] font-black ring-2 ring-[#2a7b6f]'
                              : 'bg-[#f3faf8] text-[#1f5e54]'
                          }`}
                        >
                          {currentStep.cellDisplayMode !== 'raw_only' ? (
                            <div 
                              onMouseEnter={() => setTraceHover('margB1', ['mean_A1B1', 'mean_A2B1'], <>Średnia brzegowa (Krótki sen): <LatexFormula tex="M_{B_1} = \frac{8{,}00 + 13{,}00}{2} = 10{,}50" /></>)}
                              onMouseLeave={clearTraceHover}
                              className="cursor-help space-y-0.5"
                              title="Średnia brzegowa B₁ (Krótki sen) = 10,50"
                            >
                              <span className="block text-sm font-bold"><em>M</em> = 10,50</span>
                              <span className={`text-[9px] font-sans block ${isSourceHighlighted('margB1') ? 'text-[#d8efe9]' : 'text-[#6d7b83]'}`}>
                                (8 + 13) / 2
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#85868c] text-xs font-sans italic">?</span>
                          )}
                        </td>
                        <td 
                          data-trace-id="margB2"
                          className={`p-1.5 transition-all duration-300 font-mono border-b border-r border-[#cfd8dd] ${
                            isSourceHighlighted('margB2')
                              ? 'bg-[#2a7b6f] text-white font-black ring-2 ring-[#84c5ba] shadow-xs'
                              : currentStep.highlightedCells.includes('margB')
                              ? 'bg-[#d8efe9] text-[#15453d] font-black ring-2 ring-[#2a7b6f]'
                              : 'bg-[#f3faf8] text-[#1f5e54]'
                          }`}
                        >
                          {currentStep.cellDisplayMode !== 'raw_only' ? (
                            <div 
                              onMouseEnter={() => setTraceHover('margB2', ['mean_A1B2', 'mean_A2B2'], <>Średnia brzegowa (Długi sen): <LatexFormula tex="M_{B_2} = \frac{14{,}00 + 13{,}00}{2} = 13{,}50" /></>)}
                              onMouseLeave={clearTraceHover}
                              className="cursor-help space-y-0.5"
                              title="Średnia brzegowa B₂ (Długi sen) = 13,50"
                            >
                              <span className="block text-sm font-bold"><em>M</em> = 13,50</span>
                              <span className={`text-[9px] font-sans block ${isSourceHighlighted('margB2') ? 'text-[#d8efe9]' : 'text-[#6d7b83]'}`}>
                                (14 + 13) / 2
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#85868c] text-xs font-sans italic">?</span>
                          )}
                        </td>

                        {/* Grand Summary Cell */}
                        <td 
                          data-trace-id="grandMean"
                          className={`p-1.5 transition-all duration-300 font-mono border-b border-[#cfd8dd] ${
                            isSourceHighlighted('grandMean')
                              ? 'bg-[#e28b1f] text-white font-black ring-2 ring-[#f4cc92] shadow-xs'
                              : currentStep.highlightedCells.includes('grandMean')
                              ? 'bg-[#fde9cb] text-[#7c4305] font-black ring-2 ring-[#ef9421]'
                              : 'bg-[#fef5e7] text-[#8a4b06] font-bold'
                          }`}
                        >
                          {currentStep.cellDisplayMode !== 'raw_only' ? (
                            <div 
                              onMouseEnter={() => setTraceHover('grandMean', ['mean_A1B1', 'mean_A1B2', 'mean_A2B1', 'mean_A2B2', 'margA1', 'margA2', 'margB1', 'margB2'], <>Średnia ogólna badania: <LatexFormula tex="M_{\text{ogólna}} = \frac{8{,}00 + 14{,}00 + 13{,}00 + 13{,}00}{4} = 12{,}00" /></>)}
                              onMouseLeave={clearTraceHover}
                              className="cursor-help space-y-0.5"
                              title="Średnia ogólna M = 12,00"
                            >
                              <span className="block text-sm font-black"><em>M</em> = 12,00</span>
                              <span className={`text-[9px] font-sans block ${isSourceHighlighted('grandMean') ? 'text-[#fef5e7]' : 'text-[#6d7b83]'}`}>
                                240 / 20
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#85868c] text-xs font-sans italic">?</span>
                          )}
                        </td>
                      </tr>

                      {/* Summary SS Row embedded directly into the table */}
                      <tr className="bg-[#f4f6f7] font-mono text-[10px]">
                        <td className="p-1 text-left font-sans font-bold text-[#344b57] border-r border-[#cfd8dd]">
                          Sumy <em>SS</em>
                        </td>
                        <td 
                          data-trace-id="table_ssB"
                          colSpan={2}
                          onMouseEnter={() => setTraceHover('table_ssB', ['margB1', 'margB2', 'grandMean'], <><LatexFormula tex="SS_B = 10 \cdot \big[(10{,}50 - 12{,}00)^2 + (13{,}50 - 12{,}00)^2\big] = 45{,}00" /> (ze średnich brzegowych snu)</>)}
                          onMouseLeave={clearTraceHover}
                          className={`p-1 border-r border-[#cfd8dd] cursor-help transition-all ${
                            currentStep.step >= 5 ? 'text-[#1f5e54] font-bold bg-[#ecf7f4]' : 'text-[#85868c]'
                          }`}
                        >
                          {currentStep.step >= 5 ? (
                            <span><em>SS</em><sub><em>B</em></sub> (Sen) = 45,00</span>
                          ) : (
                            <span className="italic"><em>SS</em><sub><em>B</em></sub> = ?</span>
                          )}
                        </td>
                        <td 
                          data-trace-id="table_ssA"
                          onMouseEnter={() => setTraceHover('table_ssA', ['margA1', 'margA2', 'grandMean'], <><LatexFormula tex="SS_A = 10 \cdot \big[(11{,}00 - 12{,}00)^2 + (13{,}00 - 12{,}00)^2\big] = 20{,}00" /> (ze średnich brzegowych strategii)</>)}
                          onMouseLeave={clearTraceHover}
                          className={`p-1 cursor-help transition-all ${
                            currentStep.step >= 4 ? 'text-[#253640] font-bold bg-[#e9eff2]' : 'text-[#85868c]'
                          }`}
                        >
                          {currentStep.step >= 4 ? (
                            <span><em>SS</em><sub><em>A</em></sub> = 20,00</span>
                          ) : (
                            <span className="italic"><em>SS</em><sub><em>A</em></sub> = ?</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive ANOVA Table */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-white border border-[#cfd8dd] rounded-xl p-2.5 shadow-2xs flex-1 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#e2e7ea]">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-[#ef9421]" />
                    <h3 className="text-xs font-bold text-[#344b57]">Tabela ANOVA (Na żywo)</h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#6d7b83]">
                    <em>F</em><sub>kryt</sub>(1, 16) = 4,49
                  </span>
                </div>

                <div className="w-full overflow-x-auto p-0.5">
                  <table className="w-full text-[11px] text-left border-separate border-spacing-0 border border-[#cfd8dd] rounded-lg overflow-hidden shadow-2xs font-mono">
                    <thead>
                      <tr className="bg-[#f4f6f7] text-[#344b57] font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-1.5 px-2 border-b border-r border-[#cfd8dd]">Źródło</th>
                        <th className="py-1.5 px-1.5 text-right border-b border-r border-[#cfd8dd]"><em>SS</em></th>
                        <th className="py-1.5 px-1.5 text-right border-b border-r border-[#cfd8dd]"><em>df</em></th>
                        <th className="py-1.5 px-1.5 text-right border-b border-r border-[#cfd8dd]"><em>MS</em></th>
                        <th className="py-1.5 px-1.5 text-right border-b border-r border-[#cfd8dd]"><em>F</em></th>
                        <th className="py-1.5 px-1.5 text-right border-b border-r border-[#cfd8dd]"><em>p</em></th>
                        <th className="py-1.5 px-2 text-right font-bold text-[#9a5508] border-b border-[#cfd8dd]">η<sub>p</sub><sup>2</sup></th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[11px]">
                      
                      {/* Row A: Strategia */}
                      <tr className={`transition-colors ${
                        currentStep.tableProgress.activeRow === 'A' 
                          ? 'bg-[#e9eff2] font-bold text-[#253640]' 
                          : 'text-[#344b57]'
                      }`}>
                        <td className="py-1.5 px-2 font-sans font-semibold border-b border-r border-[#cfd8dd]">
                          <em>A</em>: Strategia
                        </td>
                        <td 
                          data-trace-id="cell_SS_A"
                          className="py-1.5 px-1.5 text-right font-bold text-[#344b57] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_SS_A', ['margA1', 'margA2', 'grandMean'], <LatexFormula tex="SS_A = 10 \cdot \big[(11{,}00 - 12{,}00)^2 + (13{,}00 - 12{,}00)^2\big] = 10 \cdot 2{,}00 = 20{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="SS(A) = 20,00 (ze średnich brzegowych A₁ i A₂)"
                        >
                          {currentStep.tableProgress.showA_SS ? (
                            <span className={currentStep.step === 4 ? 'bg-[#d5e0e6] text-[#253640] px-1 py-0.2 rounded border border-[#344b57] font-black animate-pulse' : ''}>
                              20,00
                            </span>
                          ) : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_df_A"
                          className="py-1.5 px-1.5 text-right text-[#6d7b83] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_df_A', ['margA1', 'margA2'], <LatexFormula tex="df_A = a - 1 = 2 - 1 = 1" />)}
                          onMouseLeave={clearTraceHover}
                          title="df(A) = 1"
                        >
                          {currentStep.tableProgress.showDF ? '1' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_MS_A"
                          className="py-1.5 px-1.5 text-right text-[#344b57] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_MS_A', ['cell_SS_A', 'cell_df_A'], <LatexFormula tex="MS_A = \frac{SS_A}{df_A} = \frac{20{,}00}{1} = 20{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="MS(A) = 20,00"
                        >
                          {currentStep.tableProgress.showMS ? '20,00' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_F_A"
                          className="py-1.5 px-1.5 text-right text-[#1f5e54] font-bold cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_F_A', ['cell_MS_A', 'cell_MS_err'], <LatexFormula tex="F_A = \frac{MS_A}{MS_{\text{błąd}}} = \frac{20{,}00}{2{,}50} = 8{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="F(A) = 8,00"
                        >
                          {currentStep.tableProgress.showF_P ? '8,00' : '—'}
                        </td>
                        <td 
                          className="py-1.5 px-1.5 text-right text-[#1f5e54] font-semibold cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setHoveredFormula(<><LatexFormula tex="p(F = 8{,}00;\ df = 1,\, 16) = 0{,}012" /> (istotny)</>)}
                          onMouseLeave={clearTraceHover}
                          title="p = 0,012"
                        >
                          {currentStep.tableProgress.showF_P ? '0,012' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_eta_A"
                          className="py-1.5 px-2 text-right font-bold text-[#9a5508] cursor-help border-b border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_eta_A', ['cell_SS_A', 'cell_SS_err'], <LatexFormula tex="\text{η}_{p(A)}^2 = \frac{20{,}00}{20{,}00 + 40{,}00} = \frac{20}{60} = 0{,}33" />)}
                          onMouseLeave={clearTraceHover}
                          title="η²ₚ = 0,33"
                        >
                          {currentStep.tableProgress.showEta ? '0,33' : '—'}
                        </td>
                      </tr>

                      {/* Row B: Sen */}
                      <tr className={`transition-colors ${
                        currentStep.tableProgress.activeRow === 'B' 
                          ? 'bg-[#ecf7f4] font-bold text-[#15453d]' 
                          : 'text-[#344b57]'
                      }`}>
                        <td className="py-1.5 px-2 font-sans font-semibold border-b border-r border-[#cfd8dd]">
                          <em>B</em>: Sen
                        </td>
                        <td 
                          data-trace-id="cell_SS_B"
                          className="py-1.5 px-1.5 text-right font-bold text-[#1f5e54] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_SS_B', ['margB1', 'margB2', 'grandMean'], <LatexFormula tex="SS_B = 10 \cdot \big[(10{,}50 - 12{,}00)^2 + (13{,}50 - 12{,}00)^2\big] = 10 \cdot 4{,}50 = 45{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="SS(B) = 45,00 (ze średnich brzegowych B₁ i B₂)"
                        >
                          {currentStep.tableProgress.showB_SS ? (
                            <span className={currentStep.step === 5 ? 'bg-[#cdebe3] text-[#15453d] px-1 py-0.2 rounded border border-[#2a7b6f] font-black animate-pulse' : ''}>
                              45,00
                            </span>
                          ) : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_df_B"
                          className="py-1.5 px-1.5 text-right text-[#6d7b83] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_df_B', ['margB1', 'margB2'], <LatexFormula tex="df_B = b - 1 = 2 - 1 = 1" />)}
                          onMouseLeave={clearTraceHover}
                          title="df(B) = 1"
                        >
                          {currentStep.tableProgress.showDF ? '1' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_MS_B"
                          className="py-1.5 px-1.5 text-right text-[#344b57] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_MS_B', ['cell_SS_B', 'cell_df_B'], <LatexFormula tex="MS_B = \frac{SS_B}{df_B} = \frac{45{,}00}{1} = 45{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="MS(B) = 45,00"
                        >
                          {currentStep.tableProgress.showMS ? '45,00' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_F_B"
                          className="py-1.5 px-1.5 text-right text-[#1f5e54] font-bold cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_F_B', ['cell_MS_B', 'cell_MS_err'], <LatexFormula tex="F_B = \frac{MS_B}{MS_{\text{błąd}}} = \frac{45{,}00}{2{,}50} = 18{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="F(B) = 18,00"
                        >
                          {currentStep.tableProgress.showF_P ? '18,00' : '—'}
                        </td>
                        <td 
                          className="py-1.5 px-1.5 text-right text-[#1f5e54] font-semibold cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setHoveredFormula(<><LatexFormula tex="p(F = 18{,}00;\ df = 1,\, 16) < 0{,}001" /> (istotny)</>)}
                          onMouseLeave={clearTraceHover}
                          title="p < 0,001"
                        >
                          {currentStep.tableProgress.showF_P ? '< 0,001' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_eta_B"
                          className="py-1.5 px-2 text-right font-bold text-[#9a5508] cursor-help border-b border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_eta_B', ['cell_SS_B', 'cell_SS_err'], <LatexFormula tex="\text{η}_{p(B)}^2 = \frac{45{,}00}{45{,}00 + 40{,}00} = \frac{45}{85} = 0{,}53" />)}
                          onMouseLeave={clearTraceHover}
                          title="η²ₚ = 0,53"
                        >
                          {currentStep.tableProgress.showEta ? '0,53' : '—'}
                        </td>
                      </tr>

                      {/* Row AxB: Interakcja */}
                      <tr className={`transition-colors ${
                        currentStep.tableProgress.activeRow === 'AxB' 
                          ? 'bg-[#fef5e7] font-bold text-[#7c4305]' 
                          : 'text-[#344b57]'
                      }`}>
                        <td className="py-1.5 px-2 font-sans font-semibold border-b border-r border-[#cfd8dd]">
                          <em>A</em> × <em>B</em> (Interakcja)
                        </td>
                        <td 
                          data-trace-id="cell_SS_AxB"
                          className="py-1.5 px-1.5 text-right font-bold text-[#c9700c] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_SS_AxB', ['mean_A1B1', 'mean_A1B2', 'mean_A2B1', 'mean_A2B2', 'cell_SS_A', 'cell_SS_B'], <LatexFormula tex="SS_{A \times B} = SS_{\text{komórek}}(110{,}00) - SS_A(20{,}00) - SS_B(45{,}00) = 45{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="SS(A × B) = 45,00 (ze średnich komórek oraz SS(A) i SS(B))"
                        >
                          {currentStep.tableProgress.showAxB_SS ? (
                            <span className={currentStep.step === 6 ? 'bg-[#fde4be] text-[#7c4305] px-1 py-0.2 rounded border border-[#ef9421] font-black animate-pulse' : ''}>
                              45,00
                            </span>
                          ) : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_df_AxB"
                          className="py-1.5 px-1.5 text-right text-[#6d7b83] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_df_AxB', ['cell_df_A', 'cell_df_B'], <LatexFormula tex="df_{A \times B} = (a - 1)(b - 1) = 1 \cdot 1 = 1" />)}
                          onMouseLeave={clearTraceHover}
                          title="df(A × B) = 1"
                        >
                          {currentStep.tableProgress.showDF ? '1' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_MS_AxB"
                          className="py-1.5 px-1.5 text-right text-[#344b57] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_MS_AxB', ['cell_SS_AxB', 'cell_df_AxB'], <LatexFormula tex="MS_{A \times B} = \frac{SS_{A \times B}}{df_{A \times B}} = \frac{45{,}00}{1} = 45{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="MS(A × B) = 45,00"
                        >
                          {currentStep.tableProgress.showMS ? '45,00' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_F_AxB"
                          className="py-1.5 px-1.5 text-right text-[#1f5e54] font-bold cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_F_AxB', ['cell_MS_AxB', 'cell_MS_err'], <LatexFormula tex="F_{A \times B} = \frac{MS_{A \times B}}{MS_{\text{błąd}}} = \frac{45{,}00}{2{,}50} = 18{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="F(A × B) = 18,00"
                        >
                          {currentStep.tableProgress.showF_P ? '18,00' : '—'}
                        </td>
                        <td 
                          className="py-1.5 px-1.5 text-right text-[#1f5e54] font-semibold cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setHoveredFormula(<><LatexFormula tex="p(F = 18{,}00;\ df = 1,\, 16) < 0{,}001" /> (interakcja istotna statystycznie)</>)}
                          onMouseLeave={clearTraceHover}
                          title="p < 0,001"
                        >
                          {currentStep.tableProgress.showF_P ? '< 0,001' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_eta_AxB"
                          className="py-1.5 px-2 text-right font-bold text-[#9a5508] cursor-help border-b border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_eta_AxB', ['cell_SS_AxB', 'cell_SS_err'], <LatexFormula tex="\text{η}_{p(A \times B)}^2 = \frac{45{,}00}{45{,}00 + 40{,}00} = \frac{45}{85} = 0{,}53" />)}
                          onMouseLeave={clearTraceHover}
                          title="η²ₚ = 0,53"
                        >
                          {currentStep.tableProgress.showEta ? '0,53' : '—'}
                        </td>
                      </tr>

                      {/* Row Error */}
                      <tr className={`transition-colors ${
                        currentStep.tableProgress.activeRow === 'err' 
                          ? 'bg-[#f4f7f8] font-bold text-[#253640]' 
                          : 'text-[#6d7b83]'
                      }`}>
                        <td className="py-1.5 px-2 font-sans border-b border-r border-[#cfd8dd]">
                          Błąd (wewnątrz)
                        </td>
                        <td 
                          data-trace-id="cell_SS_err"
                          className="py-1.5 px-1.5 text-right font-medium text-[#344b57] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_SS_err', ['ss_A1B1', 'ss_A1B2', 'ss_A2B1', 'ss_A2B2'], <><LatexFormula tex="SS_{\text{błąd}} = 10{,}00 + 10{,}00 + 10{,}00 + 10{,}00 = 40{,}00" /> (suma wariancji wewnątrz 4 grup)</>)}
                          onMouseLeave={clearTraceHover}
                          title="SS(błąd) = 40,00 (suma SS wewnątrz grup)"
                        >
                          {currentStep.tableProgress.showError_SS ? (
                            <span className={currentStep.step === 3 ? 'bg-[#fde4be] text-[#7c4305] px-1 py-0.2 rounded border border-[#ef9421] font-black animate-pulse' : ''}>
                              40,00
                            </span>
                          ) : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_df_err"
                          className="py-1.5 px-1.5 text-right text-[#6d7b83] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_df_err', ['cell_df_A', 'cell_df_B'], <LatexFormula tex="df_{\text{błąd}} = N - a \cdot b = 20 - 4 = 16" />)}
                          onMouseLeave={clearTraceHover}
                          title="df(błąd) = 16"
                        >
                          {currentStep.tableProgress.showDF ? '16' : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_MS_err"
                          className="py-1.5 px-1.5 text-right font-medium text-[#344b57] cursor-help border-b border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_MS_err', ['cell_SS_err', 'cell_df_err'], <LatexFormula tex="MS_{\text{błąd}} = \frac{SS_{\text{błąd}}}{df_{\text{błąd}}} = \frac{40{,}00}{16} = 2{,}50" />)}
                          onMouseLeave={clearTraceHover}
                          title="MS(błąd) = 2,50"
                        >
                          {currentStep.tableProgress.showMS ? '2,50' : '—'}
                        </td>
                        <td className="py-1.5 px-1.5 text-right text-[#b5bfc5] border-b border-r border-[#cfd8dd]">—</td>
                        <td className="py-1.5 px-1.5 text-right text-[#b5bfc5] border-b border-r border-[#cfd8dd]">—</td>
                        <td className="py-1.5 px-2 text-right text-[#b5bfc5] border-b border-[#cfd8dd]">—</td>
                      </tr>

                      {/* Row Total */}
                      <tr className="bg-[#f4f6f7] font-bold text-[#344b57] border-t-2 border-[#cfd8dd]">
                        <td className="py-1.5 px-2 font-sans border-r border-[#cfd8dd]">
                          Ogółem (Total)
                        </td>
                        <td 
                          data-trace-id="cell_SS_tot"
                          className="py-1.5 px-1.5 text-right cursor-help border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_SS_tot', ['cell_SS_A', 'cell_SS_B', 'cell_SS_AxB', 'cell_SS_err'], <LatexFormula tex="SS_{\text{total}} = 20{,}00 + 45{,}00 + 45{,}00 + 40{,}00 = 150{,}00" />)}
                          onMouseLeave={clearTraceHover}
                          title="SS(total) = 150,00"
                        >
                          {currentStep.tableProgress.showError_SS ? (
                            <span className={currentStep.step === 7 ? 'bg-[#d5e0e6] text-[#253640] px-1 py-0.2 rounded border border-[#344b57] font-black animate-pulse' : ''}>
                              150,00
                            </span>
                          ) : '—'}
                        </td>
                        <td 
                          data-trace-id="cell_df_tot"
                          className="py-1.5 px-1.5 text-right cursor-help border-r border-[#cfd8dd]"
                          onMouseEnter={() => setTraceHover('cell_df_tot', ['cell_df_A', 'cell_df_B', 'cell_df_AxB', 'cell_df_err'], <LatexFormula tex="df_{\text{total}} = 1 + 1 + 1 + 16 = 19" />)}
                          onMouseLeave={clearTraceHover}
                          title="df(total) = 19"
                        >
                          {currentStep.tableProgress.showDF ? '19' : '—'}
                        </td>
                        <td className="py-1.5 px-1.5 text-right text-[#b5bfc5] border-r border-[#cfd8dd]">—</td>
                        <td className="py-1.5 px-1.5 text-right text-[#b5bfc5] border-r border-[#cfd8dd]">—</td>
                        <td className="py-1.5 px-1.5 text-right text-[#b5bfc5] border-r border-[#cfd8dd]">—</td>
                        <td className="py-1.5 px-2 text-right text-[#b5bfc5]">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {!isIntroActive && (
        <>
          {/* Hover Formula Inspector Callout */}
          {hoveredFormula && (
            <motion.div
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-1.5 px-3 bg-[#fef5e7] border border-[#f4cc92] rounded-lg text-xs text-[#344b57] font-medium flex flex-wrap items-center gap-2 shadow-2xs"
            >
              <Info className="w-3.5 h-3.5 text-[#e28b1f] shrink-0" />
              <span className="font-bold">Sposób wyliczenia:</span>
              <span className="text-[#253640]">{hoveredFormula}</span>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* BOTTOM ROW: Step Calculation (Steps 1-11) OR Wykres (Step 12) */}
          {/* ========================================================= */}
          {currentStep.step !== 12 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.step}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="w-full bg-white border border-[#cfd8dd] rounded-xl p-3 shadow-2xs"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                  
                  {/* Column 1: Zadanie w tym kroku */}
                  <div className="md:col-span-4 space-y-1 flex flex-col justify-center">
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#c9700c]">
                      Zadanie w tym kroku:
                    </div>
                    <p className="text-xs text-[#455a66] leading-snug font-medium">
                      {currentStep.explanation}
                    </p>
                  </div>

                  {/* Column 2: Wzór matematyczny */}
                  <div className="md:col-span-3 p-2.5 rounded-lg bg-[#f7f7f7] border border-[#cfd8dd] text-center flex flex-col justify-center space-y-1">
                    <div className="text-[9px] uppercase tracking-wider font-extrabold text-[#85868c]">
                      Wzór matematyczny:
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-[#344b57]">
                      <LatexFormula tex={currentStep.formulaTex} displayMode />
                    </div>
                  </div>

                  {/* Column 3: Rozbicie obliczeń i wynik */}
                  <div className="md:col-span-5 p-2.5 rounded-lg bg-[#f7f7f7] border border-[#cfd8dd] flex flex-col justify-between space-y-1.5 min-w-0">
                    <div className="text-[11px] font-bold text-[#344b57] leading-snug">
                      {currentStep.calcBreakdown.label}
                    </div>

                    <div className="space-y-1 text-[11px] text-[#455a66] pl-2 border-l-2 border-[#ef9421] leading-relaxed">
                      {currentStep.calcBreakdown.subValues.map((val, i) => (
                        <div key={i} className="break-words">{val}</div>
                      ))}
                    </div>

                    <div className="pt-1.5 border-t border-[#e2e7ea] flex flex-wrap items-center justify-between gap-1.5 text-xs">
                      <span className="text-[11px] text-[#6d7b83] font-semibold leading-snug">{currentStep.calcBreakdown.result}</span>
                      <span className="text-xs sm:text-sm font-bold text-[#9a5508] px-2 py-0.5 rounded-lg bg-[#fef5e7] border border-[#f4cc92] shrink-0">
                        {currentStep.calcBreakdown.finalNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* ========================================================= */
            /* STEP 12 SPECIAL SECTION: Wykres & Raport APA 7            */
            /* ========================================================= */
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white border border-[#cfd8dd] rounded-xl p-3.5 shadow-2xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#e2e7ea]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#ef9421]" />
                  <span className="text-xs font-bold text-[#344b57]">
                    Wykres interakcji (ze słupkami 95% CI) oraz Raport APA 7
                  </span>
                  <span className="text-[11px] text-[#6d7b83] hidden sm:inline">
                    · <em>F</em>(1, 16) = 18,00; <em>p</em> &lt; 0,001
                  </span>
                </div>

                <button
                  onClick={copyApaToClipboard}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fef5e7] hover:bg-[#fde9cb] text-[#9a5508] text-xs font-semibold border border-[#f4cc92] transition-colors cursor-pointer"
                >
                  {copiedApa ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1f5e54]" />
                      <span className="text-[#1f5e54] font-bold">Skopiowano APA 7!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kopiuj raport APA 7</span>
                    </>
                  )}
                </button>
              </div>

              {/* Chart & APA 7 Report Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
                
                {/* SVG Chart & Simple Effects */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
                  <div className="bg-[#f7f7f7] rounded-xl p-2 border border-[#dfe5e8]">
                    <div className="w-full h-36">
                      <svg viewBox="0 0 320 140" className="w-full h-full">
                        {/* Grid lines */}
                        <line x1="45" y1="18" x2="295" y2="18" stroke="#dfe5e8" strokeDasharray="3 3" />
                        <line x1="45" y1="60" x2="295" y2="60" stroke="#dfe5e8" strokeDasharray="3 3" />
                        <line x1="45" y1="102" x2="295" y2="102" stroke="#dfe5e8" strokeDasharray="3 3" />

                        <text x="36" y="22" fill="#6d7b83" fontSize="8" textAnchor="end" fontFamily="monospace">14</text>
                        <text x="36" y="64" fill="#6d7b83" fontSize="8" textAnchor="end" fontFamily="monospace">11</text>
                        <text x="36" y="106" fill="#6d7b83" fontSize="8" textAnchor="end" fontFamily="monospace">8</text>

                        {/* 95% CI Error bars */}
                        {/* Czytanie, Krótki: M = 8 (y = 102) -> 88 to 116 (#344b57 CRIDM slate) */}
                        <line x1="95" y1="88" x2="95" y2="116" stroke="#344b57" strokeWidth="1.6" />
                        <line x1="90" y1="88" x2="100" y2="88" stroke="#344b57" strokeWidth="1.6" />
                        <line x1="90" y1="116" x2="100" y2="116" stroke="#344b57" strokeWidth="1.6" />

                        {/* Czytanie, Długi: M = 14 (y = 18) -> 4 to 32 */}
                        <line x1="245" y1="4" x2="245" y2="32" stroke="#344b57" strokeWidth="1.6" />
                        <line x1="240" y1="4" x2="250" y2="4" stroke="#344b57" strokeWidth="1.6" />
                        <line x1="240" y1="32" x2="250" y2="32" stroke="#344b57" strokeWidth="1.6" />

                        {/* Testowanie, Krótki: M = 13 (y = 32) -> 18 to 46 (#ef9421 CRIDM orange) */}
                        <line x1="95" y1="18" x2="95" y2="46" stroke="#ef9421" strokeWidth="1.6" />
                        <line x1="90" y1="18" x2="100" y2="18" stroke="#ef9421" strokeWidth="1.6" />
                        <line x1="90" y1="46" x2="100" y2="46" stroke="#ef9421" strokeWidth="1.6" />

                        {/* Testowanie, Długi: M = 13 (y = 32) -> 18 to 46 */}
                        <line x1="245" y1="18" x2="245" y2="46" stroke="#ef9421" strokeWidth="1.6" />
                        <line x1="240" y1="18" x2="250" y2="18" stroke="#ef9421" strokeWidth="1.6" />
                        <line x1="240" y1="46" x2="250" y2="46" stroke="#ef9421" strokeWidth="1.6" />

                        {/* Line: Czytanie (8 -> 14) */}
                        <line x1="95" y1="102" x2="245" y2="18" stroke="#344b57" strokeWidth="2.2" />
                        <circle cx="95" cy="102" r="4" fill="#344b57" />
                        <text x="95" y="126" fill="#344b57" fontSize="8.5" textAnchor="middle" fontWeight="bold">M = 8,00</text>

                        <circle cx="245" cy="18" r="4" fill="#344b57" />
                        <text x="245" y="12" fill="#344b57" fontSize="8.5" textAnchor="middle" fontWeight="bold">M = 14,00</text>

                        {/* Line: Testowanie (13 -> 13) */}
                        <line x1="95" y1="32" x2="245" y2="32" stroke="#ef9421" strokeWidth="2.2" />
                        <circle cx="95" cy="32" r="4" fill="#ef9421" />
                        <text x="95" y="25" fill="#9a5508" fontSize="8.5" textAnchor="middle" fontWeight="bold">M = 13,00</text>

                        <circle cx="245" cy="32" r="4" fill="#ef9421" />
                        <text x="245" y="25" fill="#9a5508" fontSize="8.5" textAnchor="middle" fontWeight="bold">M = 13,00</text>

                        <text x="95" y="136" fill="#5a6c77" fontSize="9" textAnchor="middle" fontWeight="700">Krótki sen</text>
                        <text x="245" y="136" fill="#5a6c77" fontSize="9" textAnchor="middle" fontWeight="700">Długi sen</text>
                      </svg>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-[11px] text-[#5a6c77] pt-1.5 border-t border-[#dfe5e8]">
                      <span className="flex items-center gap-1 font-bold text-[#344b57]">
                        <span className="w-2.5 h-1 bg-[#344b57] rounded"></span>
                        Ponowne czytanie
                      </span>
                      <span className="flex items-center gap-1 font-bold text-[#9a5508]">
                        <span className="w-2.5 h-1 bg-[#ef9421] rounded"></span>
                        Testowanie się
                      </span>
                    </div>
                  </div>

                  {/* Simple Main Effects Summary */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-[#fef5e7]/80 border border-[#f4cc92] space-y-0.5">
                      <div className="font-extrabold text-[#9a5508] uppercase tracking-wider text-[9px]">
                        Krótki sen:
                      </div>
                      <div className="font-bold text-[#344b57] text-[11px]">
                        Testowanie (13) vs Czytanie (8)
                      </div>
                      <div className="font-mono text-[#1f5e54] font-bold text-[10px]">
                        <em>F</em>(1, 16) = 25,00; <em>p</em> &lt; 0,001
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-[#f7f7f7] border border-[#dfe5e8] space-y-0.5">
                      <div className="font-extrabold text-[#6d7b83] uppercase tracking-wider text-[9px]">
                        Długi sen:
                      </div>
                      <div className="font-bold text-[#344b57] text-[11px]">
                        Testowanie (13) vs Czytanie (14)
                      </div>
                      <div className="font-mono text-[#6d7b83] font-semibold text-[10px]">
                        <em>F</em>(1, 16) = 1,00; <em>p</em> = 0,333
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Formal APA 7 Report in Times New Roman */}
                <div className="lg:col-span-7 flex flex-col">
                  <div 
                    className="flex-1 p-3.5 rounded-xl bg-[#f7f7f7] border border-[#dfe5e8] text-[#1f2d35] leading-relaxed text-xs sm:text-sm space-y-2 flex flex-col justify-center"
                    style={{ fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    <div className="font-bold text-[10px] uppercase tracking-wider text-[#6d7b83] font-sans">
                      Tekst raportu (język polski):
                    </div>
                    <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '0.96rem', lineHeight: '1.65' }}>
                      „Przeprowadzono dwuczynnikową analizę wariancji w schemacie międzygrupowym 2 (Strategia uczenia się: Ponowne czytanie vs Testowanie) × 2 (Czas trwania snu: Krótki vs Długi). Wykazano statystycznie istotny efekt główny strategii uczenia się, <em>F</em>(1, 16) = 8,00; <em>p</em> = 0,012; η<sub>p</sub><sup>2</sup> = 0,33, a także istotny efekt główny czasu trwania snu, <em>F</em>(1, 16) = 18,00; <em>p</em> &lt; 0,001; η<sub>p</sub><sup>2</sup> = 0,53.
                    </p>
                    <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '0.96rem', lineHeight: '1.65' }}>
                      Kluczowy dla hipotezy badawczej efekt interakcji obu czynników okazał się statystycznie istotny, <em>F</em>(1, 16) = 18,00; <em>p</em> &lt; 0,001; η<sub>p</sub><sup>2</sup> = 0,53. Analiza efektów prostych wykazała, że w warunku krótkiego snu osoby testujące się zapamiętały istotnie więcej słów (<em>M</em> = 13,00; <em>SD</em> = 1,58; 95% CI [11,50; 14,50]) niż osoby ponownie czytające (<em>M</em> = 8,00; <em>SD</em> = 1,58; 95% CI [6,50; 9,50]), <em>F</em>(1, 16) = 25,00; <em>p</em> &lt; 0,001; η<sub>p</sub><sup>2</sup> = 0,61. W warunku długiego snu różnica między strategiami nie była istotna statystycznie (<em>M</em> = 13,00 vs <em>M</em> = 14,00), <em>F</em>(1, 16) = 1,00; <em>p</em> = 0,333; η<sub>p</sub><sup>2</sup> = 0,06.”
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

    </div>
  );
};
