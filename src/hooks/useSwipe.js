import { useState, useEffect, useRef, useCallback } from 'react';

export default function useSwipe(ref) {
  const [direction, setDirection] = useState(null);
  const touchStart = useRef(null);

  const reset = useCallback(() => setDirection(null), []);

  useEffect(() => {
    const el = ref?.current || document;

    function handleTouchStart(e) {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    function handleTouchEnd(e) {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      // Only trigger if horizontal swipe is dominant and exceeds minimum distance
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? 'right' : 'left');
      }
      touchStart.current = null;
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref]);

  return { direction, reset };
}
