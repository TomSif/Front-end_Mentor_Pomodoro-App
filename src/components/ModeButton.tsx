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
      onClick={() => setMode(mode)}
      className={cn(
        "text-preset-3-mobile md:text-preset-3 py-4 px-6 rounded-full hover:text-blue-100",
        isActive && "bg-purple-400 text-blue-850",
        !isActive && "bg-transparent text-blue-100/40",
      )}
    >
      {mode}
    </button>
  );
}

export default ModeButton;
