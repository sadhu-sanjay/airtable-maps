import { use, useCallback, useEffect, useRef, useState } from "react";
import { DropdownItem, Record } from "~/app/components/types";
import {
  RECORDS_FETCH_URL,
  AIRTABLE_EVENTS_URL,
  REGIONS_FETCH_URL,
  defaultRegions,
  defaultCountries,
  defaultCities,
  defaultTags,
} from "~/app/config";

export default function useRecords(selectedView?: DropdownItem) {
  const isFirstLoad = useRef(true);
  const [records, setRecords] = useState<Record[]>([]);
  const [recordsError, setRecordsError] = useState<null>(null);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log("USE RECORDS RENDER", selectedView);
  const updateState = useCallback((records: Array<Record>) => {
    setTimeout(() => {
      setRecords((prevRecords) => [...prevRecords, ...records]);
    }, 0);
  }, []);

  const fetchRecords = useCallback(
    async (signal: AbortSignal) => {
      console.info("FETCHRECORDS called");
      setIsLoadingRecords(true);
      // encode selected view to be sent in query params

      try {
        const viewKey = selectedView?.value;
        if (!viewKey) {
          throw new Error("noKey");
        }
        const RECORDS_FETCH_URL_WITH_VIEW = `${RECORDS_FETCH_URL}?viewKey=${viewKey}`;

        fetch(RECORDS_FETCH_URL_WITH_VIEW, { signal })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((res) => {
            if (res.status === "Started") {
              timeoutRef.current = setTimeout(() => {
                console.log("Recursion");
                fetchRecords(signal);
              }, 5000);
              return;
            }

            console.info("FETCHED RECORDS", res);
            updateState(res);
            setIsLoadingRecords(false);
          })
          .catch((e) => {
            if (e.name === "AbortError") {
              console.log("Fetch Items Aborted");
            } else {
              console.error("Error Fetching Regions ==> ", e);
            }
            setRecordsError(e);
            setIsLoadingRecords(false);
          });
      } catch (e: any) {
        console.log("catch Error::", e);
        setIsLoadingRecords(false);
      }
    },
    [selectedView, updateState]
  );

  /**
   *
   * @returns Array of regions from url query params else default regions
   */
  function getQueryParameters(signal: AbortSignal) {
    const urlParams = new URLSearchParams(window.location.search);
    const viewKey = urlParams.get("viewKey");

    if (viewKey) {
      // come here you have any query parameter
      // const regionsArray = regions?.split(",");
      // const query = RECORDS_FETCH_URL + "?";
      // const regionsQuery = regionsArray.map((region) => `regions=${region}`);
      // const queryString = query + [...regionsQuery].join("&");
      // fetchRecordsWithQueryParams(queryString);
    } else {
      // come here if you don't have any query parameter

      if (isFirstLoad.current) {
        isFirstLoad.current = false;

        const query = RECORDS_FETCH_URL + "?";

        const regionsParams = defaultRegions.map(
          (region) => `regions=${region}`
        );
        const countriesParams = defaultCountries.map(
          (country) => `countries=${country}`
        );
        const citiesParams = defaultCities.map((city) => `cities=${city}`);
        const tagsParams = defaultTags.map((tag) => `tags=${tag}`);

        const queryString =
          query +
          [
            ...regionsParams,
            ...tagsParams,
            ...countriesParams,
            ...citiesParams,
          ].join("&");

        fetchRecordsWithQueryParams(queryString);
      } else {
        console.log("NOT FIRST LOAD");
      }
    }

    function fetchRecordsWithQueryParams(url: string) {
      fetch(url.toString(), { signal })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          console.info("FETCHED RECORDS", res);
          updateState(res);
        })
        .catch((e) => {
          console.log("ERROR", e);
        })
        .finally(() => {
          console.log("FINALLY");
        });
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    console.log("USE RECORDS EFFECT", selectedView);
    fetchRecords(signal);
    // getQueryParameters(signal);

    return () => {
      console.info("Abort controller", abortController);
      abortController.abort();
      isFirstLoad.current = true;
      setRecords([]);
      if (timeoutRef.current) {
        console.log("CLEAR TIMEOUT");
        clearTimeout(timeoutRef.current);
      }
      console.log("CLEANUP USE RECORDS ");
    };
  }, [selectedView, fetchRecords]);

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

  return { recordsError, isLoadingRecords, records };
}
