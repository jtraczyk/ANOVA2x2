import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexFormulaProps {
  tex: string;
  displayMode?: boolean;
  className?: string;
}

export const LatexFormula: React.FC<LatexFormulaProps> = ({
  tex,
  displayMode = false,
  className = '',
}) => {
  const html = useMemo(() => {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
    });
  }, [tex, displayMode]);

  return (
    <span
      className={`latex-formula align-middle ${
        displayMode ? 'block w-full' : 'inline-block max-w-full'
      } ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
