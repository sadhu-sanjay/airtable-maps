"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";
import { Spinner } from "~/components/spinner";
import { DropdownItem, Record } from "~/components/models/types";

import {
  MAPS_API_KEY,
  RECORDS_FETCH_URL,
  TAGS_FETCH_URL,
  VIEWS_FETCH_URL,
} from "~/config";
import MyList from "./my-list";
import MyMap from "./map";
import DropdownMultiSelect from "./common/dropdown/dropdown-multiSelect";
import SearchBar from "./search-bar";
import { myDebounce } from "./lib/utils";
import EmptyList from "./common/empty-states/empty-list";
import useRecords from "./useRecords";
import PlaceDetailModal from "./my-pages/place-detail";
import Dropdown from "./common/dropdown/dropdown";
import { ShareIcon } from "./resources/icons/share";
import { useQuery } from "@tanstack/react-query";

export default function Home() {

  const asideRef = useRef<HTMLDivElement>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string>();
  const [listRecords, setListRecords] = useState<Record[]>([]);
  const [mapRecords, setMapRecods] = useState<Record[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchTerms = useRef<string[]>([]);
  const currentItem = useRef<DropdownItem | undefined>(undefined)

  const {
    isStreamingRecords,
    isLoadingRecords,
    records,
    fetchRecords,
    status,
  } = useRecords();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<DropdownItem[]>([]);
  const [unSelectedTags, selectUnselectedTags] = useState<DropdownItem[]>([]);

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetch(TAGS_FETCH_URL).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  console.log("RENDER MAP COMPONENT");

  const updateRecords = useCallback((newRecords: Record[]) => {
    setMapRecods(newRecords);
    setListRecords(newRecords);
  }, []);

  useEffect(() => {
    updateRecords(records);
  }, [updateRecords, records]);
  /**
   *  End Update views when new records are fetched
   */

  /**
   * FILTER START
   */
  const filterHandler = useCallback(() => {
    // match allThree selected regions, searchTerms and tags, if any one of them is empty then match with other two,
    // of if 2 are empty then match with the one that is not empty
    console.log("SElect", selectedTags.length)
    console.log("Unselected", unSelectedTags.length)
    let newFilteredRecords = records.filter((record) => {
      let tagMatch = false;
      let searchMatch = false;
      let excludeTagMatch = true

      // check if any of the selected tags match with record tags

      tagMatch = selectedTags.some((tag: DropdownItem) => {
        return record.Tags?.toLowerCase().split(',').includes(tag.label.toLowerCase());
      });

      if (unSelectedTags.length > 0 && tagMatch) {
        excludeTagMatch = !record.Tags?.toLowerCase().split(',').some((tag) => {
          return unSelectedTags.some((utag) => utag.label.toLowerCase() === tag.toLowerCase())
        })
      }

      // check if any of the search terms match with record search string
      if (searchTerms.current.length > 0) {
        searchMatch = searchTerms.current.every((term) =>
          record.SearchString?.includes(term.toLowerCase())
        );
      } else {
        searchMatch = true;
      }

      return tagMatch && searchMatch && excludeTagMatch
    });

    updateRecords(newFilteredRecords);
  }, [records, selectedTags, updateRecords, unSelectedTags]);

  const searchHandler = useCallback(
    (value: string) => {
      searchTerms.current = value.split(" ");
      filterHandler();
    },
    [filterHandler]
  );

  let abortController = useRef<AbortController | null>(null);
  const viewChangedHandler = useCallback(
    (item?: DropdownItem) => {
      if (!item) return

      setSelectedTags([]);
      selectUnselectedTags([]);
      setSearchTerm("");
      currentItem.current = item 

      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      fetchRecords(item, abortController.current.signal);
    },
    [fetchRecords]
  );

  const tagsHandler = useCallback(
    (newTagsHandler: Array<DropdownItem>) => {
      filterHandler();
    },
    [filterHandler]
  );

  /**
   * FILTER END
   */

  const handleZoom = useCallback((viewPortRecords: Record[]) => {
    setListRecords(viewPortRecords);
  }, []);

  const onRecordSelected = useCallback((selectedId: string) => {
    console.log("selectedId", selectedId);
    setSelectedRecordId(selectedId);
    setIsModalOpen(true);
  }, []);

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner message={"Loading.."} />;
      case Status.FAILURE:
        return (
          <EmptyList
            title="Failed to load Map."
            subtitle="Please try refreshing the page."
          />
        );
      case Status.SUCCESS:
        return (
          <MyMap
            handleZoom={handleZoom}
            records={mapRecords}
            onRecordSelected={onRecordSelected}
          />
        );
    }
  };

  const closeDetail = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const labelAndValues = useMemo(() => ({ label: "name", value: "id" }), []);

  return (
    <div className="h-screen flex flex-col-reverse sm:flex-row relative ">
      <aside
        ref={asideRef}
        className="h-1/2 sm:h-full w-full md:w-4/12 lg:w-3/12 sm:min-w-[320px]"
      >
        <div className="relative shadow-lg bg-gray-100 dark:bg-gray-800 flex w-full h-full flex-col gap-3 justify-start p-4 ">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onValueChange={searchHandler}
          />
          <div className="flex justify-between align-middle">
            <Suspense>
              <Dropdown
                label="Views"
                placeholder="Views"
                itemGotSelected={viewChangedHandler}
                fetchUrl={VIEWS_FETCH_URL}
                labelAndValue={labelAndValues}
              />
            </Suspense>
            <DropdownMultiSelect
              label="include tags"
              placeholder="include tags"
              doneCallBack={tagsHandler}
              fetchUrl={TAGS_FETCH_URL}
              selectedItems={selectedTags}
              setSelectedItems={setSelectedTags}
              isLoading={tagsQuery.isLoading}
              items={tagsQuery.data?.map((tag: any) => ({
                label: tag.name,
                value: tag.id,
                color: tag.color,
              }))}
            />
            <DropdownMultiSelect
              label="exclude tags"
              placeholder="exclude tags"
              doneCallBack={tagsHandler}
              fetchUrl={TAGS_FETCH_URL}
              selectedItems={unSelectedTags}
              setSelectedItems={selectUnselectedTags}
              isLoading={tagsQuery.isLoading}
              items={tagsQuery.data?.map((tag: any) => ({
                label: tag.name,
                value: tag.id,
                color: tag.color,
              }))}
            />
          </div>
          <MyList
            asideRef={asideRef}
            records={listRecords}
            isLoadingRecords={isLoadingRecords}
            isStreamingRecords={isStreamingRecords}
            onRecordSelect={onRecordSelected}
            status={status}
            refetchRecords={() => {
                viewChangedHandler(currentItem.current) 
            }}
          />
        </div>
      </aside>

      <main className=" w-full h-1/2 sm:h-full sm:w-8/12 lg:w-9/12 ">
        <Wrapper libraries={["marker"]} apiKey={MAPS_API_KEY} render={render} />
      </main>

      <aside>
        <PlaceDetailModal
          recordId={selectedRecordId ?? ""}
          onClose={closeDetail}
          isOpen={isModalOpen}
        />
      </aside>
    </div>
  );
}
function axios(RECORDS_FETCH_URL: any) {
  throw new Error("Function not implemented.");
}
