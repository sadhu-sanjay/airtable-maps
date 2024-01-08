import React, { useCallback, useEffect, useRef, useState } from "react";
import { DropdownItem } from "../../models/types";
import { useSearchParams } from "next/navigation";

function DropdownCopy({
  label,
  isLoading,
  placeholder,
  itemGotSelected,
  data,
  error,
  setIsEditing,
  className,
}: {
  label: string;
  placeholder: string;
  isLoading: boolean;
  itemGotSelected: (item: DropdownItem) => void;
  data: DropdownItem[];
  error?: any;
  setIsEditing?: (isEditing: boolean) => void;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(
    undefined
  );
  const filteredItems =
    data && data.length > 0
      ? data.filter((item) => {
          if (!item) return;
          return item.label?.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : [];

  const doneButtonClicked = useCallback(
    (item: DropdownItem) => {
      setSelectedItem(item);
      itemGotSelected(item);
      setIsOpen(false);
    },
    [itemGotSelected]
  ); // add other dependencies if they exist

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`relative inline-block text-left ${className}`}
        ref={dropdownRef}
      >
        <div
          className=" z-10 bg-white rounded shadow w-40 dark:bg-gray-700"
          id="dropdownSearch"
        >
          <div className="p-1.5">
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
                className="block w-full p-1 pl-10 text-sm text-gray-900 border border-gray-300 
                rounded-full bg-gray-50 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                placeholder={placeholder}
                value={searchTerm}
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isOpen && (
            <ul
              className="h-auto w-auto max-h-32 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownSearchButton"
            >
              {filteredItems.map((item: DropdownItem) => (
                <li key={item.value}>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <label
                      onClick={() => {
                        doneButtonClicked(item);
                      }}
                      className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      {item.label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(DropdownCopy);
