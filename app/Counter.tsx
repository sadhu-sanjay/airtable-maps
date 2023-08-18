"use client";
import { useEffect, useState } from "react";
import { Record } from "~/app/components/types";

export function Counter() {
  const [counter, setCount] = useState(0);
  const [data, setData] = useState<Record[]>([]);

  // setup a websocket connection to the server and listen for changes to the counter value in the database and update the state accordingly
  // useEffect(() => {
  //   const socket = new WebSocket("ws://localhost:3000");
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.counter) {
  //       setCount(data.counter);
  //     }
  //   };
  // }, []);

  async function getCounter() {
    console.log("getCounter trigger");
    const res = await fetch("http://localhost:3000/api/hello", {
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
                return <div key={record.id}><strong>{index}.</strong>   {record.fields.Title}</div>;
              })}
          </li>
        </ul>
      </div>
    </>
  );
}
