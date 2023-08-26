// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Dropdown from "./dropdown";
// import { Spinner } from "./spinner";

// export function MapComponent() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [filteredRecords, setFilteredRecords] = useState(records);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);

//   function handleSearchTerm(event: any) {
//     setSearchTerm(event.target.value);
//   }

//   const applyFilters = useCallback(() => {
//     console.log("Apply filter called");
//     setIsLoading(true);

//     setTimeout(() => {
//       let newFilteredRecords = records;

//       // Filter records based on selected REgions
//       if (selectedRegions.length > 0) {
//         newFilteredRecords = newFilteredRecords.filter((record) => {
//           return selectedRegions.some((region) =>
//             record.Region.includes(region)
//           );
//         });
//       }

//       // Filter records based on selected Tags
//       if (selectedTags.length > 0) {
//         newFilteredRecords = newFilteredRecords.filter((record) => {
//           return selectedTags.some((tag) => record.Tags.includes(tag));
//         });
//       }

//       // update Global Filtered Records
//       setFilteredRecords(newFilteredRecords);

//       setIsLoading(false);
//     }, 1000);

//     console.log("Apply filter Ended");
//   }, [records, selectedRegions, selectedTags]);

//   useEffect(() => {
//     console.log("USE EFFECT CALLED");
//     applyFilters();
//     console.log("USE EFFECT Ended");
//   }, [applyFilters]);

//   const searchedRecords = useMemo(() => {
//     console.log("SEARCHED RECORDS CALLED");
//     if (searchTerm === "") {
//       return filteredRecords;
//     }

//     setIsLoading(true);
//     console.log("Loading done");
//     const formattedSearchTerm = searchTerm.replace(/\s/g, "").toLowerCase();
//     const searchRecords = filteredRecords.filter((record) =>
//       record.searchString
//         .replace(/\s/g, "")
//         .toLowerCase()
//         .includes(formattedSearchTerm)
//     );

//     setIsLoading(false);

//     return searchRecords;

//     console.log("SEARCHED RECORDS Ended");
//   }, [searchTerm, filteredRecords]);

//   function tags_done_clicked(callBackResult: string[]) {
//     setSelectedTags(callBackResult);
//     console.log("selectedTags", selectedTags);
//   }

//   function region_done_clicked(callBackResult: string[]) {
//     setSelectedRegions(callBackResult);
//     console.log("selectedRegions", selectedRegions);
//   }

//   useEffect(() => {
//     console.log("Map Component mounted.");
//     // You can place cleanup logic here if needed
    

//     return () => {
//       console.log("Map Component unmo");
//     };
//   });

//   return (
//     <>
//       <input
//         type="text"
//         placeholder="Search"
//         value={searchTerm}
//         className="border-2 border-gray-500 rounded-md p-2 dark:bg-slate-700 dark:text-white"
//         onChange={handleSearchTerm}
//       />
//       <Dropdown
//         items={[
//           "Tag 1",
//           "Tag 2",
//           "Tag 3",
//           "Tag 4",
//           "Tag 5",
//           "Tag 6",
//           "Tag 7",
//           "Tag 8",
//           "Tag 9",
//           "Tag 10",
//         ]}
//         label="Tags"
//         isLoading={false}
//         placeholder="Tags"
//         doneCallBack={tags_done_clicked}
//       />
//       <Dropdown
//         items={[
//           "Region 1",
//           "Region 2",
//           "Region 3",
//           "Region 4",
//           "Region 5",
//           "Region 6",
//           "Region 7",
//           "Region 8",
//         ]}
//         label="Region"
//         isLoading={false}
//         placeholder="Region"
//         doneCallBack={region_done_clicked}
//       />

