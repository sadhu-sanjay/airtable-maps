"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { fetchAirtableRecords } from "./airtable-helper";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MAPS_API_KEY } from "~/app/config";
import { Spinner, Spinner2 } from "~/app/components/spinner";

export function MapComponent() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchAirtableRecords().then((res) => setRecords(res.records));
  }, []);

  return (
    <div className="w-full h-full px-2 sm:px-16 pt-2 ">
      <div
        className="w-full h-full flex flex-col-reverse sm:flex-row relative
     bg-blue-100 shadow-sm rounded-md border "
      >
        {/* { selectedRecord && selectedRecord.id } */}
        <List records={records} setSelected={setSelectedRecord} />
        <Wrapper apiKey={MAPS_API_KEY} render={render}>
          <MyMap {...mapOptions}  />
        </Wrapper>
      </div>
    </div>
  );
}
const mapOptions = {
  center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
};

function MyMap({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const [map, setMap] = useState<google.maps.Map>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center,
          zoom,
        })
      );
    }
  }, []);

  return (
    <>
      <div ref={ref} className="w-full h-[96dvh] overflow-y-scroll " />;
    </>
  );
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <Spinner />;
    case Status.FAILURE:
      return <div>Error Loading Div</div>;
    case Status.SUCCESS:
      return <MyMap {...mapOptions} />;
  }
};

function MyMarker({ record }: { record: any }) {
  var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
  const category: keyof typeof icons = record.fields.category;

  var icons = {
    Hiking: iconBase + "hiker.png",
    University: iconBase + "realestate.png",
    Restaurant: iconBase + "volcano.png",
  };
  const icon = icons[category];

  return <div> Marker </div>;
}

function List({
  records,
  setSelected,
}: {
  records: any[];
  setSelected: Dispatch<SetStateAction<any>>;
}) {
  return (
    <div className="w-1/2 p-6 h-[96dvh] overflow-y-scroll">
      <h1 className="text-2xl font-bold">List of locations</h1>
      {records.length > 0 ? (
        <ul>
          {records.map((record) => (
            <li
              onClick={() => setSelected(record)}
              key={record.id}
              className="p-4 hover:scale-105 transition-all ease-in-out 1s cursor-pointer
            shadow-sm hover:shadow-md font-mono text-md bg-gray-100 rounded-md m-2 "
            >
              {record.fields.name}
            </li>
          ))}
        </ul>
      ) : (
        <Spinner2 />
      )}
    </div>
  );
}
