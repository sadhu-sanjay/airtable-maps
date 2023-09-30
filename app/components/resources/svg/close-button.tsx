import React from "react";

type Props = {
  classNames?: string;
  onClick: () => void;
};

const CloseButton: React.FC<Props> = ({ classNames, onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="white"
    className={`cursor-pointer z-40 top-4 right-4 text-white bg-gradient-to-r from-zinc-500/20 via-zinc-600/20 to-zinc-700/20 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-zinc-300 dark:focus:ring-zinc-800 shadow-sm shadow-zinc-500/50 dark:shadow-sm dark:shadow-zinc-800/80 font-medium rounded-full text-sm  text-center 
    ${classNames}`}
    onClick={onClick}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default CloseButton;
