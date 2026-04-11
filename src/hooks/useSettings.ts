import { useContext } from "react";
import { AppContext } from "../context/SettingsContext";

function useSettings() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
}

export default useSettings;
