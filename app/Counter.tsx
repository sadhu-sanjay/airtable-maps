"use client";

import { useEffect, useState } from "react";
import { Record } from "~/app/components/types";
import { RECORDS_FETCH_URL } from "~/app/config";
//  from "~/app/components/utility/JSONObjectSeparator";
import { JSONObjectSeparator } from "./components/utility/JSONObjectSeparator";


export default function Counter() {
  const [records, setRecords] = useState<Record[]>([]);
  const [chunkCount, setChunkCount] = useState<number>(0);
  const [paragraph, setParagraph] = useState<string>("");

  // setup a websocket connection to the server and listen for changes to the counter value in the database and update the state accordingly
  useEffect(() => {
    const controller = new AbortController();
    readData(controller.signal);

    return () => {
      return controller.abort();
    };
  }, []);

  async function readData(signal: AbortSignal) {
    const response = await fetch(RECORDS_FETCH_URL, { signal });

    if (response.ok) {
      const reader = response.body!.getReader();
      const seperator = new JSONObjectSeparator((jsonObject) => {
        setParagraph((prev) => prev + jsonObject);
      })

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Do something with last chunk of data then exit reader
          console.log("done", paragraph.split("},{").length);
          return;
        }
        try {
          setChunkCount((prev) => prev + 1);

          const jsonString = new TextDecoder("utf-8").decode(value);
          seperator.receive(jsonString);

        } catch (error) {
          console.log("Error", error);
        }
      }
    } else {
      console.log("Response not ok");
    }
  }

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
          <li className="text-sm ">
            {paragraph}
            {/* {records &&
              records.map((record, index) => {
                return (
                  <div key={index}>
                    <strong>{index + 1}.</strong> {record.Title}
                  </div>
                );
              })} */}
          </li>
        </ul>

        <div className="record-count">
          <strong>chunkCount Count:</strong> {chunkCount}
          <br />
        </div>
      </div>
    </>
  );
}