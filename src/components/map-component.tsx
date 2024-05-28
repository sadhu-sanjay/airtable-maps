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
import {
  PlaceOverview,
  PlacePicker,
  IconButton,
  PlaceDirectionsButton,
  PlaceDataProvider,
  PlaceReviews
} from "@googlemaps/extended-component-library/react";
import { DEFAULT_LOCATION } from "~/CONST";

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
      let excludeTagMatch = false

      // check if any of the selected tags match with record tags

      if (selectedTags.length > 0) {
        tagMatch = selectedTags.some((tag: DropdownItem) => {
          return record.Tags?.toLowerCase()
            .split(",")
            .includes(tag.label.toLowerCase());
        });
      } else {
        tagMatch = true;
      }

      if (unSelectedTags.length > 0 ) {
        excludeTagMatch = !record.Tags?.toLowerCase().split(',').some((tag) => {
          return unSelectedTags.some((utag) => utag.label.toLowerCase() === tag.toLowerCase())
        })
      }else {
        excludeTagMatch = true
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
            place={place}
          />
        );
    }
  };

  const closeDetail = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const labelAndValues = useMemo(() => ({ label: "name", value: "id" }), []);
  const [place, setPlace] = useState<google.maps.places.Place | undefined>(undefined);

  return (
    <div className="h-screen flex flex-col-reverse sm:flex-row relative ">
      <aside
        ref={asideRef}
        className=" h-1/2 sm:h-full w-full md:w-4/12 lg:w-3/12 sm:min-w-[320px] overflow-y-auto"
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
              viewChangedHandler(currentItem.current);
            }}
          />
        </div>
      </aside>

      <main className=" w-full sm:w-8/12 lg:w-9/12 h-1/2 sm:h-full">
        <Wrapper libraries={["marker"]} apiKey={MAPS_API_KEY} render={render} />
      </main>

      <aside
        className="bg-transparent absolute top-0 sm:right-0  h-auto max-h-full
      w-full sm:w-4/12 lg:w-3/12 overflow-y-auto "
      >
        <div className="bg-white w-full p-4 sticky top-0 shadow-lg rounded-lg">
          <PlacePicker
            onPlaceChange={(e: Event) => {
              const target = e.target;
              const value = target?.value;
              console.log("Place ChangesssSanjay", value);
              if (value) {
                setPlace(value);
              }
            }}
            placeholder="Enter a place to see its address"
            className="w-full"
          />
        </div>
        <PlaceOverview
          place={place?.id}
          // place="ChIJbf8C1yFxdDkR3n12P4DkKt0"
          // travelOrigin={DEFAULT_LOCATION}
        >
          <div slot="action">
            <IconButton
              slot="action"
              variant="outlined"
              onClick={() => setPlace(undefined)}
              icon="note_add"
            >
              Add to airtable
            </IconButton>
          </div>
          <div slot="action">
            <PlaceDirectionsButton slot="action" variant="outlined">
              Directions
            </PlaceDirectionsButton>
          </div>
          <IconButton
            slot="action"
            variant="filled"
            onClick={() => setPlace(undefined)}
            icon="close"
            className="ml-auto "
          >
          </IconButton>
        </PlaceOverview>
      </aside>

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
