import { memo, useCallback, useEffect, useState } from "react";
import { fetchRecord } from "../airtable-helper";
import CloseButton from "../resources/icons/close-button";
import { MapIcon } from "../resources/icons/map-icon";
import CardPlaceHolder from "../resources/placeHolder/card-placeHolder";
import { ImagePlaceHolder } from "../resources/placeHolder/image";
import ImageSlider from "./image-slider";

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
  const [record, setRecord] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // useEffect(() => {
  //   const description = "This is a map showing the location of various places.";
  //   if (!record?.fields?.Description) return;
  //   const speech = new SpeechSynthesisUtterance(record?.fields.Description);
  //   window.speechSynthesis.speak(speech);

  //   return () => {
  //     console.log("Cancelling speech");
  //     window.speechSynthesis.cancel();
  //   };
  // }, [record]);

  function getDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const cleanRecord = useCallback((record: any) => {
    if (record.fields.Geocache) {
      delete record.fields.Geocache;
    }
    if (record.fields.date || record.fields.updated) {
      record.fields.date = getDate(record.fields.date);
      record.fields.updated = getDate(record.fields.updated);
    }
    return record;
  }, []);

  const getRecord = useCallback(
    async (signal: AbortSignal, recordId: string) => {
      try {
        const respJson = await fetchRecord(signal, recordId);
        const record = cleanRecord(respJson);
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

    if (!recordId) return;
    setIsLoading(true);
    getRecord(signal, recordId).then((record) => {
      if (!record) return;
      setRecord(record);
      setIsLoading(false);
    });

    return function cleanup() {
      setIsLoading(false);
      abortController.abort();
    };
  }, [cleanRecord, getRecord, recordId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFullScreen) setIsFullScreen(false);
        else onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen, onClose]);

  return (
    <>
      <div
        className={`
        fixed left-0 top-0 z-40 h-full sm:min-w-[320px] w-full
        ${isOpen ? "block" : "-translate-x-full"}
        ${isFullScreen ? "w-full flex-row sm:w-full" : "sm:w-1/4 flex-col "}
        flex shadow-lg bg-gray-100 dark:bg-gray-800 transition-all duration-300 ease-in-out `}
      >
        <CloseButton
          classNames={`absolute w-10 h-10 z-40 top-6  
          ${isFullScreen ? "left-6 w-10 h-10" : "left-6 w-8 h-8"}
          transition-all
          `}
          onClick={onClose}
        />

        {/* Image Container */}
        <div
          onClick={() => setIsFullScreen(!isFullScreen)}
          className={` img-container
          ${
            isFullScreen
              ? "w-full sm:w-1/2 md:w-full lg:w-8/12 h-full"
              : "w-full h-1/2 lg:h-1/3 shadow-lg"
          }
          transition-all duration-300 ease-in-out
          `}
        >
          {record?.fields?.Image?.length === 0 ? (
            <ImagePlaceHolder />
          ) : (
            <ImageSlider
              key={record?.id}
              images={record?.fields?.Image as [any]}
              isFullScreen={isFullScreen}
            />
          )}
        </div>
        <div
          className={` 
          ${
            isFullScreen
              ? " w-4/12 h-full right-0 "
              : "left-0 bottom-0 h-2/3 w-full  top-1/3"
          }
          flex flex-col space-y-6 justify-start p-8 overflow-auto hide-scrollbar
          `}
        >
          {isLoading ? (
            <CardPlaceHolder />
          ) : (
            <div>
              <ul className="space-y-2">
                <h1 className="pb-3 text-1xl font-bold tracking-tighter sm:text-2xl xl:text-3xl/none bg-clip-text text-transparent dark:text-zinc-200 text-zinc-800">
                  {record?.fields?.Title ?? "Not Available"}
                </h1>
                {record?.fields &&
                  Object.entries(record.fields).map(([key, value]) => {
                    <li>Sanjay</li>;
                    if (
                      typeof value === "string" ||
                      (Array.isArray(value) &&
                        value.every((v) => typeof v === "string"))
                    ) {
                      if (key === "Title") return null;
                      return (
                        <li key={key}>
                          <span className=" text-base leading-6 font-semibold text-zinc-700 dark:text-zinc-100">
                            {key === "Description" ? "" : `${key} : `}
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

export default memo(PlaceDetailModal);
