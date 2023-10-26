import { useCallback, useEffect, useState } from "react";
import { Record } from "~/app/components/types";
import {
  RECORDS_FETCH_URL,
  AIRTABLE_EVENTS_URL,
  REGIONS_FETCH_URL,
  defaultRegions,
  defaultCountries,
  defaultCities,
  defaultTags,
} from "~/app/config";

export default function useRecords(selectedRegion: string[]) {
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

        // encode selected regions to be sent in query params
        const encodedRegions = selectedRegion.map((region) =>
          encodeURIComponent(region)
        );
        const RECORDS_FETCH_URL_WITH_REGIONS = `${RECORDS_FETCH_URL}?regions=${encodedRegions.join(
          ","
        )}`;

        const res = await fetch(RECORDS_FETCH_URL_WITH_REGIONS, { signal });
        const jsonbody = await res.json();

        // updateState(jsonbody);
        console.log("JSON BODY", typeof jsonbody);

        // let buffer = "";

        // while (true) {
        //   const { done, value } = await reader.read();
        //   console.log("READ");

        //   try {
        //     if (done) {
        //       setIsLoadingRecords(false);
        //       break;
        //     }

        //     let recordsJson = new TextDecoder().decode(value);
        //     buffer += recordsJson;

        //     const recordsStringArray = buffer.split("\n");
        //     const lastRecord =
        //       recordsStringArray[recordsStringArray.length - 1];
        //     try {
        //       JSON.parse(lastRecord);
        //     } catch (error) {
        //       buffer = recordsStringArray.pop() || "";
        //     }

        //     const newRecords = recordsStringArray.map((record) =>
        //       JSON.parse(record)
        //     );

        //     updateState(newRecords);
        //   } catch (error: any) {
        //     console.log("Error =>", error);
        //     setRecordsError(error);
        //     break;
        //   }
        // }
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

  /**
   *
   * @returns Array of regions from url query params else default regions
   */
  function getQueryParameters(signal: AbortSignal) {
    const urlParams = new URLSearchParams(window.location.search);
    const regions = urlParams.get("regions");
    // const countries = urlParams.get("countries");
    // const cities = urlParams.get("cities");
    // const tags = urlParams.get("tags");

    const regionsArray = regions?.split(",") || defaultRegions;
    // const countriesArray = countries?.split(",") || defaultCountries;
    // const citiesArray = cities?.split(",") || defaultCities;
    // const tagsArray = tags?.split(",") || defaultTags;

    // Create get Query
    const query = RECORDS_FETCH_URL + "?";
    const regionsQuery = regionsArray.map((region) => `regions=${region}`);
    // const countriesQuery = countriesArray.map((country) => `countries=${country}`);
    // const citiesQuery = citiesArray.map((city) => `cities=${city}`);
    // const tagsQuery = tagsArray.map((tag) => `tags=${tag}`);

    // const queryString = query + [...regionsQuery, ...countriesQuery, ...citiesQuery, ...tagsQuery].join("&");
    const queryString = query + [...regionsQuery].join("&");
    const url = new URL(queryString);

    console.log("URL", url);
    fetch(url.toString(), { signal })
      .then((res) => res.json())
      .then((res) => {
        console.log("RES", res);
      })
      .finally(() => {
        console.log("FINALLY");
      });
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    // fetchRecords(signal);
    getQueryParameters(signal);

    return () => {
      abortController.abort();
      setRecords([]);
      console.log("CLEANUP USE RECORDS ");
    };
  }, [fetchRecords, selectedRegion]);

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
