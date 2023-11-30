import { useCallback, useState } from "react";
import { DropdownItem, Record } from "~/app/components/types";
import { RECORDS_FETCH_URL } from "~/app/config";

export default function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [status, setStatus] = useState<string>("Default Status");
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  console.log("USE RECORDS RENDER");

  const fetchRecords = useCallback((selectedView: DropdownItem) => {
    setIsLoadingRecords(true);
    setRecords([]);

    try {
      const viewKey = selectedView?.value;
      if (!viewKey) {
        throw new Error("noKey");
      }
      const RECORDS_FETCH_URL_WITH_VIEW = `${RECORDS_FETCH_URL}?viewKey=${viewKey}`;

      fetch(RECORDS_FETCH_URL_WITH_VIEW)
        .then((res) => {
          if (!res.ok) {
            setStatus(res.statusText);
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          if (res.count === 0) {
            setStatus(res.message);
            return setRecords([]);
          }
          setRecords((prevRecords) => [...prevRecords, ...res]);
        })
        .catch((e) => {
          setStatus(e.message);
        })
        .finally(() => {
          setIsLoadingRecords(false);
        });
    } catch (e: any) {
      console.log("catch Error::", e);
      setStatus(e.message);
      setIsLoadingRecords(false);
    }
  }, []);

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

  return { isLoadingRecords, records, fetchRecords, status };
}
