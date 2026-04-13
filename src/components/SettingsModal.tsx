import { useRef, useEffect } from "react";
//1* Interface
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
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
      className="w-[86vw] max-w-135 h-auto bg-white mx-auto rounded-3xl flex flex-col p-6 md:p-9 z-500"
      ref={dialogRef}
      id="settingsModal"
    >
      <div className="modal-header flex justify-between pb-6 border-b-2 border-b-grey-200">
        <h2 className="text-preset-1 text-blue-900">Settings</h2>
        <button
          aria-label="close the settings page"
          type="button"
          onClick={() => onClose()}
          className="w-3 h-3 cursor-pointer"
        >
          <img src="/assets/icon-close.svg" alt="" />
        </button>
      </div>
    </dialog>
  );
}

export default SettingsModal;
