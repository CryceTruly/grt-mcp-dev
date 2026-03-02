import { useCallback } from "react";

export function useSendMessage() {
  return useCallback((prompt: string) => {
    if (typeof window !== "undefined" && window?.openai?.sendFollowUpMessage) {
      return window.openai!.sendFollowUpMessage({ prompt });
    }
    return Promise.resolve();
  }, []);
}
