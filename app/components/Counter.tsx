"use client";

import { use, useState } from "react";

import { myDebounce } from "./utility/utilityFunctions";
import { Spinner3, Spinner4 } from "./spinner";
import { useRecords } from "./useRecords";

export default function Counter() {
  const [done, setDone] = useState("");
  // const records = useRecords();

  return (
    <>
      <div className="flex gap2 items-center">
        {/* <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => getCounter()}
        >
          Increment
        </button> */}
        <ul className="overflow-scroll h-screen">
          {records.length > 0 &&
            records.map((record, index) => {
              return (
                <li className="text-sm " key={index}>
                  <strong>{index + 1}.</strong> {record.Title}
                </li>
              );
            })}
        </ul>

        <div className="record-count">
          {/* <strong>chunkCount Count:</strong> {chunkCount} */}
          <br />
          <strong>Record Count:</strong> {records.length}
          <strong> STATUS: </strong> {done}
          <Spinner4 />
        </div>
      </div>
    </>
  );
}
