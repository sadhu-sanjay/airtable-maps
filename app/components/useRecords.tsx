import { useCallback, useEffect, useState } from "react";
import { Record } from "~/app/components/types";
import { RECORDS_FETCH_URL } from "~/app/config";

export default function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [recordsError, setRecordsError] = useState<null>(null);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  const updateState = (records: Array<Record>) => {
    setTimeout(() => {
      setRecords((prevRecords) => [...prevRecords, ...records]);
    }, 0);
  };

  const fetchRecords = useCallback(async (signal: AbortSignal) => {
    setIsLoadingRecords(true);

    try {
      // const res = await fetch(RECORDS_FETCH_URL, { signal });
      const res = await fetch("https://shicane-test.ey.r.appspot.com/api/records", { signal });
      const reader = res.body!.getReader();
      let buffer = "";
      let localRecords: Array<Record> = [];

      while (true) {
        const { done, value } = await reader.read();
        console.log("READ")
        if (done) {
          updateState(localRecords);
          localRecords = [];
          setIsLoadingRecords(false);
          break;
        }

        try {
          let recordsJson = new TextDecoder().decode(value);
          buffer += recordsJson;

          const recordsStringArray = buffer.split("\n");
          buffer = recordsStringArray.pop() || ""; // last element might not be proper object so pull it out

          const newRecords = recordsStringArray.map((record) =>
            JSON.parse(record)
          );
          localRecords.push(...newRecords);

          if (localRecords.length > 100) {
            // updateState(localRecords);
            // localRecords = [];
            // break
          }
        } catch (error: any) {
          console.log("Error parsing JSON", error);
          setRecordsError(error);
          break;
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("FETCHE FETCH Fetch Error: ", typeof error);
        setRecordsError(error.message);
      }
      setIsLoadingRecords(false);
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

  return { recordsError, isLoadingRecords, records };
}
