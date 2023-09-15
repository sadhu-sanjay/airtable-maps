'use client';

import { myDebounce } from "./utility/utilityFunctions";
import { useEffect, useMemo } from "react";
import { Spinner3, Spinner4 } from "./spinner";
import useRecords from "./useRecords";
import { WarningAlert } from "./common/alerts/warning-alert";

export default function Counter() {
  const { records } = useRecords();

  // Use useMemo to prevent unnecessary rendering of records list
  const recordsList = useMemo(() => {
    return records.map((record) => (
      <li className="text-sm " key={record.id}>
        <strong>{record.sNo}.</strong> {record.Title}
      </li>
    ));
  }, [records]);

  return (
    <>
      {/* {error &&  <WarningAlert text="Fetching records from airtable. Please try again in a minute...." />}
      {loadingRecords && <Spinner3/>} */}
      {/* {records.length === 0 && !loadingRecords && <div>No records found</div>} */}
      {records.length > 0 && (
        <div className="flex gap2 items-center">
          <ul className="overflow-scroll h-screen">{recordsList}</ul>
          <div className="record-count">
            <strong>Record Count:</strong> {records.length}
          </div>
        </div>
      )}
    </>
  );
}
