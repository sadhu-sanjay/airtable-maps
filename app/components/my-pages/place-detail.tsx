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
import { RECORD_GET } from "~/app/config";
import ImageSlider from "./image-slider";
import { MapIcon } from "../resources/svg/map-icon";
import { Spinner3, Spinner4 } from "../spinner";
import CardPlaceHolder from "../resources/placeHolder/card-placeHolder";
const placeId = "ChIJ-dz__yM3L4kRNk6Sk3Th_uI";

interface ModalProps {
  recordId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PlaceDetailModal: React.FC<ModalProps> = ({
  recordId,
  isOpen,
  onClose,
}) => {
  const [record, setRecord] = useState<Record>();
  const [isLoading, setIsLoading] = useState(false);

  function getDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const cleanRecord = useCallback((record: Record) => {
    delete record.fields.Geocache;
    if (record.fields.date || record.fields.updated) {
      record.fields.date = getDate(record.fields.date);
      record.fields.updated = getDate(record.fields.updated);
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

    setIsLoading(true);
    getRecord(recordId, signal).then((record) => {
      if (!record) return;
      setRecord(record);
      setIsLoading(false);
    });

    return function cleanup() {
      setIsLoading(false);
      abortController.abort();
    };
  }, [cleanRecord, getRecord, recordId]);

  return (
    <>
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } fixed left-0 top-0 flex flex-row-reverse shadow-lg w-full h-full bg-gray-100 dark:bg-gray-800 mx-auto overflow-hidden`}
      >
        <div className="bg-blue-900 img-container w-8/12 h-full right-0 shadow-lg">
          <ImageSlider
            key={record?.id}
            images={record?.fields?.Image as [any]}
          />
        </div>
        <div
          className="relative w-4/12 flex flex-col space-y-6 justify-start p-8 overflow-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {isLoading ? (
            <CardPlaceHolder />
          ) : (
            <div>
              <CloseButton classNames="absolute right-8" onClick={onClose} />
              <ul className="space-y-2">
                <h1 className="pb-3 text-1xl font-bold tracking-tighter sm:text-2xl xl:text-2xl/none bg-clip-text text-transparent dark:text-zinc-200 text-zinc-800">
                  {record?.fields?.Title ?? "Title not found"}
                </h1>
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
                          <span className=" text-base leading-6 font-semibold text-zinc-700 dark:text-zinc-100">
                            {key} {" : "}&nbsp;&nbsp;
                          </span>
                          <span className="text-sm leading-6 font-normal text-zinc-500 dark:text-zinc-400">
                            {key === "Coordinates (lat, lng)" && (
                              <MapIcon cords={value as string} />
                            )}
                            {key === "URL" && (
                              <a
                                className="text-blue-500"
                                href={value as string}
                                target="_blank"
                              >
                                {" "}
                                {value}{" "}
                              </a>
                            )}
                            {Array.isArray(value)
                              ? value.join(", ")
                              : key !== "Coordinates (lat, lng)" &&
                                key !== "URL" &&
                                value}
                          </span>
                        </li>
                      );
                    }
                    return null;
                  })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaceDetailModal;
