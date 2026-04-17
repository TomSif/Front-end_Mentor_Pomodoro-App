import type { TimerMode } from "../types/types";
import ModeButton from "./ModeButton";

interface TimerModeProps {
  onModeChange: (m: TimerMode) => void;
  mode: TimerMode;
}

const MODES: TimerMode[] = ["pomodoro", "short break", "long break"];
function ModeSelector({ onModeChange, mode }: TimerModeProps) {
  return (
    <nav aria-label="Timer mode">
      <ul className="flex  w-auto bg-blue-900 rounded-full items-center justify-between p-1.5 mx-auto">
        {MODES.map((modeItem, index) => {
          return (
            <li key={index}>
              <ModeButton
                mode={modeItem}
                setMode={() => {
                  onModeChange(modeItem);
                }}
                isActive={modeItem === mode}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default ModeSelector;
