"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import { Spinner } from "~/app/components/spinner";
import { Record } from "~/app/components/types";
import {
  MAPS_API_KEY,
  RECORDS_FETCH_URL,
  REGIONS_FETCH_URL,
  TAGS_FETCH_URL,
} from "~/app/config";
import { MyList } from "./List";
import { MyMap } from "./my-map";
import Dropdown from "./dropdown";
import { SearchBar } from "./search-bar";

export function MapComponent() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  // Pagination

  const [searchTerm, setSearchTerm] = useState("");
  const filteredRecords = records.filter((record) => {
    if (!record) return;
    return record.searchStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const recordsPageSize = 100; // Number of records per page
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRecord = currentPage * recordsPageSize;
  const indexOfFirstRecord = indexOfLastRecord - recordsPageSize;
  const recordsToShow = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPageSize);

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner />;
      case Status.FAILURE:
        return <div>Error Loading Map</div>;
      case Status.SUCCESS:
        return (
          <MyMap
            {...mapOptions}
            filteredRecords={recordsToShow}
            selectedRecord={selectedRecord}
            records={records}
          />
        );
    }
  };

  function fetchRecords() {
    setIsLoading(true);
    fetch(RECORDS_FETCH_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Records ==>", data[0]);
        setRecords(data);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="w-full h-full flex-1 bg-pink-300">
      <Wrapper apiKey={MAPS_API_KEY} render={render} />
      <aside className="absolute bg-blue-200/1 sm:w-[30%] w-full h-[100dvh]  p-4 ">
        <div className="bg-blue-100 rounded-lg flex w-full h-full flex-col gap-3  justify-start p-4">
          <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
          <MyList
            isLoading={isLoading}
            records={filteredRecords}
            setSelectedRecord={setSelectedRecord}
          />
          {/* <Paginator /> */}
        </div>
      </aside>
    </div>
    // </div>
  );

  function Filters() {
    return (
      <>
        <div className="flex gap-2 justify-between items-center">
          {/* <TableFilter /> */}
          <TagsFilter />
          <RegionFilter />
        </div>
      </>
    );
  }

  function TagsFilter() {
    useEffect(() => {
      fetchTags();
    }, []);

    const [tags, setTags] = useState<string[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);

    function fetchTags() {
      setIsLoadingTags(true);
      fetch(TAGS_FETCH_URL)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetch Tags", data[0]);
          setTags(data);
          setIsLoadingTags(false);
        });
    }

    return (
      <Dropdown
        items={tags}
        label="Tags"
        isLoading={isLoadingTags}
        placeholder="Tags"
      />
    );
  }

  function RegionFilter() {
    useEffect(() => {
      fetchRegions();
    }, []);

    const [regions, setRegions] = useState<string[]>([]);
    const [isLoadingRegion, setIsLoadingRegion] = useState(false);

    function fetchRegions() {
      setIsLoadingRegion(true);
      fetch(REGIONS_FETCH_URL)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Regions==>", data);
          setRegions(data);
          setIsLoadingRegion(false);
        });
    }

    return (
      <Dropdown
        items={regions}
        label="Regions"
        isLoading={isLoadingRegion}
        placeholder="Regions"
      />
    );
  }

  function Paginator() {
    return (
      <div className="absolute bottom-0 self-center flex gap-1 flex-col justify-center ">
        <div className="flex justify-between bg-red-800 items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-md bg-gray-200 disabled:bg-gray-300"
          >
            Previous
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded-md bg-gray-200 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
        <div>
      Showing {currentPage} of {totalPages} pages , total {filteredRecords.length}
         
        </div>
      </div>
    );
  }
}

const mapOptions = {
  center: { lat: 41.29684086561144, lng: 24.47824249120258 },
  zoom: 6,
};
