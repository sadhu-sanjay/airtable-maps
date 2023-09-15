/**
   * Pagination Functionality Start
   * */
// const recordsPageSize = 5000; // Number of records per page
// const [currentPage, setCurrentPage] = useState(1);
// const indexOfLastRecord = currentPage * recordsPageSize;
// const indexOfFirstRecord = indexOfLastRecord - recordsPageSize;
// const recordsToShow =
//   searchedRecords.length > 0
//     ? searchedRecords?.slice(indexOfFirstRecord, indexOfLastRecord)
//     : [];
// const totalPages = Math.ceil(searchedRecords.length / recordsPageSize);

// const handlePageChange = (newPage: number) => {
//   if (newPage >= 1 && newPage <= totalPages) {
//     setCurrentPage(newPage);
//   }
// };

// function Paginator() {
//   // Generate an array of page numbers
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   // Calculate the range of records currently viewed
//   const firstViewedRecord = indexOfFirstRecord + 1;
//   const lastViewedRecord = Math.min(
//     indexOfLastRecord,
//     searchedRecords.length
//   );

//   return (
//     <>
//       <div
//         className=" flex flex-col items-center absolute bottom-0 py-4 left-0 right-0
//       bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 shadow-xl
//       "
//       >
//         <span className="text-sm text-gray-700 dark:text-gray-400">
//           Showing{" "}
//           <span className="font-semibold text-gray-900 dark:text-white">
//             {firstViewedRecord}
//           </span>{" "}
//           to{" "}
//           <span className="font-semibold text-gray-900 dark:text-white">
//             {lastViewedRecord}
//           </span>{" "}
//           of{" "}
//           <span className="font-semibold text-gray-900 dark:text-white">
//             {searchedRecords.length}
//           </span>{" "}
//           Entries
//         </span>
//         <div className="inline-flex mt-2 xs:mt-0">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//           >
//             <svg
//               className="w-3.5 h-3.5 mr-2"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 14 10"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M13 5H1m0 0 4 4M1 5l4-4"
//               />
//             </svg>
//             Prev
//           </button>
//           <nav aria-label="Page navigation xample">
//             <ul
//               style={{ scrollbarWidth: "none" }}
//               className="flex items-center -space-x-px h-8 text-sm max-w-[140px] overflow-scroll "
//             >
//               {pageNumbers.map((number) => (
//                 <li key={number} onClick={() => handlePageChange(number)}>
//                   <a
//                     className={`
//                   flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white 
//                   ${
//                     currentPage === number
//                       ? "font-semibold text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white"
//                       : ""
//                   }
//                   `}
//                   >
//                     {number}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//           >
//             Next
//             <svg
//               className="w-3.5 h-3.5 ml-2"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 14 10"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M1 5h12m0 0L9 1m4 4L9 9"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }
/**
 * Pagination Functionality End
 */

// export function PageStatus({
//   filtered,
//   total,
// }: {
//   filtered: number;
//   total: number;
// }) {
//   return (
    
//     <div
//       className=" flex flex-col items-center py-4 left-0 right-0
//         bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 
//         "
//     >
//       <span className="text-sm text-gray-700 dark:text-gray-400">
//         Showing{" "}
//         <span className="font-semibold text-gray-900 dark:text-white">
//           {filtered}
//         </span>{" "}
//         of{" "}
//         <span className="font-semibold text-gray-900 dark:text-white">
//           {total}
//         </span>{" "}
//         Entries
//       </span>
//       {/* A seperator line */}
//     </div>
//   );
// }
