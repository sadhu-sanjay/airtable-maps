import { memo, useEffect, useMemo, useState } from "react";
import { myDebounce } from "./lib/utils";

const SearchBar = ({
  onValueChange,
  searchTerm,
  setSearchTerm,
  className,
}: {
  onValueChange: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  className?: string;
}) => {
  // useEffect(() => {
  //   debounedChange(searchValue);
  // }, [debounedChange, searchValue]);

  const debounedChange = useMemo(
    () => myDebounce(onValueChange, 700),
    [onValueChange]
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onValueChange(searchTerm);
  };

  return (
    <form onSubmit={onSubmit} className={`${className}`}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
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
          value={searchTerm}
          className="block w-full p-3 pl-10 text-base 
          text-gray-900 border border-gray-300 rounded 
          bg-gray-50 focus:ring-blue-500 focus:border-blue-500 
          dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search by cities, tags, regions etc.."
          // required
          onChange={(e) => {
            let value = e.target.value;
            setSearchTerm(value);
            debounedChange(value);
          }}
        />
        {/* <button
          type="submit"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-center
          text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
          hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
          dark:focus:ring-blue-800 shadow-sm shadow-blue-500/50 dark:shadow-sm 
          dark:shadow-blue-800/80 font-medium text-sm "
        >
          search
        </button> */}
        {/* {searchValue && (
          <button
            type="button"
            className="primary-bg rounded-full absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center "
            onClick={() => setSearchValue("")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-gray-200 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )} */}
      </div>
    </form>
  );
};

export default memo(SearchBar);
