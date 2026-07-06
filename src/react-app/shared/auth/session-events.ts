export const SESSION_CLEARED_EVENT = 'tanlabs:session-cleared';
export const SESSION_SAVED_EVENT = 'tanlabs:session-saved';

export function dispatchSessionCleared(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(SESSION_CLEARED_EVENT));
}

export function dispatchSessionSaved(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(SESSION_SAVED_EVENT));
}
