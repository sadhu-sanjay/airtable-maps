import * as GMPX from "@googlemaps/extended-component-library/react";

const DEFAULT_CENTER = "45,-98";
const DEFAULT_ZOOM = 4;
const DEFAULT_ZOOM_WITH_LOCATION = 16;
import React, {
  RefObject,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { Record } from "~/app/components/types";
import CloseButton from "../resources/svg/close-button";
import ImagePlaceHolder from "../resources/placeHolder/image";
import { RECORD_GET } from "~/app/config";
const placeId = "ChIJ-dz__yM3L4kRNk6Sk3Th_uI";

const PlaceDetail = ({ recordId }: { recordId: string }) => {
  const showPlaceHolder = true;
  const [fields, setFields] = useState<[string: unknown]>();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(RECORD_GET + "/" + recordId, { signal })
      .then(async (resp) => {
        const result: { fields: unknown } = await resp.json();
        setFields(result.fields as [string: unknown]);

      })
      .catch((err) => {
        if (signal.aborted)
          return console.log(`${RECORD_GET} request was aborted.`);
        console.log("Place detail RECORD GET", err);
      });

    return function cleanup() {
      abortController.abort();
    };
  }, [recordId]);

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
         Random Title 
          </h1>
          <ul className="space-y-2 ">
            {Object.entries(fields || {}).map(([key, value]) => (
              <li key={key}>
                <p className="text-sm leading-6 font-semibold text-zinc-700 dark:text-zinc-100">
                  {key}
                </p>
                <p className="text-sm leading-6 font-normal text-zinc-500 dark:text-zinc-400">
                  {/*if value is an array ignore  */}
                  {Array.isArray(value)
                    ? value.map((v) => v + " ")
                    : value?.toString()}
                    
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
