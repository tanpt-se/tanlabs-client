'use client';

import { useEffect } from 'react';

export interface SessionWatchdogProps {
  intervalMs: number;
  probe: () => Promise<unknown>;
}

export function SessionWatchdog({ intervalMs, probe }: SessionWatchdogProps) {
  useEffect(() => {
    let active = true;
    let inFlight = false;
    let timeoutId: number | null = null;

    const canProbe = () => {
      if (typeof document === 'undefined') {
        return true;
      }

      if (document.visibilityState !== 'visible') {
        return false;
      }

      return typeof document.hasFocus === 'function' ? document.hasFocus() : true;
    };

    const scheduleNext = () => {
      if (!active) {
        return;
      }

      timeoutId = window.setTimeout(() => {
        void runProbe();
      }, intervalMs);
    };

    const runProbe = async () => {
      if (!active || inFlight) {
        return;
      }

      if (!canProbe()) {
        scheduleNext();
        return;
      }

      inFlight = true;
      try {
        await probe();
      } catch {
        // Browser API client handles auth/session redirects.
      } finally {
        inFlight = false;
        scheduleNext();
      }
    };

    void runProbe();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void runProbe();
      }
    };

    const handleFocus = () => {
      void runProbe();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      active = false;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [intervalMs, probe]);

  return null;
}
