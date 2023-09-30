import { CSSProperties } from "react";
import { FixedSizeList as List } from "react-window";
import { Record } from "~/app/components/types";
import EmptyList from "./common/empty-states/empty-list";
import { PageStatus } from "./Paginator";
import { Spinner, Spinner4 } from "./spinner";

export function MyList({
  asideRef,
  isLoadingRecords,
  records,
  onRecordSelect,
}: {
  asideRef: React.MutableRefObject<HTMLDivElement | null>;
  isLoadingRecords: boolean;
  records: Record[];
  onRecordSelect: (record: Record) => void;
}) {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const record = records[index];
    return (
      <li
        key={record.id}
        onClick={() => onRecordSelect(record)}
        style={style}
        className="border-b p-1.5 sm:p-2 hover:scale-95 transition-transform ease-in-out 0.5s cursor-pointer"
      >
        <div className="flex space-x-2">
          <p className="text-xs font-medium text-gray-900 truncate dark:text-white">
            <strong>{index + 1 }</strong>
          </p>
          <div className="flex flex-col items-start space-x-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate dark:text-white">
                <strong>{record.fields.Title}</strong>
              </p>
              <p className="text-xs text-gray-600 truncate dark:text-gray-400">
                {record.fields.Tags ? record.fields.Tags.join(", ") : ""}
              </p>
              <p className=" text-xs text-gray-700 font-medium truncate dark:text-gray-400">
                {record.fields.Region ? record.fields.Region.join(", ") : ""}
              </p>{" "}
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      {isLoadingRecords && records.length < 1 ? (
        <div role="status" className="self-center">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : records.length > 0 ? (
        <>
          <List
            height={screen.height}
            width={asideRef.current?.style.width!}
            itemCount={records.length}
            itemSize={60} // adjust this according to your needs
            style={{ scrollbarWidth: "none" }}
            className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto overflow-x-hidden"
          >
            {Row}
          </List>
          <PageStatus
            isLoading={isLoadingRecords}
            filtered={records.length}
            total={records.length}
          />
        </>
      ) : (
        <EmptyList
          title="No Recods found"
          subtitle="Please change up the search term or try some other filter."
        />
      )}
    </>
  );
}
