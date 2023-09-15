"use client";

import { myDebounce } from "./utility/utilityFunctions";
import { CSSProperties, useEffect, useMemo } from "react";
import { Spinner3, Spinner4 } from "./spinner";
import useRecords from "./useRecords";
import { WarningAlert } from "./common/alerts/warning-alert";
import { FixedSizeList as List } from "react-window";

export default function Counter() {
  const { records } = useRecords();

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const record = records[index];
    return (
      <li className="text-sm " key={record.id} style={style}>
        <strong>{record.sNo}.</strong> {record.Title}
      </li>
    );
  };

  return (
    <>
      {records.length > 0 && (
        <div className="flex gap2 items-center">
          <List
            height={screen.height} // adjust this according to your needs
            itemCount={records.length}
            itemSize={30} // adjust this according to your needs
            width="40%" // adjust this according to your needs
          >
            {Row}
          </List>
          <div className="record-count">
            <strong>Record Count:</strong> {records.length}
          </div>
        </div>
      )}
    </>
  );
}
