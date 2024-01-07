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
        id="badge-dismiss-slate"
        className={`inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-slate-800 bg-slate-200 rounded dark:bg-slate-900 dark:text-slate-300`}
      >
        {item.label}
        <button
          type="button"
          className="inline-flex items-center p-1 ms-2 text-sm text-slate-400 bg-transparent rounded-sm hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          data-dismiss-target="#badge-dismiss-slate"
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
        </button>
      </span>
    </>
  );
};

export default Chip;
