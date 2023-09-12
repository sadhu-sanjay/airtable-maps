import { use, useEffect, useState, useTransition } from "react";
import { Record } from "~/app/components/types";
import { RECORDS_FETCH_URL } from "~/app/config";
import { JSONObjectSeparator } from "~/app/components/utility/JSONObjectSeparator";

// a hook which fetches data from the server and gives me records back update every 500 ms
// and then I can use the records to update the UI
// I can also use the isFetching to show a spinner
export function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [isPending, startTransition] = useTransition();
  console.log("RE-RENDER USE RECORDS");

  async function fetchRecordsAndStore(signal: AbortSignal) {
    console.time("FETCHER");

    const res = await fetch(RECORDS_FETCH_URL, { signal });
    if (res.ok) {
      const reader = res.body!.getReader();
      let localCollection: Array<Record> = [];
      const separator = new JSONObjectSeparator((jsonString) => {
        jsonString = jsonString.substring(1);
        const record = JSON.parse(jsonString);

        localCollection.push(record);
        
        // if (localCollection.length > 10000) {
          
        //   setRecords((prev) => [...prev, ...localCollection]);

        //   localCollection = [];
        // }
      });
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("FETCHER");
          break;
        }
        try {
          const jsonString = new TextDecoder("utf-8").decode(value);
          separator.receive(jsonString);
        } catch (error) {
          console.log("Error", error);
        }
      }
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchRecordsAndStore(signal);

    return () => {
      abortController.abort();
    };
  }, []);

  return records;
}
