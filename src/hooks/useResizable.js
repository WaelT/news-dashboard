import { useState, useRef, useCallback, useEffect } from 'react';

export function useResizableGrid(initialFractions, direction = 'horizontal') {
  const [fractions, setFractions] = useState(initialFractions);
  const containerRef = useRef(null);
  const draggingRef = useRef(null);

  const onMouseDown = useCallback((index, e) => {
    if (window.innerWidth < 1024) return;
    e.preventDefault();
    draggingRef.current = { index, startX: e.clientX, startY: e.clientY, startFracs: [...fractions] };

    const onMouseMove = (e) => {
      const d = draggingRef.current;
      if (!d || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const total = direction === 'horizontal' ? rect.width : rect.height;
      const delta = direction === 'horizontal'
        ? (e.clientX - d.startX) / total
        : (e.clientY - d.startY) / total;

      const newFracs = [...d.startFracs];
      const minFrac = 0.1;
      let left = newFracs[d.index] + delta;
      let right = newFracs[d.index + 1] - delta;
      if (left < minFrac) { right -= (minFrac - left); left = minFrac; }
      if (right < minFrac) { left -= (minFrac - right); right = minFrac; }
      if (left < minFrac || right < minFrac) return;
      newFracs[d.index] = left;
      newFracs[d.index + 1] = right;
      setFractions(newFracs);
    };

    const onMouseUp = () => {
      draggingRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [fractions, direction]);

  const gridTemplate = fractions.map((f) => `${f}fr`).join(' 4px ');

  // Reset on resize to mobile
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 1024) setFractions(initialFractions);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [initialFractions]);

  return { containerRef, gridTemplate, fractions, onMouseDown };
}
