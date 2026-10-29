import { useEffect, useState } from 'react';

const STORAGE_PREFIX = 'movie-mania:';

// Works like useState, but keeps the value in localStorage so it survives page refreshes.
// If storage is unavailable or holds invalid data, it falls back to the initial value and keeps working in memory.
function usePersistentState(key, initialValue) {
  const storageKey = STORAGE_PREFIX + key;

  // read the saved value only once, on first render
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // save the value whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // storage is full or blocked, so the value only lasts until the page is closed
    }
  }, [storageKey, value]);

  return [value, setValue];
}

export default usePersistentState;
