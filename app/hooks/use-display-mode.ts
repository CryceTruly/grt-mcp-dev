import { useOpenAIGlobal } from "./use-openai-global";
import type { DisplayMode } from "./types";

export function useDisplayMode(): DisplayMode | null {
  return useOpenAIGlobal("displayMode");
}
