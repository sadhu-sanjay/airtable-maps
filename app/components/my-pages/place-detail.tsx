import * as GMPX from "@googlemaps/extended-component-library/react";

const DEFAULT_CENTER = "45,-98";
const DEFAULT_ZOOM = 4;
const DEFAULT_ZOOM_WITH_LOCATION = 16;
import React, { RefObject, forwardRef } from "react";
import Image from "next/image";
import { Record } from "~/app/components/types";
import CloseButton from "../resources/svg/close-button";
import ImagePlaceHolder from "../resources/placeHolder/image";
const placeId = "ChIJ-dz__yM3L4kRNk6Sk3Th_uI";

const PlaceDetail = ({ recordId }: { recordId: string }) => {
  const showPlaceHolder = true;

  return (
    <>
      <div className="flex flex-col shadow-lg w-full h-full bg-gray-100 dark:bg-gray-800 mx-auto overflow-hidden">
        <CloseButton onClick={() => window.location.reload()} />
        <div className="img-container w-full bg-red-700 h-1/3 min-h-[33.33%] shadow-lg">
          {showPlaceHolder ? (
            <ImagePlaceHolder />
          ) : (
            <img
              src="https://source.unsplash.com/random"
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div
          className=" flex flex-col space-y-6 justify-start p-8 overflow-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <h1 className="text-1xl font-bold tracking-tighter sm:text-2xl xl:text-2xl/none bg-clip-text text-transparent dark:text-zinc-200 text-zinc-800">
            ’Ene’io Botanical Garden & Visitor Center
          </h1>
          <ul className="space-y-2 ">
            {Array.from({ length: 15 }).map((_, i) => (
              <li key={i}>
                <p className="text-sm leading-6 font-semibold text-zinc-700 dark:text-zinc-100">
                  Vavaʻu, Tonga
                </p>
                <p className="text-sm leading-6 font-normal text-zinc-500 dark:text-zinc-400">
                  Our features are designed to enhance your workflow
                  productivity and streamline your workflow.
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlaceDetail;
