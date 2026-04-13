import { useReducer, useEffect } from "react";
import type { TimerMode } from "../types/types";
import useSettings from "../hooks/useSettings";
import CircularProgress from "./CircularProgress";

// 1. Le type de l'état
interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  status: "idle" | "running" | "paused";
}

// 2. Les actions
type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESTART" }
  | { type: "TICK" }
  | { type: "COMPLETE"; payload: { duration: number } }
  | { type: "SET_MODE"; payload: { mode: TimerMode; duration: number } };

// 3. Le reducer
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START":
      return { ...state, status: "running" };

    case "PAUSE":
      return { ...state, status: "paused" };

    case "RESTART":
      return { ...state, status: "running" };

    case "TICK":
      return { ...state, timeLeft: state.timeLeft - 1 };

    case "SET_MODE":
      return {
        ...state,
        mode: action.payload.mode,
        timeLeft: action.payload.duration,
      };
    case "COMPLETE":
      return {
        ...state,
        status: "idle",
        timeLeft: action.payload.duration,
      };

    default:
      return state;
  }
}

//function to handle fomatTime like this MM:SS
function formatTime(seconds: number): string {
  const minutesLeft = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secondsLeft = (seconds % 60).toString().padStart(2, "0");
  return `${minutesLeft}:${secondsLeft}`;
}

function Timer() {
  // hook
  const { settings } = useSettings();
  //declare initial state
  const initialState: TimerState = {
    mode: "pomodoro",
    timeLeft: settings.durations["pomodoro"],
    status: "idle",
  };
  // plug useReducer
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // function to handle button actions and button display
  function handleButtonClick(status: TimerState["status"]): TimerAction {
    if (status === "idle") return { type: "START" };
    if (status === "running") return { type: "PAUSE" };
    return { type: "RESTART" };
  }

  //useEffect Timer dispatch the tick
  useEffect(() => {
    if (state.status !== "running") return;
    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  //useEffet TimeLeft === 0
  useEffect(() => {
    if (state.timeLeft === 0) {
      dispatch({
        type: "COMPLETE",
        payload: { duration: settings.durations[state.mode] },
      });
    }
  }, [state.timeLeft, state.mode, settings.durations]);

  return (
    <main className="timer-bg w-70 h-70 rounded-full flex flex-col items-center justify-center mt-11.5">
      <div className="timer-container w-67 h-67 rounded-full bg-blue-950 text-white flex flex-col items-center justify-center relative">
        <CircularProgress
          timeLeft={state.timeLeft}
          totalDuration={settings.durations[state.mode]}
        />
        <div className="timer-display flex flex-col items-center z-50 ">
          <div className="display text-preset-1-mobile md:text-preset-1">
            {formatTime(state.timeLeft)}
          </div>
          <button
            onClick={() => dispatch(handleButtonClick(state.status))}
            className="text-preset-2-mobile md:text-preset-2"
          >
            {handleButtonClick(state.status).type}
          </button>
        </div>
      </div>
    </main>
  );
}

export default Timer;
