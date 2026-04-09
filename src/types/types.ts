export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export type AppColor = "red-400" | "cyan-300" | "purple-400";
export type AppFont = "Kumbh Sans" | "Space Mono" | "Roboto Slab";

export interface Settings {
  durations: Record<TimerMode, number>;
  color: AppColor;
  font: AppFont;
}
