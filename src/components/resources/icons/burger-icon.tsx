import React, { SVGAttributes } from "react";

export const BurgerIcon = (props: SVGAttributes<SVGElement>) => (

  <svg
    viewBox="0 0 100 125"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className="m-2 rounded-lg active:scale-125 transition-transform duration-500 ease-in-out"
  >
    <rect x="10" y="15.21" width="80" height="18.15" rx="5.13" />
    <rect x="10" y="40.93" width="80" height="18.15" rx="5.13" />
    <rect x="10" y="66.65" width="80" height="18.15" rx="5.13" />
  </svg>
);
