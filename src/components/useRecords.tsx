import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { DropdownItem, Record } from "~/components/models/types";
import { RECORDS_FETCH_URL } from "~/config";

export default function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [status, setStatus] = useState<string>("");
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isStreamingRecords, setIsStreamingRecords] = useState(false);
  const timeoutID = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);

  console.log("USE RECORDS RENDER");

  const fetchRecords = useCallback(
    (selectedView: DropdownItem, signal: AbortSignal, cachePolicy: string = 'no-store') => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
      setIsLoadingRecords(true);
      setStatus("Gettng Records");
      setRecords([]);

      try {
        const viewKey = selectedView?.value;
        if (!viewKey) {
          setStatus("No view selected... please select a view.");
          throw new Error("noKey");
        }
        const RECORDS_FETCH_URL_WITH_VIEW = `${RECORDS_FETCH_URL}?viewKey=${viewKey}`;

        fetch(RECORDS_FETCH_URL_WITH_VIEW, {
          signal,
          cache: 'no-store'
        })
          .then(async (res) => {

            if (res.status === 500) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            if (res.status == 300) {
                retryCount.current += 1;
                if (retryCount.current > 5) {
                 // stop trying if after 5 tries still no records
                 setStatus(
                   "No records found. if too many records in the view it might take few mintues to update or check your airtable view to see if any records present."
                 );
                 setIsLoadingRecords(false);
                 retryCount.current = 0;
               } else {
                 setStatus("No Records found, checking again..");
                 timeoutID.current = setTimeout(() => {
                   fetchRecords(selectedView, signal);
                 }, 5000);
               }
            } else {

            const reader = res.body?.getReader();
            const decoder = new TextDecoder("utf-8");
            let unprocessed = "";
            const tempRecords: Record[] = [];

            while (true) {
              setIsStreamingRecords(true);
              setIsLoadingRecords(false);
              const { done, value } = await reader!.read();

              if (done) {
                console.log("Stream finished");
                setIsStreamingRecords(false);
                break;
              }

              let chunk = unprocessed + decoder.decode(value);
              const lines = chunk.split("\n");
              unprocessed = lines.pop() || "";

              setTimeout(() => {
                const parsedObjects = lines.map((line) => JSON.parse(line));
                setRecords((prevRecords) => [...prevRecords, ...parsedObjects]);
              }, 0);
            }
            }

          })
          .catch((e) => {
            setStatus("unknown error..please try refresh button");
            console.error("Error", e);
            setIsLoadingRecords(false);
          });
      } catch (e: any) {
        console.log("catch Error::", e);
        setStatus("unknown error..please try refresh button");
        setIsLoadingRecords(false);
      }
    },
    []
  );

  /**
   * Handle RealTime Events
   */
  // useEffect(() => {
  //   const eventSource = new EventSource(AIRTABLE_EVENTS_URL);

  //   eventSource.onopen = (event) => {
  //     console.log("EVENT SOURCE OPEN", event);
  //   };

  //   eventSource.addEventListener("add", (e) => {
  //     console.log("ADD EVENT TRIGGERED", e.data);
  //     const newRecords: Record[] = JSON.parse(e.data);
  //     console.log("ADDED RECORDS", newRecords);

  //     setRecords((prevRecords) => {
  //       return [...prevRecords, ...newRecords];
  //     });
  //   });

  //   eventSource.addEventListener("update", (e) => {

  //     console.log("UPDATE EVENT TRIGGERED", e.data);
  //     const updatedRecords: Record[] = JSON.parse(e.data);
  //     console.log("UPDATED RECORDS", updatedRecords);

  //     setRecords((prevRecords) => {
  //       const newRecords = prevRecords.map((each) => {
  //         const updatedRecord = updatedRecords.find(
  //           (record) => record.id === each.id
  //         );
  //         if (updatedRecord) {
  //           return updatedRecord;
  //         } else {
  //           return each;
  //         }
  //       });
  //       return newRecords;
  //     });
  //   })

  //   eventSource.addEventListener("delete", (e) => {
  //     console.log("DELETE EVENT TRIGGERED", e.data);
  //     const deletedRecordIds: string[] = JSON.parse(e.data);
  //     setRecords((prevRecords) =>
  //       prevRecords.filter((each) => !deletedRecordIds.includes(each.id))
  //     );
  //   });

  //   eventSource.onerror = (event) => {
  //     console.log("EVENT SOURCE ERROR", event);
  //     eventSource.close();
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  return {
    isStreamingRecords,
    isLoadingRecords,
    records,
    fetchRecords,
    status,
  };
}
