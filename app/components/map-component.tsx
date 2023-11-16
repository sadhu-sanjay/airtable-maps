"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { useCallback, useRef, useEffect, useMemo, useState } from "react";
import { Spinner } from "~/app/components/spinner";
import { DropdownItem, Record } from "~/app/components/types";

import { MAPS_API_KEY, TAGS_FETCH_URL, VIEWS_FETCH_URL } from "~/app/config";
import MyList from "./List";
import MyMap from "./map";
import DropdownMultiSelect from "./common/dropdown/dropdown-multiSelect";
import SearchBar from "./search-bar";
import { myDebounce } from "./utility/utilityFunctions";
import EmptyList from "./common/empty-states/empty-list";
import useRecords from "./useRecords";
import PlaceDetailModal from "./my-pages/place-detail";
import Dropdown from "./common/dropdown/dropdown";

export default function Home() {
  const asideRef = useRef<HTMLDivElement>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string>();
  const [listRecords, setListRecords] = useState<Record[]>([]);
  const [mapRecords, setMapRecods] = useState<Record[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchTerms = useRef<string[]>([]);
  const { isLoadingRecords, records, fetchRecords } = useRecords();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<any[]>([]);

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
    let newFilteredRecords = records.filter((record) => {
      let tagMatch = false;
      let searchMatch = false;

      // check if any of the selected tags match with record tags
      if (selectedTags.length > 0) {
        tagMatch = selectedTags.some((tag: DropdownItem) => {
          return record.SearchString?.includes(tag.label.toLowerCase());
        });
      } else {
        tagMatch = true;
      }

      // check if any of the search terms match with record search string
      if (searchTerms.current.length > 0) {
        searchMatch = searchTerms.current.every((term) =>
          record.SearchString?.includes(term.toLowerCase())
        );
      } else {
        searchMatch = true;
      }

      return tagMatch && searchMatch;
    });

    updateRecords(newFilteredRecords);
  }, [records, selectedTags, updateRecords]);

  const searchHandler = useCallback(
    (value: string) => {
      searchTerms.current = value.split(" ");
      filterHandler();
    },
    [filterHandler]
  );

  const viewChangedHandler = useCallback(
    (item: DropdownItem) => {
      setSelectedTags([]);
      fetchRecords(item);
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
        return <Spinner />;
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
            <Dropdown
              label="Views"
              placeholder="Views"
              itemGotSelected={viewChangedHandler}
              fetchUrl={VIEWS_FETCH_URL}
              labelAndValue={labelAndValues}
            />
            <DropdownMultiSelect
              label="Tags"
              placeholder="Tags"
              doneCallBack={tagsHandler}
              fetchUrl={TAGS_FETCH_URL}
              labelAndValue={labelAndValues}
              selectedItems={selectedTags}
              setSelectedItems={setSelectedTags}
            />
          </div>
          <MyList
            asideRef={asideRef}
            records={listRecords}
            isLoadingRecords={isLoadingRecords}
            onRecordSelect={onRecordSelected}
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
