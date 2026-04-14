import { useState, useEffect } from "react";
import { AppContext } from "./SettingsContext";
import { DEFAULT_SETTINGS } from "../utils/defaults";
import type { Settings } from "../types/types";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    document.documentElement.dataset.font = settings.font;
    document.documentElement.style.setProperty(
      "--app-color",
      `var(--color-${settings.color})`,
    );
  }, [settings]);

  return (
    <AppContext.Provider value={{ settings, setSettings }}>
      {children}
    </AppContext.Provider>
  );
}
