import React, { useCallback, useEffect, useRef, useState } from "react";
import { DropdownItem } from "../../types";
import StatusButton from "../../atoms/status-button";
import { useSearchParams } from "next/navigation";

function Dropdown({
  label,
  placeholder,
  itemGotSelected,
  fetchUrl,
  labelAndValue,
}: {
  label: string;
  placeholder: string;
  itemGotSelected: (item: DropdownItem) => void;
  fetchUrl: string;
  labelAndValue: { label: string; value: string };
}) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(
    undefined
  );
  const filteredItems =
    items.length > 0
      ? items.filter((item) => {
          if (!item) return;
          return item.label?.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : [];
  console.log("RENDER DROPDOWN", items);

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

        // get data for a queryView otherwise just use the first item
        const queryKey = searchParams.get("viewKey");
        doneButtonClicked(
          queryKey
            ? mappedData.find((item: DropdownItem) => item.value === queryKey)
            : mappedData[0]
        );

        setIsLoading(false);
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          console.log("Fetch Items Aborted Dropdown");
        } else {
          console.error(`Error fetchUrl ==> `, e);
        }
        setIsLoading(false);
        setError(e.message);
      });

    return () => {
      abortController.abort();
    };
  }, [fetchUrl, labelAndValue]);

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

  const doneButtonClicked = (item: DropdownItem) => {
    const params = new URLSearchParams(searchParams);
    params.set("viewKey", item.value);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );

    setSelectedItem(item);
    itemGotSelected(item);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <LoadingButton
          isLoading={isLoading}
          label={label}
          selectedItem={selectedItem}
          clickHandler={() => setIsOpen(!isOpen)}
        />
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
                    <label
                      onClick={() => {
                        console.log("Done Button clicked");
                        doneButtonClicked(item);
                      }}
                      className="w-full py-2 ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      {item.label}
                    </label>
                    <StatusButton viewKey={item.value} />
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

export default React.memo(Dropdown);

// a loading button which takes is loading clickhandler and label as props
const LoadingButton: React.FC<{
  isLoading: boolean;
  clickHandler: () => void;
  label: string;
  selectedItem?: DropdownItem;
}> = ({ isLoading, clickHandler, label, selectedItem }) => {
  return (
    <button
      disabled={isLoading}
      type="button"
      onClick={clickHandler}
      className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-4pixel border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
    >
      {isLoading ? "Loading..." : selectedItem?.label || label}
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
  );
};
