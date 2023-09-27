import React from "react";

type Props = {
  classNames?: string;
  onClick: () => void;
};

const CloseButton: React.FC<Props> = ({ classNames, onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="absolute right-4 top-3 text-white bg-gradient-to-r from-zinc-500/20 via-zinc-600/20 to-zinc-700/20 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-zinc-300 dark:focus:ring-zinc-800 shadow-sm shadow-zinc-500/50 dark:shadow-sm dark:shadow-zinc-800/80 font-medium rounded-full text-sm  text-center "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-6 h-6 m-1"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
);

export default CloseButton;
