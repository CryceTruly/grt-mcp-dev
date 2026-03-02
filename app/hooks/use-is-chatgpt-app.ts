import { useSyncExternalStore } from "react";

export function useIsChatGptApp(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => (typeof window === "undefined" ? false : (window as any).__isChatGptApp ?? false),
    () => false
  );
}
