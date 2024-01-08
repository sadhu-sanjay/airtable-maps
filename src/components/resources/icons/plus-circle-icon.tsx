import { SVGAttributes } from "react";

export function PlusCircleIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg
      data-slot="icon"
      aria-hidden="true"
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
