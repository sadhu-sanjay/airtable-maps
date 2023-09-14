import { useEffect, useState, useTransition } from "react";
import { Record } from "~/app/components/types";
import { JSONObjectSeparator } from "~/app/components/utility/JSONObjectSeparator";
import { RECORDS_FETCH_URL } from "~/app/config";
import { WarningAlert } from "~/app/components/common/alerts/warning-alert";
import { myDebounce } from "./utility/utilityFunctions";

export default function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  // const [error, setError] = useState({});
  // const [loadingRecords, setLoadingRecords] = useState(true);
  console.log("USERECORDS RE-RENDER");

  const updateState = (batch: Array<Record>) => {
    setTimeout(() => {
      console.log("BATCH: ", batch);
      setRecords((prevRecords) => [...prevRecords, ...batch]);
    },0);
  };

  async function fetchRecordsAndStore(signal: AbortSignal) {
    const res = await fetch(RECORDS_FETCH_URL, { signal });
    // const res = await fetch("https://shicane-test.ey.r.appspot.com/api/records", { signal });

    if (!res.ok) {
      alert("Error fetching records");
    }
    const reader = res.body!.getReader();
    let batch: Array<Record> = [];
    let batchSize = 100;

    const separator = new JSONObjectSeparator((jsonString) => {
      jsonString = jsonString.substring(1);
      const record = JSON.parse(jsonString);

      batch.push(record);
      if (batch.length > batchSize) {
        updateState(batch);
        batch = [];
      }
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("STREAM FINISHED");
        updateState(batch); // Push the final remaining records in the batch 
        break;
      }

      try {
        const jsonString = new TextDecoder("utf-8").decode(value);

        separator.receive(jsonString);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
          break;
        } else {
          console.error("Fetch Error: ", error);
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

  // return { loadingRecords, error, records };
  return { records };
}
