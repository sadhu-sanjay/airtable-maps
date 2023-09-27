import * as GMPX from "@googlemaps/extended-component-library/react";

const DEFAULT_CENTER = "45,-98";
const DEFAULT_ZOOM = 4;
const DEFAULT_ZOOM_WITH_LOCATION = 16;
import React, {
  RefObject,
  forwardRef,
  useCallback,
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
  const [record, setRecord] = useState<Record>();

  function getDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const cleanRecord = useCallback((record: Record) => {
    delete record.fields.Geocache;
    if (record.fields.date || record.fields.Updated) {
      record.fields.date = getDate(record.fields.date);
      record.fields.Updated = getDate(record.fields.Updated);
    }
    return record;
  }, []);

  const getRecord = useCallback(
    async (recordId: string, signal: AbortSignal) => {
      try {
        const req = await fetch(RECORD_GET + "/" + recordId, { signal });
        const result = await req.json();
        const record = cleanRecord(result);
        return record;
      } catch (e: any) {
        if (e.name === "AbortError") {
          return console.log("Place Detail fetch aborted");
        }
        console.log(e);
      }
    },
    [cleanRecord]
  );

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getRecord(recordId, signal).then((record) => {
      setRecord(record);
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [cleanRecord, getRecord, recordId]);

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
            {record?.fields?.Title}
          </h1>
          <ul className="space-y-2">
            {record?.fields &&
              Object.entries(record.fields).map(([key, value]) => {
                if (
                  typeof value === "string" ||
                  (Array.isArray(value) &&
                    value.every((v) => typeof v === "string"))
                ) {
                  // const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <li key={key}>
                      <span className="text-sm leading-6 font-semibold text-zinc-700 dark:text-zinc-100">
                        {key}
                        {" : "}&nbsp;&nbsp;
                      </span>
                      <span className="text-sm leading-6 font-normal text-zinc-500 dark:text-zinc-400">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </span>
                    </li>
                  );
                }
                return null;
              })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PlaceDetail;
