export type OpenAIGlobals<
  ToolInput = UnknownObject,
  ToolOutput = UnknownObject,
  ToolResponseMetadata = UnknownObject,
  WidgetState = UnknownObject
> = {
  theme: Theme;
  userAgent: UserAgent;
  locale: string;
  maxHeight: number | null;
  displayMode: DisplayMode | null;
  safeArea: SafeArea | null;
  toolInput: ToolInput | null;
  toolOutput: ToolOutput | null;
  toolResponseMetadata: ToolResponseMetadata | null;
  widgetState: WidgetState | null;
  setWidgetState: (state: WidgetState) => Promise<void>;
};

type API = {
  callTool: CallTool;
  sendFollowUpMessage: (args: { prompt: string }) => Promise<void>;
  openExternal: (payload: { href: string }) => void;
  requestDisplayMode: RequestDisplayMode;
};

export type UnknownObject = Record<string, unknown>;

export type Theme = "light" | "dark";

export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type SafeArea = {
  insets: SafeAreaInsets;
};

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

export type UserAgent = {
  device: { type: DeviceType };
  capabilities: { hover: boolean; touch: boolean };
};

export type DisplayMode = "pip" | "inline" | "fullscreen";

export type RequestDisplayMode = (args: {
  mode: DisplayMode;
}) => Promise<{ mode: DisplayMode }>;

export type CallToolResponse = {
  result: string;
};

export type CallTool = (
  name: string,
  args: Record<string, unknown>
) => Promise<CallToolResponse | null>;

export const SET_GLOBALS_EVENT_TYPE = "openai:set_globals";

export type SetGlobalsEventDetail = {
  globals: Partial<OpenAIGlobals>;
};

declare global {
  interface Window {
    openai?: API & Partial<OpenAIGlobals>;
    innerBaseUrl: string;
  }
  interface WindowEventMap {
    [SET_GLOBALS_EVENT_TYPE]: CustomEvent<SetGlobalsEventDetail>;
  }
}
