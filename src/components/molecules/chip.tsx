import CloseIcon from "../resources/icons/close-icon";

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
        id="badge-dismiss-pink"
        className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-pink-800 bg-pink-100 rounded dark:bg-pink-900 dark:text-pink-300"
      >
        {/* {item.label} */}
        sample
        <button
          type="button"
          className="inline-flex items-center p-1 ms-2 text-sm text-pink-400 bg-transparent rounded-sm hover:bg-pink-200 hover:text-pink-900 dark:hover:bg-pink-800 dark:hover:text-pink-300"
          data-dismiss-target="#badge-dismiss-pink"
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
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Remove badge</span>
        </button>
      </span>
    </>
  );
};

export default Chip;
