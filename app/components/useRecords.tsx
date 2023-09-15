import { useCallback, useEffect, useState, useTransition } from "react";
import { Record } from "~/app/components/types";
import { JSONObjectSeparator } from "~/app/components/utility/JSONObjectSeparator";
import { RECORDS_FETCH_URL } from "~/app/config";
import { WarningAlert } from "~/app/components/common/alerts/warning-alert";
import { myDebounce } from "./utility/utilityFunctions";

export default function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [error, setError] = useState({});
  // const [loadingRecords, setLoadingRecords] = useState(true);
  console.log("USERECORDS RE-RENDER");

  const updateState = (records: Array<Record>) => {
    setTimeout(() => {
      setRecords((prevRecords) => [...prevRecords, ...records]);
    }, 0);
  };
  const fetchRecords = useCallback(async (signal: AbortSignal) => {
    console.time("fetcher");
    const res = await fetch(RECORDS_FETCH_URL, { signal });
    // const res = await fetch(
    //   "https://shicane-test.ey.r.appspot.com/api/records",
    //   { signal }
    // );
    if (!res.ok) setError("Error fetching records... Please try again later.");
    const reader = res.body!.getReader();
    let buffer = "";
    let localRecords: Array<Record> = [];

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          updateState(localRecords);
          localRecords = [];
          console.timeEnd("fetcher");
          break;
        }

        let recordsJson = new TextDecoder().decode(value);
        buffer += recordsJson;

        const recordsStringArray = buffer.split("\n");
        buffer = recordsStringArray.pop() || "";

        const newRecords = recordsStringArray.map((record) =>
          JSON.parse(record)
        );
        localRecords.push(...newRecords);

        if (localRecords.length > 100) {
          updateState(localRecords);
          localRecords = [];
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Fetch Error: ", error);
        setError(error);
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchRecords(signal);

    return () => {
      abortController.abort();
    };
  }, [fetchRecords]);

  // return { loadingRecords, error, records };
  return { records };
}
