import { memo, useCallback, useEffect, useState } from "react";
import { fetchRecord } from "../airtable-helper";
import CloseButton from "../resources/icons/close-button";
import { MapIcon } from "../resources/icons/map-icon";
import CardPlaceHolder from "../resources/placeHolder/card-placeHolder";
import { ImagePlaceHolder } from "../resources/placeHolder/image";
import ImageSlider from "./image-slider";
import EditButton from "../atoms/edit-button";
import EditableText from "../organisms/editable-text";
import { PATCH } from "~/api/airtable/route";
import { toast } from "sonner";
import DeleteButton from "../resources/icons/delete-button";
import { DELETE_RECORD_URL, TAGS_FETCH_URL } from "~/config";
import DeleteConfirmDialog from "../molecules/confirm-dialog";
import { EditableChips } from "../organisms/editable-chips";
import { DropdownItem, Tag } from "../models/types";
import { useQuery } from "@tanstack/react-query";
import Label from "../atoms/labels/label";

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
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetch(TAGS_FETCH_URL).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  async function updateRecord(fields: any) {
    const id = toast.loading("Updating Record");

    const req = {
      body: {
        id: recordId, // replace with your record id
        fields: fields,
      },
    };

    const response = await PATCH(req);

    toast.dismiss(id);
    toast.success("Record Updated");
    console.log(response);
  }

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

    if (!record.fields.Tags) {
      // Add the missing records
      record.fields.Tags = [];
    }
    if (!record.fields.Description) {
      record.fields.Description = "";
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
          className={`mt-2 z-50 absolute top-4 left-4 rounded-full p-0
          ${isFullScreen ? "w-9 h-9" : " w-8 h-8"}
          transition-all `}
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
                {record?.fields &&
                  Object.entries(record.fields).map(([key, value]) => {
                    if (
                      // Don't show These fields
                      key === "Image" ||
                      key === "date" ||
                      key === "updated" ||
                      key === "Geocache"
                    )
                      return null;

                    if (key === "Title") {
                      return (
                        <h1
                          key={key}
                          className="pb-3 text-1xl font-bold tracking-tighter sm:text-2xl xl:text-3xl/none bg-clip-text text-transparent dark:text-zinc-200 text-zinc-800"
                        >
                          {record?.fields?.Title ?? "Not Available"}
                        </h1>
                      );
                    } else if (key === "Description") {
                      return (
                        <EditableText
                          key={key}
                          value={value as string}
                          onSave={(text) => {
                            updateRecord({ Description: text });
                          }}
                        />
                      );
                    } else if (key === "Tags") {
                      return (
                        <div key={key}>
                          <Label>{key}</Label>
                          <EditableChips
                            key={key}
                            label="Tags"
                            initialTags={value as [string]}
                            data={tagsQuery.data}
                            onSubmit={(tags: Tag[]) => {
                              updateRecord({
                                Tags: tags.map((tag) => tag.id),
                              });
                            }}
                          />
                        </div>
                      );
                    } else if (key === "Coordinates (lat, lng)") {
                      return (
                        <>
                          <Label>{key}</Label>
                          <MapIcon cords={value as string} />;
                        </>
                      );
                    } else if (key === "URL") {
                      return (
                        <>
                          <Label>{key}</Label>
                          <a
                            className="text-blue-500"
                            href={value as string}
                            target="_blank"
                          >
                            {value as string}
                          </a>
                        </>
                      );
                    }

                    return (
                      <li key={key}>
                        <Label>{key}</Label>
                        <span className="pr-2 text-base leading-6 text-zinc-500 dark:text-zinc-100">
                          {Array.isArray(value)
                            ? value.join(",")
                            : (value as string)}
                        </span>
                      </li>
                    );
                  })}
              </ul>
              <DeleteButton
                title="Delete"
                className="rounded-md m-2 "
                onClick={() => setDeleteConfirm(true)}
                showIcon
              />
              {deleteConfirm && (
                <DeleteConfirmDialog
                  onConfirm={async () => {
                    setDeleteConfirm(false);
                    await deleteRecord(recordId);
                    onClose();
                  }}
                  onCancel={() => setDeleteConfirm(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(PlaceDetailModal);

// delete record using fetch
const deleteRecord = async (_recordId: string) => {
  toast.loading("Deleting Record");

  const response = await fetch(DELETE_RECORD_URL(_recordId), {
    method: "DELETE",
  });

  if (!response.ok) {
    toast.dismiss();
    toast.error("Error Deleting Record");
    return;
  }

  const respJson = await response.json();

  toast.dismiss();
  toast.success("Record Deleted");
  console.log(respJson);
};
