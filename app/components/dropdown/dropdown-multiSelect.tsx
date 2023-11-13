import React, { use, useEffect, useRef, useState } from "react";

function DropdownMultiSelect({
  label,
  placeholder,
  doneCallBack,
  fetchUrl,
  labelAndValue,
}: {
  label: string;
  placeholder: string;
  doneCallBack: (selectedItems: string[]) => void;
  fetchUrl: string;
  labelAndValue: { label: string; value: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Array<any>>([]);
  const clearAllSelected = () => setSelectedItems([]);
  const filteredItems =
    items.length > 0
      ? items.filter((item) => {
          if (!item) return;
          return item.label?.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : [];

  useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(fetchUrl, { signal })
      .then((res) => res.json())
      .then((data) => {
        const mappedData = data.map((item: any) => {
          return {
            label: item[labelAndValue.label],
            value: item[labelAndValue.value],
          };
        });
        setItems(mappedData);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.name === "AbortError") {
          return console.log("Fetch Items Aborted");
        }
        console.log("Error Fetching Regions==>", e);
      });

    return () => {
      abortController.abort();
    };
  }, [fetchUrl, label]);

  const handleSelected = (item: any) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  function doneButtonClicked() {
    doneCallBack(selectedItems);
    setIsOpen(!isOpen);
  }

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          disabled={isLoading}
          onClick={toggleDropdown}
          type="button"
          className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-4pixel border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
        >
          {selectedItems.length > 0 && (
            <span className="mr-2 inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
              {selectedItems.length}
            </span>
          )}
          {isLoading ? `Loading...` : label}
          <svg
            className={`${isLoading ? "hidden" : "inline"} w-2.5 h-2.5 ml-2.5`}
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
          <svg
            aria-hidden="true"
            role="status"
            className={`${
              isLoading ? "inline" : "hidden"
            }  w-4 h-4 ml-2.5 text-gray-200 animate-spin dark:text-gray-600`}
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
              fill="#1C64F2"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute z-10 bg-white rounded-4pixel shadow w-60 dark:bg-gray-700"
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
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ul
              className="h-[30rem] px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownSearchButton"
            >
              {filteredItems.map((item) => (
                <li key={item.value}>
                  <div className="flex items-center pl-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id={`checkbox-item-${item.value}`}
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleSelected(item)}
                      className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 dark:focus:ring-gray-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor={`checkbox-item-${item.value}`}
                      className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      {item.label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <div className="flex items-center justify-between">
                <p className="flex items-center p-3 text-sm font-medium text-slate-600  dark:text-slate-200 ">
                  {/* show how many selected */}
                  {selectedItems.length === 0
                    ? `Total: ${items.length}`
                    : `${selectedItems.length} of ${items.length}`}
                </p>
                <p
                  onClick={clearAllSelected}
                  className="flex items-center text-sm font-medium text-red-600 border-trounded-b-lg cursor-pointer dark:text-red-500 hover:underline"
                >
                  clear all
                </p>
                <button
                  onClick={() => doneButtonClicked()}
                  className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2 m-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default React.memo(DropdownMultiSelect);
