"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { useCallback, useRef, useEffect, useMemo, useState } from "react";
import { Spinner } from "~/app/components/spinner";
import { Record } from "~/app/components/types";

import {
  MAPS_API_KEY,
  RECORDS_FETCH_URL,
  REGIONS_FETCH_URL,
  TAGS_FETCH_URL,
} from "~/app/config";
import { MyList } from "./List";
import MyMap from "./map";
import Dropdown from "./dropdown";
import { SearchBar } from "./search-bar";
import { myDebounce } from "./utility/utilityFunctions";
import EmptyList from "./common/empty-states/empty-list";
import useRecords from "./useRecords";
import PlaceDetail from "./my-pages/place-detail";
import PlaceDetailModal from "./my-pages/place-detail";

export default function Home() {
  const asideRef = useRef<HTMLDivElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<Record>();
  const [listRecords, setListRecords] = useState<Record[]>([]);
  const [mapRecords, setMapRecods] = useState<Record[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { recordsError, isLoadingRecords, records } = useRecords();
  const searchTerms = useRef<string[]>([]);
  const selectedRegions = useRef<string[]>([]);
  const selectedTags = useRef<string[]>([]);

  console.log("HOME RENDER");

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
      let regionMatch = false;
      let tagMatch = false;
      let searchMatch = false;

      // check if any of the selected regions match with record region
      if (selectedRegions.current.length > 0) {
        regionMatch = selectedRegions.current.some((region) =>
          record.fields.Region?.includes(region)
        );
      } else {
        regionMatch = true;
      }

      // check if any of the selected tags match with record tags
      if (selectedTags.current.length > 0) {
        tagMatch = selectedTags.current.some((tag) =>
          record.fields.Tags?.includes(tag)
        );
      } else {
        tagMatch = true;
      }

      // check if any of the search terms match with record search string
      if (searchTerms.current.length > 0) {
        searchMatch = searchTerms.current.every((term) =>
          record.fields.searchStr?.includes(term.toLowerCase())
        );
      } else {
        searchMatch = true;
      }

      return regionMatch && tagMatch && searchMatch;
    });

    updateRecords(newFilteredRecords);
  }, [records, updateRecords]);

  const searchHandler = useCallback(
    (searchEvent: React.ChangeEvent<HTMLInputElement>) => {
      const value = searchEvent.target.value;
      searchTerms.current = value.split(" ");

      filterHandler();
    },
    [filterHandler]
  );
  const regionHandler = useCallback(
    (newRegionHandler: string[]) => {
      selectedRegions.current = newRegionHandler;
      filterHandler();
    },
    [filterHandler]
  );
  const tagsHandler = useCallback(
    (newTagsHandler: string[]) => {
      selectedTags.current = newTagsHandler;
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

  const onRecordSelected = useCallback((record: Record) => {
    console.log("Record Selected", record.id);
    setSelectedRecord(record);
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
        return <MyMap handleZoom={handleZoom} records={mapRecords} onMarkerClick={onRecordSelected} />;
    }
  };

  const closeDetail = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col-reverse sm:flex-row ">
      <aside
        ref={asideRef}
        className="h-1/2 sm:h-full w-full md:w-1/3 lg:w-[29%] sm:min-w-[320px]"
      >
        <div className="relative shadow-lg bg-gray-100 dark:bg-gray-800 flex w-full h-full flex-col gap-3 justify-start p-4 ">
          <SearchBar handleSearchChange={myDebounce(searchHandler, 500)} />
          <div className="flex justify-between align-middle">
            <Dropdown
              label="Region"
              placeholder="Region"
              doneCallBack={regionHandler}
              fetchUrl={REGIONS_FETCH_URL}
            />
            <Dropdown
              label="Tags"
              placeholder="Tags"
              doneCallBack={tagsHandler}
              fetchUrl={TAGS_FETCH_URL}
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
      <main className="bg-red-500 h-1/2 sm:h-full w-full sm:w-[71%]">
        <Wrapper libraries={["marker"]} apiKey={MAPS_API_KEY} render={render} />
      </main>
      <aside>
        <PlaceDetailModal
          recordId={selectedRecord?.id ?? ""}
          onClose={closeDetail}
          isOpen={isModalOpen}
        />
      </aside>
    </div>
  );
}
