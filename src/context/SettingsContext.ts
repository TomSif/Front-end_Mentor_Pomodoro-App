import { createContext } from "react";
import type { Settings } from "../types/types";

export interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export const AppContext = createContext<SettingsContextType | undefined>(
  undefined,
);
