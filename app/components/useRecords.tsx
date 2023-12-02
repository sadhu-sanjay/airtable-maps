import { useCallback, useState } from "react";
import { DropdownItem, Record } from "~/app/components/types";
import { RECORDS_FETCH_URL } from "~/app/config";

export default function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [status, setStatus] = useState<string>("");
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  console.log("USE RECORDS RENDER");

  const fetchRecords = useCallback((selectedView: DropdownItem) => {
    setIsLoadingRecords(true);
    setStatus("Getting Records");
    setRecords([]);

    try {
      const viewKey = selectedView?.value;
      if (!viewKey) {
        setStatus("No view selected... please select a view.");
        throw new Error("noKey");
      }
      const RECORDS_FETCH_URL_WITH_VIEW = `${RECORDS_FETCH_URL}?viewKey=${viewKey}`;

      fetch(RECORDS_FETCH_URL_WITH_VIEW)
        .then((res) => {
          if (!res.ok) {
            setStatus("Server response not ok");
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          if (res.status === "Started") {
            setStatus(
              "No records found.. will try updating server. Please try again in a moment"
            );
            setIsLoadingRecords(true);

            setTimeout(() => {
              fetchRecords(selectedView);
            }, 5000);
          } else {
            setRecords((prevRecords) => [...prevRecords, ...res]);
            setIsLoadingRecords(false);
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
