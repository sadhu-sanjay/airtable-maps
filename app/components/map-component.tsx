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
import { myDebounce } from "./utility/utilityFunctions";
import useRecords from "./useRecords";

// export function MapComponent() {
//   const [records, setRecords] = useState<Record[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
//   const [filteredRecords, setFilteredRecords] = useState(records);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);



//   /**
//    * Filter Functionality Start
//    * */
//   const applyFilters = useCallback(() => {
//     console.log("Apply filter called");

//     let newFilteredRecords = records;

//     // Filter records based on selected REgions
//     if (selectedRegions.length > 0) {
//       newFilteredRecords = newFilteredRecords.filter((record) => {
//         return selectedRegions.some((region) =>
//           record.Region?.includes(region)
//         );
//       });
//     }

//     // Filter records based on selected Tags
//     if (selectedTags.length > 0) {
//       console.log("selectedTags", selectedTags);
//       newFilteredRecords = newFilteredRecords.filter((record) => {
//         return selectedTags.some((tag) => record.Tags?.includes(tag));
//       });
//     }

//     // update Global Filtered Records
//     setFilteredRecords(newFilteredRecords);

//     // update current page to 1
//     setCurrentPage(1);

//     console.log("Apply filter Ended");
//   }, [records, selectedRegions, selectedTags]);

//   function tags_done_clicked(callBackResult: string[]) {
//     setSelectedTags(callBackResult);
//     console.log("selectedTags", selectedTags);
//   }

//   function region_done_clicked(callBackResult: string[]) {
//     setSelectedRegions(callBackResult);
//     console.log("selectedRegions", selectedRegions);
//   }

//   useEffect(() => {
//     console.log("USE EFFECT CALLED Apply Filter");
//     applyFilters();
//     console.log("USE EFFECT Ended APPLY Filter");
//   }, [applyFilters]);
//   /**
//    * Filter Functionality End
//    * */

//   /**
//    * Search Functionality Start
//    * */
//   const searchedRecords = useMemo(() => {
//     if (searchQuery === "") {
//       return filteredRecords;
//     }

//     console.log("SEARCHED RECORDS CALLED");
//     // get current time
//     const start = performance.now();

//     const formattedSearchTerm = searchQuery.replace(/\s/g, "").toLowerCase();
//     const searchRecords = filteredRecords.filter((record) =>
//       record.searchStr
//         .replace(/\s/g, "")
//         .toLowerCase()
//         .includes(formattedSearchTerm)
//     );

//     // get current time
//     const end = performance.now();
//     console.log("SEARCHED RECORDS Ended", end - start);

//     return searchRecords;
//   }, [searchQuery, filteredRecords]);

//   const onSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;

//     debouncedSearch(value);
//   };

//   const debouncedSearch = myDebounce((value: string) => {
//     setSearchQuery(value);
//     setCurrentPage(1);
//   }, 300);

//   useEffect(() => {
//     console.log("Map Component mounted.");
//     // You can place cleanup logic here if needed

//     return () => {
//       console.log("Map Component unmo");
//     };
//   });
//   /**
//    * Filter and Search Functionality End
//    */

//   const render = (status: Status) => {
//     switch (status) {
//       case Status.LOADING:
//         return <Spinner />;
//       case Status.FAILURE:
//         return <div className="w-full sm:w-3/4">Error Loading Map</div>;
//       case Status.SUCCESS:
//         return (
//           <MyMap
//             center={{ lat: 41.29684086561144, lng: 24.47824249120258 }}
//             zoom={6}
//             filteredRecords={recordsToShow}
//             selectedRecord={selectedRecord}
//           />
//         );
//     }
//   };

//   return (
//     <div className="h-screen flex flex-row-reverse">
//       {/* <div className="w-1/4 bg-pink-800 overflow-clip">Sanjay </div> */}
//       {/* <div className="w-3/4 bg-red-900  overflow-clip">Sanjay </div> */}
//       <Wrapper apiKey={MAPS_API_KEY} render={render} />
//       <aside className="w-1/4 ">
//         <div
//           className="relative bg-gray-100 dark:bg-gray-800 flex w-full h-full flex-col gap-3
//         justify-start p-4 "
//         >
//           <SearchBar
//             // searchTerm={searchTerm}
//             handleSearchChange={onSearchTermChange}
//           />
//           <div className="flex justify-between">
//             <Dropdown
//               label="Region"
//               placeholder="Region"
//               doneCallBack={region_done_clicked}
//               fetchUrl={REGIONS_FETCH_URL}
//             />
//             <Dropdown
//               label="Tags"
//               placeholder="Tags"
//               doneCallBack={tags_done_clicked}
//               fetchUrl={TAGS_FETCH_URL}
//             />
//           </div>
//           <MyList
//             isLoading={isLoading}
//             records={recordsToShow}
//             setSelectedRecord={setSelectedRecord}
//           />
//         </div>
//       </aside>
//     </div>
//   );
// }

export default function Home() {
  const { recordsError, isLoadingRecords, records } = useRecords();
  const [selectedRecord, setSelectedRecord] = useState<Record>();

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner />;
      case Status.FAILURE:
        return <div className="w-full sm:w-3/4">Error Loading Map</div>;
      case Status.SUCCESS:
        return (
          <MyMap
            records={records}
            selectedRecord={selectedRecord}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col-reverse sm:flex-row ">
      <aside className="h-1/2 sm:h-full w-full md:w-1/3 lg:w-1/4 sm:min-w-[320px]">
        <div className="relative shadow-lg bg-gray-100 dark:bg-gray-800 flex w-full h-full flex-col gap-3 justify-start p-4 ">
          {/* <SearchBar
            // searchTerm={searchTerm}
            handleSearchChange={onSearchTermChange}
          /> */}
          <div className="flex justify-between">
            {/* <Dropdown
              label="Region"
              placeholder="Region"
              doneCallBack={region_done_clicked}
              fetchUrl={REGIONS_FETCH_URL}
            /> */}
            {/* <Dropdown
              label="Tags"
              placeholder="Tags"
              doneCallBack={tags_done_clicked}
              fetchUrl={TAGS_FETCH_URL}
            /> */}
          </div>
          <MyList
            isLoading={isLoadingRecords}
            records={records}
            setSelectedRecord={setSelectedRecord}
          />
        </div>
      </aside>
      <main className="bg-red-500 h-1/2 sm:h-full w-full">
        <Wrapper apiKey={MAPS_API_KEY} render={render} />
      </main>
    </div>
  );
}
