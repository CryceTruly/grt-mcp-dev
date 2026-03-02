import { useOpenAIGlobal } from "./use-openai-global";

export function useWidgetProps<T = unknown>(
  defaultState?: T | (() => T)
): T | null {
  const toolOutput = useOpenAIGlobal("toolOutput") as T | null;
  const fallback =
    typeof defaultState === "function"
      ? (defaultState as () => T)()
      : defaultState ?? null;
  return toolOutput ?? fallback;
}
