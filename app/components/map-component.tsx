"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { fetchAirtableRecords } from "./airtable-helper";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MAPS_API_KEY } from "~/app/config";
import { Spinner, Spinner2 } from "~/app/components/spinner";

export function MapComponent() {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner />;
      case Status.FAILURE:
        return <div>Error Loading Div</div>;
      case Status.SUCCESS:
        return <MyMap {...mapOptions} records={records} />;
    }
  };
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
        <Wrapper apiKey={MAPS_API_KEY} render={render} />
      </div>
    </div>
  );
}
const mapOptions = {
  center: { lat: 38.50505275699189, lng: -98.9286968796735 },
  zoom: 4,
};

function MyMap({
  center,
  zoom,
  records,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  records?: any[];
}) {
  const [map, setMap] = useState<google.maps.Map>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      console.log("Setting REf");
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
      <div ref={ref} className="w-full h-[96dvh] ">
        {map &&
          records?.map((record) => (
            <MyMarker key={record.id} map={map} record={record} />
          ))}
      </div>
    </>
  );
}

function MyMarker({ record, map }: { record: any; map: google.maps.Map }) {
  var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
  const category: keyof typeof icons = record.fields.category;

  var icons = {
    Hiking: iconBase + "hiker.png",
    University: iconBase + "realestate.png",
    Restaurant: iconBase + "volcano.png",
  };
  const icon = icons[category];

  const Marker = new window.google.maps.Marker({
    position: { lat: record.fields.lat, lng: record.fields.lng },
    animation: window.google.maps.Animation.DROP,
    icon: {
      url: icon,
      scaledSize: new window.google.maps.Size(32, 32),
    },
    map: map,
  });

  return <> Marker</>;
}

function List({
  records,
  setSelected,
}: {
  records: any[];
  setSelected: Dispatch<SetStateAction<any>>;
}) {
  return (
    <div className="w-[40%] p-6 h-[96dvh] overflow-y-scroll">
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
