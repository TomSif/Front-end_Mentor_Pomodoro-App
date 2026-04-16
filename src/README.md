# Pomodoro App - Thomas Sifferle ⏱️

![forthebadge](https://forthebadge.com/api/badges/generate?primaryLabel=USES&secondaryLabel=HTML)
![forthebadge](https://forthebadge.com/api/badges/generate?primaryLabel=USES&secondaryLabel=CSS)
![forthebadge](https://forthebadge.com/api/badges/generate?primaryLabel=USES&secondaryLabel=JS)
[![forthebadge](https://forthebadge.com/api/badges/generate?primaryLabel=USES&secondaryLabel=GIT)](https://github.com/TomSif)
[![React](https://img.shields.io/badge/react_19-20232a?style=for-the-badge&logo=react&logocolor=61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-646cff?style=for-the-badge&logo=vite&logocolor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/tailwindcss_v4-0F172A?&logo=tailwindcss&logocolor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

![Design preview for the Pomodoro App coding challenge](./public/screenshot.png)

### 🌐 Live Demo:

**[View live site →](https://front-end-mentor-pomodoro-app.vercel.app/)**

Deployed on Vercel with HTTPS and performance optimizations.

---

This is a solution to the [Pomodoro App challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/pomodoro-app-KBFnycJ6G).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Set a pomodoro timer and short and long break timers
- Customize the timer duration for each mode
- Switch between a Pomodoro session, short break, and long break
- Customize the background theme color and font
- See a circular progress bar animate as the timer counts down
- Receive a browser notification when a session ends
- Have their settings persisted across page reloads via `localStorage`
- View the optimal layout for the app depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![App](./public/screenshot-modal.png)

### Links

- Solution URL: [GitHub Repository](https://github.com/TomSif/Front-end_Mentor_Pomodoro-App)
- Live Site URL: [Vercel Deployment](https://front-end-mentor-pomodoro-app.vercel.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Mobile-first workflow
- [React 19](https://react.dev/) - JS library
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS (`@tailwindcss/vite` plugin, `@theme` variables, `@utility` presets)
- Context API — global settings state
- `useReducer` — timer state machine
- Web Notifications API — native OS notifications
- `localStorage` — settings persistence

### What I learned

#### Type-first architecture — and its limits

This project was the first time I applied a systematic type-first approach: types are defined before data, and the rest of the app is built on top of them. Union types drive the whole shape of the application.

```ts
// types.ts — everything else derives from here
export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";
export type AppColor = "red-400" | "cyan-300" | "purple-400";
export type AppFont = "kumbh-sans" | "roboto-slab" | "space-mono";

export interface Settings {
  durations: Record<TimerMode, number>;
  color: AppColor;
  font: AppFont;
}
```

By the end of the project I identified a concrete limitation: `TimerMode` is defined as a union type in `types.ts`, but the actual array of modes has to be declared separately in `ModeSelector.tsx` (since TypeScript types are erased at runtime and can't be iterated). If a mode is added, both the type and the array need to be updated independently.

The data-first alternative — `as const` arrays as the single source of truth, with types derived via `(typeof MODES)[number]` — will be the default approach on the next project.

#### `useReducer` — a state machine for the timer

The timer has three mutually exclusive states (`"idle"`, `"running"`, `"paused"`). Modeling them as two separate booleans would create impossible combinations. A single `status` field with a union type, combined with `useReducer` and a discriminated union for actions, enforces the machine transitions cleanly.

```ts
type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESTART" }
  | { type: "TICK" }
  | { type: "COMPLETE"; payload: { duration: number } }
  | { type: "SET_MODE"; payload: TimerMode }
  | { type: "RESET_DURATIONS"; payload: number };
```

A key insight during this session: the reducer is a pure function — it takes a state and an action, and returns a new state. Side effects have no place in it. Moving the `Notification.requestPermission()` call out of the reducer and into a `useEffect` was the concrete moment this rule became real rather than theoretical.

The `handleButtonClick` helper — a function that maps the current `status` to the correct action — lives inside the component but before the JSX, and its return type is constrained to `TimerAction`. It dispatches, but it also exposes its `.type` to derive the button label without storing it as separate state.

#### Context API — understanding the contract before the syntax

Setting up `SettingsContext` was the first time I used `createContext` and `useContext` in a real project. The key unlock was separating the _why_ from the _how_ before writing any code:

> The settings (durations, font, color) need to be readable by the whole app, but only writable by the `SettingsModal`. Context is the answer to prop drilling through the entire tree.

The interface `SettingsContextType` describes the _contract_ of what `useContext` will return — not the implementation of the Provider. This distinction matters: the same interface would hold whether the Provider uses `useState`, `useReducer`, or a fetch. The concrete confusion to navigate: in the codebase, `settings`, `Settings`, `setSettings`, and `draftSettings` all coexist. The rule that helped: annotate every "settings" with its role (the type, the current value, the setter, the local draft) and the names stop blurring.

A `useSettings()` custom hook wraps `useContext(AppContext)` and handles the `undefined` guard — so every consumer gets a typed, safe value without boilerplate.

#### `localStorage` — lazy initialization and round-trips

User settings are persisted in `localStorage` so they survive page reloads. Two patterns were new and are worth retaining:

**Lazy initialization** — passing a function to `useState` instead of a value:

```ts
const [settings, setSettings] = useState<Settings>(() => {
  const stored = localStorage.getItem("settings");
  return stored ? (JSON.parse(stored) as Settings) : DEFAULT_SETTINGS;
});
```

Without the function wrapper, the `localStorage.getItem` call would run on every render. With it, it runs once at mount. The `JSON.parse` cast (`as Settings`) is intentional and acknowledged: `JSON.parse` returns `any`, and a proper runtime validation (Zod or a guard function) is the next step to learn.

The save effect in `SettingsProvider` is a separate `useEffect` that runs on every `settings` change — one effect, one responsibility.

#### Web Notifications API — async inside `useEffect`

When a timer session completes, a native OS notification is triggered. This required two things: requesting permission at mount, and dispatching the notification when `timeLeft === 0`.

```ts
// Requesting permission — correct pattern for async inside useEffect
useEffect(() => {
  const requestPermission = async () => {
    await Notification.requestPermission();
  };
  requestPermission();
}, []);
```

The constraint that blocked me initially: `useEffect` callbacks cannot be `async` directly, because an `async` function returns a Promise and React expects either `undefined` or a cleanup function. The pattern of defining an inner `async` function and immediately calling it is the correct solution — and now one of the most clearly understood rules I have about hooks.

The `Notification` object has three permission states (`"default"`, `"granted"`, `"denied"`), and the notification itself is triggered inside the `timeLeft === 0` effect, reading `currentDuration` from the current settings.

#### SVG circular progress bar — the math matters

The progress bar is a `<circle>` element with animated `stroke-dashoffset`. The geometry has to be calculated, not eyeballed:

```
circumference = 2 × π × radius
offset = circumference × (timeLeft / totalDuration)
```

Two bugs emerged during development: the radius in the `offset` formula didn't match the radius of the circle element (off by 15px), and the fraction was inverted — `totalDuration / timeLeft` instead of `timeLeft / totalDuration`, which caused the bar to animate multiple full turns. The CSS transition (`transition: stroke-dashoffset 1s linear`) must be on the `<circle>`, not the `<svg>` parent.

#### `@starting-style` for dialog animation

The `SettingsModal` opening animation (opacity + translateY) uses the native CSS `@starting-style` rule — a 2023/2024 addition to the platform — without any JavaScript or Framer Motion. It applies a "before-first-paint" style to the element, which the browser interpolates from on `display` change.

#### Accessibility — keyboard support on custom radio buttons

The font and color selectors in `SettingsModal` are custom-styled radio inputs: the `<input>` is visually hidden via `appearance-none`, and a `<label>` acts as the visible control. A `tabIndex={0}` on the label makes it focusable, but focus alone doesn't make `Space` activate it — only native `<button>` and `<a>` elements have that behavior.

```tsx
// Pattern for activating any focusable non-interactive element via keyboard
onKeyDown={(e) => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();        // prevents scroll on Space
    e.currentTarget.click();   // triggers the htmlFor association
  }
}}
```

`e.currentTarget` targets the element the handler is attached to (the label), not the child that received the event (`e.target`). This distinction matters when the label contains child nodes.

#### `tailwind-merge` and custom presets — a naming collision

The design system required 20+ custom typography presets defined as `@utility text-preset-*` in `index.css`. These broke silently when passed through `cn()`: `tailwind-merge` treats any class starting with `text-` as a Tailwind text utility, and merges (removes) earlier classes in the group. The fix was to take the preset class out of `cn()` and concatenate it directly. Responsive variants (`md:text-preset-*`) caused a second issue: Tailwind's responsive prefixes only work on its own utilities, not on custom classes — responsive overrides had to be written in `@media` blocks inside `index.css` instead.

### Continued development

- **Data-first typing** — `as const` arrays + `(typeof X)[number]` as the default pattern for union types that also need to be iterable. Single source of truth, no duplication.
- **Runtime validation on `JSON.parse`** — the `as Settings` cast works but is unsafe. Zod or a type guard function is the next step to learn for localStorage values.
- **`useReducer` + complex state** — I understand the pattern well on this project. The next goal is applying it to state with more interdependencies and to identify when it belongs in a custom hook rather than in the component.
- **`useEffect` + `setInterval` stale closures** — the cleanup + `useRef` pattern is understood and applied, but it isn't yet automatic. This is a pattern I want to be able to write from scratch without reference.
- **Discriminated unions in TypeScript** — the `action.type` pattern is clear. The next step is applying discriminated unions to model state shapes, not just actions.

## Author

- Frontend Mentor - [@TomSif](https://www.frontendmentor.io/profile/TomSif)
- GitHub - [@TomSif](https://github.com/TomSif)

## Acknowledgments

This project was built with AI-assisted mentoring (Claude). The approach: I code by hand, Claude acts as a Socratic mentor — asking questions, explaining concepts, reviewing my reasoning. When I got stuck, Claude helped me explore solutions, but key insights (like identifying the async constraint on `useEffect`, reasoning about `status` as a 3-value union rather than two booleans, or catching the `tailwind-merge` naming collision via DevTools) emerged from my own analysis.

Specific AI contributions are documented transparently in my [progression log](./progression.md):

- **Written by Claude:** interactive Context API concept map (pedagogical session), pattern breakdowns for `useReducer` and `useEffect` + `setInterval`
- **My initiative:** the `status: "idle"` reset on mode change (UX reasoning), `handleButtonClick` architecture, `draftSettings` isolation pattern, lazy `localStorage` initialization written without assistance after the pattern was explained
- **Collaborative:** debugging the `tailwind-merge` preset collision, SVG formula corrections, `@starting-style` discovery and integration, accessibility audit
