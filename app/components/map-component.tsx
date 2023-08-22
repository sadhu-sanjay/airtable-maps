"use client";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useState } from "react";
import { Spinner } from "~/app/components/spinner";
import { Record } from "~/app/components/types";
import { MAPS_API_KEY, RECORDS_FETCH_URL } from "~/app/config";
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
        console.log("Here comes the result", data[0]);
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

  return (
    <div className="w-full h-full flex-1 bg-pink-300">
      <aside className="bg-blue-200/1 sm:w-[30%] w-full h-[100dvh] p-4 ">
        <div className="bg-blue-300 rounded-lg flex w-full h-full flex-col gap-3 items justify-between p-4">
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
          <TableFilter />
          <TagsFilter />
          <StateFilter />
        </div>
      </>
    );
  }

  function TableFilter() {
    return (
      <>
        <select className="w-full p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Categories</option>
          <option value="Hiking">Hiking</option>
          <option value="Airport">Airport</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Lake">Lake</option>
          <option value="Pub">Pub</option>
        </select>
      </>
    );
  }

  function TagsFilter() {
    return (
      <>
        <select className="w-full p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Categories</option>
          <option value="Hiking">Hiking</option>
          <option value="Airport">Airport</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Lake">Lake</option>
          <option value="Pub">Pub</option>
        </select>
      </>
    );
  }

  function StateFilter() {
    return (
      <>
        <select className="w-full p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">All Categories</option>
          <option value="Hiking">Hiking</option>
          <option value="Airport">Airport</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Lake">Lake</option>
          <option value="Pub">Pub</option>
        </select>
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
          Showing {currentPage } of {totalPages} pages
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
