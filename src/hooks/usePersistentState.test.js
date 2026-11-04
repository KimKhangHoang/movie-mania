import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import usePersistentState from './usePersistentState';

describe('usePersistentState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves changes and restores them on the next visit', () => {
    const firstVisit = renderHook(() => usePersistentState('wish-list', []));
    act(() => firstVisit.result.current[1]([{ id: 1 }]));
    firstVisit.unmount();

    const nextVisit = renderHook(() => usePersistentState('wish-list', []));
    expect(nextVisit.result.current[0]).toEqual([{ id: 1 }]);
  });

  it('falls back to the initial value when the saved data is invalid', () => {
    localStorage.setItem('movie-mania:wish-list', 'not valid JSON');

    const { result } = renderHook(() => usePersistentState('wish-list', []));

    expect(result.current[0]).toEqual([]);
  });
});
