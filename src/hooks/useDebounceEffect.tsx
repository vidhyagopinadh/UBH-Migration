import { useEffect } from "react";
import type { DependencyList } from "react";

export function useDebounceEffect(
  fn: (...args: any[]) => void,
  waitTime: number,
  deps?: DependencyList,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn(...deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [...deps, waitTime]);
}
