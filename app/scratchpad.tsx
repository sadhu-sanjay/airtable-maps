"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "~/app/components/spinner";
import { Record } from "~/app/components/types";
import {
  MAPS_API_KEY,
  RECORDS_FETCH_URL,
  REGIONS_FETCH_URL,
  TAGS_FETCH_URL,
} from "~/app/config";
import { MyMap } from "./my-map";
import { SearchBar } from "./search-bar";

export function MapComponent() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  /**
   * Core Fetches and Loading Start
   * */
  function fetchRecords() {
    setIsLoading(true);
    fetch(RECORDS_FETCH_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Records ==>", data[0]);
        const randomRecords = data.sort(() => 0.5 - Math.random()).slice(0, 30);
        setRecords(randomRecords);
      }).catch((err) => {
        console.log("Error fetching records", err);
        alert("Error fetching records Please try again. or Reload the page");
      }).finally(() => {
        setIsLoading(false);
      })
  }

  useEffect(() => {
    fetchRecords();
  }, []);
  /**
   * Core Fetches and Loading End
   */

  /**
   * Filter and Search Functionality Start
   * */
  const applyFilters = useCallback(() => {

    console.log("Apply filter called");

    setIsLoading(true);

    let newFilteredRecords = records;

    // Filter records based on selected REgions
    if (selectedRegions.length > 0) {
      newFilteredRecords = newFilteredRecords.filter((record) => {
        return selectedRegions.some((region) => record.Region.includes(region));
      });
    }

    // Filter records based on selected Tags
    if (selectedTags.length > 0) {
      console.log("selectedTags", selectedTags);
      newFilteredRecords = newFilteredRecords.filter((record) => {
        console.log("record.Tags", record.Tags);
        return selectedTags.some((tag) => record.Tags?.includes(tag));
      });
    }

    // update Global Filtered Records
    setFilteredRecords(newFilteredRecords);

    setIsLoading(false);

    console.log("Apply filter Ended");
  }, [records, selectedRegions, selectedTags]);

  useEffect(() => {
    console.log("USE EFFECT CALLED");
    applyFilters();
    console.log("USE EFFECT Ended");
  }, [applyFilters]);

  const searchedRecords = useMemo(() => {
    console.log("SEARCHED RECORDS CALLED");
    if (searchTerm === "") {
      return filteredRecords;
    }

    setIsLoading(true);
    console.log("Loading done");
    const formattedSearchTerm = searchTerm.replace(/\s/g, "").toLowerCase();
    const searchRecords = filteredRecords.filter((record) =>
      record.searchStr
        .replace(/\s/g, "")
        .toLowerCase()
        .includes(formattedSearchTerm)
    );

    setIsLoading(false);

    return searchRecords;

    console.log("SEARCHED RECORDS Ended");
  }, [searchTerm, filteredRecords]);

  function tags_done_clicked(callBackResult: string[]) {
    setSelectedTags(callBackResult);
    console.log("selectedTags", selectedTags);
  }

  function region_done_clicked(callBackResult: string[]) {
    setSelectedRegions(callBackResult);
    console.log("selectedRegions", selectedRegions);
  }

  useEffect(() => {
    console.log("Map Component mounted.");
    // You can place cleanup logic here if needed

    return () => {
      console.log("Map Component unmo");
    };
  });
  /**
   * Filter and Search Functionality End
   */
  
    
  }

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner />;
      case Status.FAILURE:
        return <div>Error Loading Map</div>;
      case Status.SUCCESS:
        return (
          <MyMap
            center={{ lat: 41.29684086561144, lng: 24.47824249120258 }}
            zoom={6}
            filteredRecords={recordsToShow}
            selectedRecord={selectedRecord}
          />
        );
    }
  };

  return (
    <div className="w-full h-full flex-1 ">
      <Wrapper apiKey={MAPS_API_KEY} render={render} />
      <aside className="absolute bg-blue-200/1 sm:w-[30%] sm:min-w-[390px] w-full h-[100dvh]  p-4 ">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg flex w-full h-full flex-col gap-3  justify-start p-4">
          <SearchBar
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />
          <div className="flex justify-between">
            <Dropdown
              label="Region"
              placeholder="Region"
              doneCallBack={region_done_clicked}
              fetchUrl={REGIONS_FETCH_URL}
            />
            <Dropdown
              label="Tags"
              placeholder="Tags"
              doneCallBack={tags_done_clicked}
              fetchUrl={TAGS_FETCH_URL}
            />
          </div>
          <MyList
            isLoading={isLoading}
            records={recordsToShow}
            setSelectedRecord={setSelectedRecord}
          />
          <Paginator />
        </div>
      </aside>
    </div>
    // </div>
  );
}
