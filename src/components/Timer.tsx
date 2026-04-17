import { useReducer, useEffect, useState } from "react";
import type { TimerMode } from "../types/types";
import ModeSelector from "./ModeSelector";
import useSettings from "../hooks/useSettings";
import CircularProgress from "./CircularProgress";
import SettingsModal from "./SettingsModal";

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
  | { type: "SET_MODE"; payload: { mode: TimerMode; duration: number } }
  | { type: "RESET_DURATIONS"; payload: { duration: number } };

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
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };

    case "SET_MODE":
      return {
        ...state,
        status: "idle",
        mode: action.payload.mode,
        timeLeft: action.payload.duration,
      };
    case "COMPLETE":
      return {
        ...state,
        status: "idle",
        timeLeft: action.payload.duration,
      };
    case "RESET_DURATIONS":
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
function formatISO8601(seconds: number): string {
  const minutesLeftIso = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secondsLeftIso = (seconds % 60).toString().padStart(2, "0");

  return `PT${minutesLeftIso}M${secondsLeftIso}S`;
}

//Timer Component
function Timer() {
  //states
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // hook
  const { settings } = useSettings();
  //declare initial state
  const initialState: TimerState = {
    mode: "pomodoro",
    timeLeft: settings.durations["pomodoro"] * 60,
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

  // APi call for notifications
  useEffect(() => {
    async function getPermission() {
      const permission = await Notification.requestPermission();
      return permission;
    }
    getPermission();
  }, []);

  //actual mode duration
  const currentDuration = settings.durations[state.mode];
  //useEffet TimeLeft === 0 --> Send notification
  useEffect(() => {
    if (state.timeLeft === 0) {
      if (Notification.permission === "granted") {
        new Notification("Timer", {
          body: `${currentDuration} minutes done. Great job! Take a break.`,
        });
      }
      dispatch({
        type: "COMPLETE",
        payload: { duration: settings.durations[state.mode] * 60 },
      });
    }
  }, [state.timeLeft, state.mode, settings.durations, currentDuration]);

  // useEffect to update settings
  useEffect(() => {
    dispatch({
      type: "RESET_DURATIONS",
      payload: { duration: currentDuration * 60 },
    });
  }, [currentDuration]);

  //function to close Dialog Modal
  function onClose() {
    return setIsOpen(false);
  }
  return (
    <>
      <header className="w-full  max-w-96 ">
        <h1 className="header-title mx-auto text-white text-center mb-10 md:mb-11.5 ">
          pomodoro
        </h1>
        <ModeSelector
          onModeChange={(mode) =>
            dispatch({
              type: "SET_MODE",
              payload: { mode, duration: settings.durations[mode] * 60 },
            })
          }
          mode={state.mode}
        />
      </header>
      <SettingsModal isOpen={isOpen} onClose={onClose} />
      <main className="timer-bg w-70 h-70 xl:w-110 xl:h-110 rounded-full flex flex-col items-center justify-center mt-11.5 md:mt-27 xl:mt-9">
        <div className="timer-container w-64 h-64  xl:w-100 xl:h-100 rounded-full bg-blue-950 text-white flex flex-col items-center justify-center relative">
          <CircularProgress
            timeLeft={state.timeLeft}
            totalDuration={settings.durations[state.mode] * 60}
          />
          <div className="timer-display flex flex-col items-center justify-center z-50 w-64">
            <time
              dateTime={formatISO8601(state.timeLeft)}
              className="display text-preset-1  text-center flex items-center justify-center   w-[5ch] tabular-nums "
            >
              {formatTime(state.timeLeft)}
            </time>
            <button
              type="button"
              onClick={() => dispatch(handleButtonClick(state.status))}
              className="text-preset-2 hover:text-(--app-color) w-full text-center mx-auto"
            >
              {handleButtonClick(state.status).type}
            </button>
          </div>
        </div>
      </main>
      <footer className=" w-full flex items-center mt-20 md:mt-36 xl:mt-16">
        <button
          type="button"
          aria-label="open the settings page"
          aria-controls="settingsModal"
          onClick={() => {
            setIsOpen((isOpen) => !isOpen);
          }}
          className="button-settings w-7 h-7 mx-auto transition-all ease-in-out 0.2s "
        >
          <img src="/assets/icon-settings.svg" alt="" />
        </button>
      </footer>
    </>
  );
}

export default Timer;