//       {isLoading ? (
//         <Spinner />
//       ) : (
//         <div className="flex flex-col gap-2 dark:bg-slate-700">
//           {searchedRecords &&
//             searchedRecords.map((record) => (
//               <div
//                 key={record.id}
//                 className="bg-slate-100
//             m-2 text-white p-2 
//               flex flex-col gap-2"
//               >
//                 <h1 className="text-slate-800">{record.Title}</h1>
//                 <div className="flex flex-row gap-2">
//                   {record.Tags.map((tag) => (
//                     <h1 key={tag} className="text-slate-800">
//                       {tag}
//                     </h1>
//                   ))}
//                 </div>
//                 <h1 className="text-slate-800">{record.city}</h1>
//                 <div className="flex flex-row gap-2">
//                   {record.Region.map((region) => (
//                     <h1 key={region} className="text-slate-800">
//                       {region}
//                     </h1>
//                   ))}
//                 </div>
//               </div>
//             ))}
//         </div>
//       )}
//     </>
//   );
// }

// const records = [
//   {
//     id: 1,
//     Title: "Record 1",
//     Tags: ["Tag 9", "Tag 5"],
//     city: "City 1",
//     Region: ["Region 1", "Region 2"],
//     searchString: "Record 1 Tag 9 Tag 5 City 1 Region 1 Region 2",
//   },
//   {
//     id: 2,
//     Title: "Record 2",
//     Tags: ["Tag 2", "Tag 3"],
//     city: "City 2",
//     Region: ["Region 2", "Region 3"],
//     searchString: "Record 2 Tag 2 Tag 3 City 2 Region 2 Region 3",
//   },
//   {
//     id: 3,
//     Title: "Record 3",
//     Tags: ["Tag 3", "Tag 4"],
//     city: "City 3",
//     Region: ["Region 3", "Region 4"],
//     searchString: "Record 3 Tag 3 Tag 4 City 3 Region 3 Region 4",
//   },
//   {
//     id: 4,
//     Title: "Record 4",
//     Tags: ["Tag 4", "Tag 5", "Tag 8"],
//     city: "City 4",
//     Region: ["Region 4", "Region 5"],
//     searchString: "Record 4 Tag 4 Tag 5 Tag 8 City 4 Region 4 Region 5",
//   },
//   // Give me 10 more records like this

//   {
//     id: 5,
//     Title: "Record 5",
//     Tags: ["Tag 5", "Tag 6"],
//     city: "City 5",
//     Region: ["Region 5", "Region 6"],
//     searchString: "Record 5 Tag 5 Tag 6 City 5 Region 5 Region 6",
//   },
//   {
//     id: 6,
//     Title: "Record 6",
//     Tags: ["Tag 6", "Tag 7"],
//     city: "City 6",
//     Region: ["Region 6", "Region 7"],
//     searchString: "Record 6 Tag 6 Tag 7 City 6 Region 6 Region 7",
//   },
//   {
//     id: 7,
//     Title: "Record 7",
//     Tags: ["Tag 7", "Tag 8"],
//     city: "City 7",
//     Region: ["Region 7", "Region 8"],
//     searchString: "Record 7 Tag 7 Tag 8 City 7 Region 7 Region 8",
//   },
//   {
//     id: 8,
//     Title: "Record 8",
//     Tags: ["Tag 8", "Tag 9", "Tag 2"],
//     city: "City 8",
//     Region: ["Region 8", "Region 9"],
//     searchString: "Record 8 Tag 8 Tag 9 Tag 2 City 8 Region 8 Region 9",
//   },
//   {
//     id: 9,
//     Title: "Record 9",
//     Tags: ["Tag 9", "Tag 1"],
//     city: "City 9",
//     Region: ["Region 9", "Region 1"],
//     searchString: "Record 9 Tag 9 Tag 1 City 9 Region 9 Region 1",
//   },
//   {
//     id: 10,
//     Title: "Record 10",
//     Tags: ["Tag 1", "Tag 2"],
//     city: "City 10",
//     Region: ["Region 1", "Region 2"],
//     searchString: "Record 10 Tag 1 Tag 2 City 10 Region 1 Region 2",
//   },
// ];
