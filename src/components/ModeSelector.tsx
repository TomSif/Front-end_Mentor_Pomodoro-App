import { useState } from "react";
import type { TimerMode } from "../types/types";
import ModeButton from "./ModeButton";

const MODES: TimerMode[] = ["pomodoro", "shortBreak", "longBreak"];
function ModeSelector() {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  return (
    <ul className="flex max-w-95 w-full bg-blue-900 rounded-full items-center justify-between p-1.5 mx-auto">
      {MODES.map((modeItem, index) => {
        return (
          <li key={index}>
            <ModeButton
              mode={modeItem}
              setMode={setMode}
              isActive={modeItem === mode}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ModeSelector;
