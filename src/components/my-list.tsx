import { CSSProperties, memo } from "react";
import { FixedSizeList as List } from "react-window";
import { Record } from "~/components/types";
import EmptyList from "./common/empty-states/empty-list";
import { PageStatus } from "./Paginator";
import { ShareIcon } from "./resources/icons/share";
import RefreshCircle from "./resources/icons/refresh-spinner";
import { Spinner } from "./spinner";
import { noRecordsTryAgain } from "../config";

function MyList({
  isStreamingRecords,
  asideRef,
  isLoadingRecords,
  records,
  onRecordSelect,
  status,
}: {
  isStreamingRecords: boolean;
  asideRef: React.MutableRefObject<HTMLDivElement | null>;
  isLoadingRecords: boolean;
  records: Record[];
  onRecordSelect: (recordId: string) => void;
  status: string;
}) {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const record = records[index];
    return (
      <li
        key={record.RecordKey}
        onClick={() => onRecordSelect(record.RecordKey)}
        style={style}
        className=" border-b p-1.5 sm:p-1  hover:scale-95 transition-transform ease-in-out 0.5s cursor-pointer"
      >
        <div className=" flex space-x-2">
          <div className=" flex flex-col items-start space-x-4">
            <div className=" w-64 overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0">
              <p className="text-sm font-semibold leading-6 text-gray-900 dark:text-white truncate">
                <strong>{record.Title}</strong>
              </p>
              <p className=" truncate text-xs leading-5 text-gray-500 dark:text-gray-300">
                {record.Tags}
              </p>
              <p className=" truncate text-xs leading-5 font-medium text-gray-500 dark:text-gray-300">
                {record.Region}
              </p>{" "}
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      {isLoadingRecords && <Spinner message={status} />}
      {records.length < 1 && !isLoadingRecords && (
        <EmptyList title="No Recods found" subtitle={status} />
      )}
      {records && records.length > 0 && (
        <>
          <List
            height={screen.height}
            width={asideRef.current?.style.width ?? 80 * 4}
            itemCount={records.length}
            itemSize={75} // adjust this according to your needs
            style={{ overflowX: "hidden" }}
            className=" list-none divide-y divide-gray-200 dark:divide-gray-700 "
          >
            {Row}
          </List>
          <PageStatus
            isLoading={isStreamingRecords}
            filtered={records.length}
            total={records.length}
          />
        </>
      )}
    </>
  );
}

export default memo(MyList);
