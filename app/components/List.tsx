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
    <>
      {isLoading ? (
        <Spinner2 />
      ) : records.length > 0 ? (
        <ul className="overflow-scroll ">
          {records.map((record) => (
            <li
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="p-1 hover:scale-95 transition-transform ease-in-out 0.5s cursor-pointer
              hover:shadow-sm border font-mono text-md bg-gray-100 rounded-md 
              dark:bg-gray-700"
            >
              {record.sNo}{". "}
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
    </>
  );
}
