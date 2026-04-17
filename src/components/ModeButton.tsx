import type { TimerMode } from "../types/types";
import { cn } from "../lib/utils";

interface ModeButtonInterface {
  mode: TimerMode;
  isActive: boolean;
  setMode: (mode: TimerMode) => void;
}

function ModeButton({ mode, isActive, setMode }: ModeButtonInterface) {
  return (
    <button
      type="button"
      onClick={() => setMode(mode)}
      className={`text-preset-3 ${cn(
        "   py-4 px-4.5 rounded-full hover:text-blue-100 flex items-center justify-center text-center",
        isActive && "bg-purple-400 text-blue-850 ",
        !isActive && "bg-transparent text-blue-100/40 ",
      )}`}
    >
      {mode}
    </button>
  );
}

export default ModeButton;
