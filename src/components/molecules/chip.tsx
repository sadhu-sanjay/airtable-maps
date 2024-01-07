import EditButton from "../atoms/edit-button";
import { randomColor } from "../lib/utils";

import { DropdownItem } from "~/components/models/types";

type ChipProps = {
  item: DropdownItem;
  onAdd: (chip: string) => void;
  onDelete: (chip: string) => void;
};

const Chip: React.FC<ChipProps> = ({ item, onAdd, onDelete }) => {
  return (
    <>
      <span
        id="badge-dismiss-gray"
        className={`inline-flex items-center px-2 py-1 mb-1.5 me-2 text-sm font-medium text-gray-800 bg-gray-200 rounded dark:bg-gray-900 dark:text-gray-300`}
      >
        {item.label}
        
        {/* <button
          type="button"
          className="inline-flex items-center p-1 ms-2 text-sm text-gray-400 bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          data-dismiss-target="#badge-dismiss-gray"
          aria-label="Remove"
        >
          <svg
            className="w-2 h-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Remove badge</span>
        </button> */}
      </span>
    </>
  );
};

export default Chip;
