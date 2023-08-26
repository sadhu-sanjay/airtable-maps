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
import { MyList } from "./List";
import { MyMap } from "./my-map";
import Dropdown from "./dropdown";
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
        setIsLoading(false);
      });
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

    setTimeout(() => {
      let newFilteredRecords = records;

      // Filter records based on selected REgions
      if (selectedRegions.length > 0) {
        newFilteredRecords = newFilteredRecords.filter((record) => {
          return selectedRegions.some((region) =>
            record.Region.includes(region)
          );
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
    }, 1000);

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

  /**
   * Pagination Functionality Start
   * */
  const recordsPageSize = 10; // Number of records per page
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRecord = currentPage * recordsPageSize;
  const indexOfFirstRecord = indexOfLastRecord - recordsPageSize;
  const recordsToShow = searchedRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(searchedRecords.length / recordsPageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  function Paginator() {
    // Generate an array of page numbers
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Calculate the range of records currently viewed
    const firstViewedRecord = indexOfFirstRecord + 1;
    const lastViewedRecord = Math.min(
      indexOfLastRecord,
      searchedRecords.length
    );

    return (
      <>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {firstViewedRecord}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {lastViewedRecord}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {searchedRecords.length}
            </span>{" "}
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="w-3.5 h-3.5 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <nav aria-label="Page navigation xample">
              <ul className="flex items-center -space-x-px h-8 text-sm">
                {pageNumbers.map((number) => (
                  <li key={number} onClick={() => handlePageChange(number)}>
                    <a
                      className={`
                    flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white 
                    ${ currentPage === number ? "font-semibold text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white" : "" }
                    `}
                    >
                      {number}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
    /**
     * Pagination Functionality End
     */

    // return (
    //   <div className="self-center flex gap-1 flex-col justify-center ">
    //     <div className="flex justify-between bg-blue-100 items-center gap-2">
    //       <button
    //         onClick={() => handlePageChange(currentPage - 1)}
    //         disabled={currentPage === 1}
    //         className="px-2 py-1 rounded-md bg-gray-200 disabled:bg-gray-300"
    //       >
    //         Previous
    //       </button>

    //       {/* Render a button for each page number */}
    //       {pageNumbers.map((number) => (
    //         <button
    //           key={number}
    //           onClick={() => handlePageChange(number)}
    //           className={`px-2 py-1 rounded-md ${
    //             currentPage === number ? "bg-blue-200" : "bg-gray-200"
    //           }`}
    //         >
    //           {number}
    //         </button>
    //       ))}

    //       <button
    //         onClick={() => handlePageChange(currentPage + 1)}
    //         disabled={currentPage === totalPages}
    //         className="px-2 py-1 rounded-md bg-gray-200 disabled:bg-gray-300"
    //       >
    //         Next
    //       </button>
    //     </div>
    //     <div className="text-center">
    //       <p>
    //         Page {currentPage} of {totalPages}
    //       </p>
    //       <p>
    //         Viewing records {firstViewedRecord} to {lastViewedRecord} out of{" "}
    //         {filteredRecords.length} total
    //       </p>
    //     </div>
    //   </div>
    // );
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
    <div className="w-full h-full flex-1 bg-pink-300">
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
