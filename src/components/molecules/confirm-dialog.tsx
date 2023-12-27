import React from "react";
import DeleteButton from "../resources/icons/delete-button";
import CloseButton from "../resources/icons/close-button";
import CancelButton from "../resources/icons/cancel-button";

interface DeleteConfirmDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  onCancel,
  onConfirm,
}) => {
  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className=" overflow-y-auto overflow-x-hidden fixed inset-0 
      md:inset-0 h-[calc(100%-1rem)] max-h-full 
      z-50 flex items-center justify-center overflow-auto "
    >
      <div className="relative w-full max-w-xs max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
            onClick={onCancel}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <svg
              className="mx-auto m-4 text-gray-400 w-8 h-8 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="m-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure ?
            </h3>
            <div className="flex gap-2 justify-around ">
              <DeleteButton title="Yes" onClick={onConfirm} />
              <CancelButton title=" No" onClick={onCancel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
