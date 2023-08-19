"use client";

import { useEffect, useState } from "react";
import { Record } from "~/app/components/types";
import { RECORDS_FETCH_URL } from "~/app/config";

export function Counter() {
  const [counter, setCount] = useState(0);
  const [data, setData] = useState<Record[]>([]);

  // setup a websocket connection to the server and listen for changes to the counter value in the database and update the state accordingly
  useEffect(() => {
    getCounter();
  }, []);

  async function getCounter() {
    console.log("getCounter trigger");
    const res = await fetch(RECORDS_FETCH_URL, {
      method: "POST",
    });
    const data = await res.json();
    console.log("Come ther result", data);

    setData(data);
  }

  return (
    <>
      <div className="flex gap2 items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => getCounter()}
        >
          Increment
        </button>
        <ul className="overflow-scroll h-screen">
          <li className="text-sm font-bold ">
            {data &&
              data.map((record, index) => {
                return (
                  <div key={record.id}>
                    <strong>{index}.</strong> {record.fields.Title}
                  </div>
                );
              })}
          </li>
        </ul>
      </div>
    </>
  );
}
