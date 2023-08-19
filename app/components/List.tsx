import { Record } from "~/app/components/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Spinner2 } from "~/app/components/spinner";

export function MyList({
    isLoading,
    records,
    filteredRecords,
    setSelectedRecord,
  }: {
    isLoading: boolean;
    records: Record[];
    filteredRecords: Record[];
    setSelectedRecord: Dispatch<SetStateAction<Record | null>>;
  }) {
    return (
      <div className="relative sm:w-[35%] w-full  ">
        {isLoading ? (
          <Spinner2 />
        ) : records?.length > 0 ? (
          <ul className="overflow-y-scroll h-[85dvh] p-4">
            {filteredRecords.map((record, index) => (
              <li
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="p-4 hover:scale-105 transition-all ease-in-out 1s cursor-pointer
              shadow-sm hover:shadow-md font-mono text-md bg-gray-100 rounded-md m-2 
              dark:bg-gray-700"
              >
                <strong>
                  {index + 1}
                  {". "}{" "}
                </strong>
                {record.fields.Title}
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