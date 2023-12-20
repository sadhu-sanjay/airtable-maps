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
    strokeWidth="1"
    stroke="white"
    className={`cursor-pointer  text-white bg-gradient-to-r from-zinc-500/20 via-zinc-600/20 to-zinc-700/20 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-zinc-300 dark:focus:ring-zinc-800 shadow-sm shadow-zinc-500/50 dark:shadow-sm dark:shadow-zinc-800/80 font-medium rounded-full text-sm  text-center 
    ${classNames}`}
    onClick={onClick}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M16 8l-8 8"></path>
    <path d="M8 8l8 8"></path>
  </svg>
);

export default CloseButton;

// <svg xmlns="http://www.w3.org/2000/svg" className={`${classNames} icon icon-tabler icon-tabler-x`} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" >

// </svg>
