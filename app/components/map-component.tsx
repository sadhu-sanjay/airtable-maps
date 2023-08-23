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

export function MapComponent() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  // Pagination
  const recordsPageSize = 100; // Number of records per page
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRecord = currentPage * recordsPageSize;
  const indexOfFirstRecord = indexOfLastRecord - recordsPageSize;
  const recordsToShow = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPageSize);

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
    // fetchRecords();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full h-full flex-1 bg-pink-300">
      <Wrapper apiKey={MAPS_API_KEY} render={render} />
      <aside className="absolute bg-blue-200/1 sm:w-[30%] w-full h-[100dvh] p-4 ">
        <div className="bg-blue-100 rounded-lg flex w-full h-full flex-col gap-3 items justify-between p-4">
          <SearchBar />
          <Filters />
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
      // fetchTags();
    }, []);

    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    function fetchTags() {
      setIsLoading(true);
      fetch(TAGS_FETCH_URL)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetch Tags", data[0]);
          setTags(data);
          setIsLoading(false);
        });
    }

    return (
      <>
        <select className="w-full p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Categories</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </>
    );
  }

  function RegionFilter() {
    const [regions, setRegions] = useState<string[]>([]);
    const [isLoadingRegion, setIsLoadingRegion] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

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

    useEffect(() => {
      fetchRegions();
    }, []);

    const filteredRegion = regions.filter((region) => {
      if (!region) return;
      return region.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <>
        <div className="relative inline-block text-left">
          <button
            disabled={isLoadingRegion}
            onClick={toggleDropdown}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Region
            {isLoadingRegion ? (
              <svg
                aria-hidden="true"
                className="inline w-2.5 h-2.5 ml-2.5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              <svg
                className="w-2.5 h-2.5 ml-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            )}
          </button>

          {isOpen && (
            <div
              className="absolute z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700"
              id="dropdownSearch"
            >
              <div className="p-3">
                <label htmlFor="input-group-search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="input-group-search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search user"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <ul
                className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownSearchButton"
              >
                {filteredRegion.map((region) => (
                  <li key={region}>
                    <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="checkbox-item-17"
                        type="checkbox"
                        value=""
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        htmlFor="checkbox-item-17"
                        className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                      >
                        {region}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>
    );
  }

  function Paginator() {
    return (
      <div className="flex gap-1 flex-col justify-center ">
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
          Showing {currentPage} of {totalPages} pages
        </div>
      </div>
    );
  }
}

// function Header({
//   fetchRecords,
//   handleSearchChange,
//   handleCategoryChange,
// }: {
//   fetchRecords: () => void;
//   handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   handleCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
// }) {
//   return (
//     <div className="rounded-sm z-20 p-4 gap-2 shadow-sm bg-slate-50 dark:bg-gray-800 flex items-stretch justify-between">
//       <h1 className="self-center text-xl font-bold dark:text-slate-200">
//         Airtable Records
//       </h1>
//       <div className=" w-20 h-8 top-0 right-0 p-2">
//         <button
//           className="bg-blue-500 hover:bg-blue-700 text-white p-2 font-bold rounded"
//           onClick={() => fetchRecords()}
//         >
//           ⟳
//         </button>
//       </div>
//       <div className="flex ">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-[100%] p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           onChange={handleSearchChange}
//         />
//       </div>
//       <select
//         value={category}
//         onChange={handleCategoryChange}
//         id="countries"
//         className=" bg-gray-50 w-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//       >
//         <option value="">All Categories</option>
//         <option value="Hiking">Hiking</option>
//         <option value="Airport">Airport</option>
//         <option value="Restaurant">Restaurant</option>
//         <option value="Lake">Lake</option>
//         <option value="Pub">Pub</option>
//       </select>
//     </div>
//   );
// }

const mapOptions = {
  center: { lat: 41.29684086561144, lng: 24.47824249120258 },
  zoom: 6,
};

// const filteredRecords = records
//     ? records.filter((record) => {
//         if (!record) return;
//         return record.searchStr
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase());
//       })
//     : [];

// const [searchTerm, setSearchTerm] = useState("");
// const [category, setCategory] = useState("");
// const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   setSearchTerm(event.target.value);
// };
// const handleCategoryChange = (
//   event: React.ChangeEvent<HTMLSelectElement>
// ) => {
//   setCategory(event.target.value);
// };

function SearchBar() {
  return (
    <form>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search Mockups, Logos..."
          required
        />

        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>
    </form>
  );
}
