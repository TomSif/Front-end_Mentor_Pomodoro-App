import { useState, useEffect } from "react";
import { AppContext } from "./SettingsContext";
import { DEFAULT_SETTINGS } from "../utils/defaults";
import type { Settings } from "../types/types";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // load save settings or DEFAULT_SETTINGS
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const saved = localStorage.getItem("pomodoro-settings");
    return saved ? (JSON.parse(saved) as Settings) : DEFAULT_SETTINGS;
  });

  //saved settings in local storage
  useEffect(() => {
    localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
  }, [settings]);

  //data-font and color injection
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
