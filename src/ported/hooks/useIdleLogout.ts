import { useEffect, useRef } from 'react';

export function useIdleLogout(timeoutMs: number, onIdle: () => void, enabled = true) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warn = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useRef(onIdle);
  cb.current = onIdle;

  useEffect(() => {
    if (!enabled) return;
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      if (warn.current) clearTimeout(warn.current);
      warn.current = setTimeout(() => {
        try {
          // 1 min warning
          // eslint-disable-next-line no-alert
          console.warn('[idle] Auto-logout in 60s');
        } catch {}
      }, Math.max(0, timeoutMs - 60_000));
      timer.current = setTimeout(() => cb.current(), timeoutMs);
    };
    const events = ['mousemove', 'keydown', 'touchstart', 'click', 'scroll', 'visibilitychange'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timer.current) clearTimeout(timer.current);
      if (warn.current) clearTimeout(warn.current);
    };
  }, [timeoutMs, enabled]);
}
