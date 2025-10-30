import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce a value
 * Delays updating the debounced value until after the specified delay
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 100ms)
 * @returns The debounced value
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * @example
 * const debouncedCursorPos = useDebounce(cursorPos, 100);
 */
export function useDebounce<T>(value: T, delay: number = 100): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: cancel the timer if value changes before delay expires
    // This prevents updating the debounced value too frequently
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}
