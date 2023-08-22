import { Record } from "~/app/components/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Spinner2 } from "~/app/components/spinner";

export function MyList({
  isLoading,
  records,
  setSelectedRecord,
}: {
  isLoading: boolean;
  records: Record[];
  setSelectedRecord: Dispatch<SetStateAction<Record | null>>;
}) {
  return (
    <div className="relative w-full  ">
      {isLoading ? (
        <Spinner2 />
      ) : records.length > 0 ? (
        <ul className="overflow-y-scroll ">
          {records.map((record) => (
            <li
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="p-2 hover:scale-105 transition-all ease-in-out 1s cursor-pointer
              hover:shadow-sm border font-mono text-md bg-gray-100 rounded-md m-2 
              dark:bg-gray-700"
            >
              {record.Title}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center p-5 top-1/4 ">
          <p style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            No records found ~!
          </p>
          <p style={{ fontSize: "1rem", color: "gray" }}>
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
