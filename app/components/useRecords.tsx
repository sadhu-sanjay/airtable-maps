import { useCallback, useEffect, useState } from "react";
import { Record } from "~/app/components/types";
import { RECORDS_FETCH_URL, AIRTABLE_EVENTS_URL } from "~/app/config";

export default function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [recordsError, setRecordsError] = useState<null>(null);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  console.log("USE RECORDS RENDER");

  const updateState = useCallback((records: Array<Record>) => {
    setTimeout(() => {
      setRecords((prevRecords) => [...prevRecords, ...records]);
    }, 0);
  }, []);

  const fetchRecords = useCallback(
    async (signal: AbortSignal) => {
      try {
        setIsLoadingRecords(true);
        const res = await fetch(RECORDS_FETCH_URL, { signal });
        const reader = res.body!.getReader();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          console.log("READ");

          try {
            if (done) {
              setIsLoadingRecords(false);
              break;
            }

            let recordsJson = new TextDecoder().decode(value);
            buffer += recordsJson;

            const recordsStringArray = buffer.split("\n");
            const lastRecord =
              recordsStringArray[recordsStringArray.length - 1];
            try {
              JSON.parse(lastRecord);
            } catch (error) {
              buffer = recordsStringArray.pop() || "";
            }

            const newRecords = recordsStringArray.map((record) =>
              JSON.parse(record)
            );

            updateState(newRecords);
          } catch (error: any) {
            console.log("Error =>", error);
            setRecordsError(error);
            break;
          }
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Abort ERRor");
        } else {
          console.error("Error: ", error);
          setIsLoadingRecords(false);
          setRecordsError(error.message);
        }
      }
    },
    [updateState]
  );

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchRecords(signal);

    return () => {
      abortController.abort();
      setRecords([]);
      console.log("CLEANUP USE RECORDS ");
    };
  }, [fetchRecords]);

  /**
   * Handle RealTime Events
   */
  useEffect(() => {
    const eventSource = new EventSource(AIRTABLE_EVENTS_URL);

    eventSource.onopen = (event) => {
      console.log("EVENT SOURCE OPEN", event);
    };

    eventSource.addEventListener("delete", (e) => {
      console.log("DELETE EVENT TRIGGERED", e.data);
      const recordsIDs = JSON.parse(e.data);
      const newRecords = records.filter((r) => !recordsIDs.includes(r.id));
      setRecords(newRecords);
    });

    eventSource.onerror = (event) => {
      console.log("EVENT SOURCE ERROR", event);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [records]);

  return { recordsError, isLoadingRecords, records };
}
