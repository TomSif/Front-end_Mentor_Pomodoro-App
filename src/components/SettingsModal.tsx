import { useRef, useEffect, useState } from "react";
import useSettings from "../hooks/useSettings";
import type { AppColor, AppFont, Settings } from "../types/types";
import { cn } from "../lib/utils";
// Interface
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
//SettingsModal Components
function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  //hook useSettings
  const { settings, setSettings } = useSettings();
  //useState
  const [draftSettings, setDraftSettings] = useState<Settings>(settings);
  //useRef
  const dialogRef = useRef<HTMLDialogElement>(null);
  //useEffect to handle show/close Modal
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      className="w-[86vw] max-w-135  bg-white mx-auto rounded-3xl flex flex-col p-6 md:p-9 z-500 relative overflow-visible my-auto backdrop:bg-blue-850"
      ref={dialogRef}
      id="settingsModal"
    >
      <section className="modal-header flex justify-between pb-6 border-b-2 border-b-grey-200">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-preset-1-settings text-blue-900">Settings</h2>
          <button
            aria-label="close the settings page"
            type="button"
            onClick={() => onClose()}
            className="w-3 h-3 cursor-pointer"
          >
            <img src="/assets/icon-close.svg" alt="" />
          </button>
        </div>
      </section>
      <form className="flex flex-col w-full py-6" action="">
        <fieldset className="input-number flex flex-col w-full gap-2 pb-6  border-b-2 border-grey-200">
          <legend className="text-preset-3-settings text-blue-850 text-center md:text-left pb-6 md:pb-4">
            TIME (MINUTES)
          </legend>
          <div className="flex flex-col gap-2 md:flex-row md:gap-6">
            <div className="flex  md:flex-col gap-2 md:items-start justify-between items-center">
              <label
                className="text-preset-4-settings text-blue-850/40"
                htmlFor="pomodoro"
              >
                pomodoro
              </label>
              <input
                className="w-35 h-10 text-blue-850 bg-blue-50 rounded-xl p-2.75 hover:border-[#979797] border-2 border-transparent"
                type="number"
                name="pomodoro"
                id="pomodoro"
                value={Number(draftSettings.durations.pomodoro)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = Number(e.target.value);
                  const updated = {
                    ...draftSettings,
                    durations: { ...draftSettings.durations, pomodoro: value },
                  };
                  return setDraftSettings(updated);
                }}
              />
            </div>
            <div className="flex md:flex-col md:gap-2 md:items-start justify-between items-center">
              <label
                className="text-preset-4-settings text-blue-850/40"
                htmlFor="shortBreak"
              >
                short break
              </label>
              <input
                className="w-35 h-10 text-blue-850 bg-blue-50 rounded-xl p-2.75 hover:border-[#979797] border-2 border-transparent"
                type="number"
                name="shortBreak"
                id="shortBreak"
                value={Number(draftSettings.durations["short break"])}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = Number(e.target.value);
                  const updated = {
                    ...draftSettings,
                    durations: {
                      ...draftSettings.durations,
                      "short break": value,
                    },
                  };
                  return setDraftSettings(updated);
                }}
              />
            </div>
            <div className="flex md:flex-col md:gap-2 md:items-start justify-between items-center">
              <label
                className="text-preset-4-settings text-blue-850/40"
                htmlFor="longBreak"
              >
                long break
              </label>
              <input
                className="w-35 h-10 text-blue-850 bg-blue-50 rounded-xl p-2.75 hover:border-[#979797] border-2 border-transparent"
                type="number"
                name="longBreak"
                id="longBreak"
                value={Number(draftSettings.durations["long break"])}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = Number(e.target.value);
                  const updated = {
                    ...draftSettings,
                    durations: {
                      ...draftSettings.durations,
                      "long break": value,
                    },
                  };
                  return setDraftSettings(updated);
                }}
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="fonts-radio-buttons w-full text-center py-6 border-b-2 border-grey-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h4 className="text-preset-3-settings text-blue-900 text-center pb-4 md:pb-0">
              FONT
            </h4>
            <div className="fonts-radios-container flex gap-4 w-38 mx-auto md:mx-0">
              <label
                className={cn(
                  "text-preset-2-settings w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-850/73 rounded-full",
                  "has-checked:bg-black has-checked:text-white ",
                )}
                htmlFor="font1"
              >
                <input
                  className="sr-only font1"
                  type="radio"
                  name="font"
                  id="font1"
                  value="kumbh-sans"
                  checked={draftSettings.font === "kumbh-sans"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDraftSettings({
                      ...draftSettings,
                      font: e.target.value as AppFont,
                    });
                  }}
                />
                Aa
              </label>
              <label
                className={cn(
                  "text-preset-2-settings w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-850/73 rounded-full",
                  "has-checked:bg-black has-checked:text-white ",
                )}
                htmlFor="font2"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="font"
                  id="font2"
                  value="space-mono"
                  checked={draftSettings.font === "space-mono"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDraftSettings({
                      ...draftSettings,
                      font: e.target.value as AppFont,
                    });
                  }}
                />
                Aa
              </label>
              <label
                className={cn(
                  "text-preset-2-settings w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-850/73 rounded-full",
                  "has-checked:bg-black has-checked:text-white ",
                )}
                htmlFor="font3"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="font"
                  id="font3"
                  value="roboto-slab"
                  checked={draftSettings.font === "roboto-slab"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDraftSettings({
                      ...draftSettings,
                      font: e.target.value as AppFont,
                    });
                  }}
                />
                Aa
              </label>
            </div>
          </div>
        </fieldset>
        <fieldset className="colors-radio-buttons w-full text-center py-6 pb-8 md:pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h4 className="text-preset-3-settings text-blue-900 text-center pb-4 md:pb-0">
              COLOR
            </h4>
            <div className="colors-radios-container flex gap-4 w-38 mx-auto md:mx-0">
              <label
                className={cn(
                  "text-preset-2 w-10 h-10 flex items-center justify-center bg-red-400 text-transparent rounded-full",
                  "has-checked:text-black",
                )}
                htmlFor="color1"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="color"
                  id="color1"
                  value="red-400"
                  checked={draftSettings.color === "red-400"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDraftSettings({
                      ...draftSettings,
                      color: e.target.value as AppColor,
                    });
                  }}
                />
                &#10003;
              </label>
              <label
                className={cn(
                  "text-preset-2 w-10 h-10 flex items-center justify-center bg-cyan-300 text-transparent rounded-full",
                  "has-checked:text-black ",
                )}
                htmlFor="color2"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="color"
                  id="color2"
                  value="cyan-300"
                  checked={draftSettings.color === "cyan-300"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDraftSettings({
                      ...draftSettings,
                      color: e.target.value as AppColor,
                    });
                  }}
                />
                &#10003;
              </label>
              <label
                className={cn(
                  "text-preset-2 w-10 h-10 flex items-center justify-center bg-purple-400 text-transparent rounded-full ",
                  "has-checked:text-black",
                )}
                htmlFor="color3"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="color"
                  id="color3"
                  value="purple-400"
                  checked={draftSettings.color === "purple-400"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDraftSettings({
                      ...draftSettings,
                      color: e.target.value as AppColor,
                    });
                  }}
                />
                &#10003;
              </label>
            </div>
          </div>
        </fieldset>
        <button
          type="button"
          data-font={draftSettings.font}
          onClick={() => {
            setSettings(draftSettings);
            onClose();
          }}
          className={`data-font bg-(--app-color) text-preset-2-settings text-white w-35 h-13 rounded-3xl  hover:bg-(--app-color) absolute bottom-0 left-1/2 -translate-x-1/2 -my-6 z-510`}
          style={{
            background: `var(--color-${draftSettings.color})`,
            fontFamily:
              draftSettings.font === "kumbh-sans"
                ? "Kumbh Sans"
                : draftSettings.font === "roboto-slab"
                  ? "Roboto Slab"
                  : "Space Mono",
          }}
        >
          APPLY
        </button>
      </form>
    </dialog>
  );
}

export default SettingsModal;
