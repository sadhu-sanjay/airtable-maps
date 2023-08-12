"use client";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchAirtableRecords } from "./airtable-helper";
import IconRest from "~/app/assets/restaurant.svg";

export function MapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    fetchAirtableRecords().then((res) => setRecords(res.records));
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (loadError) {
    return <div>Error Loading Map</div>;
  }

  return (
    <div className="w-full h-full px-2 sm:px-16 pt-2 ">
      <div
        className="w-full h-full flex flex-col-reverse sm:flex-row relative
     bg-blue-100 shadow-sm rounded-md border "
      >
        {/* { selectedRecord && selectedRecord.id } */}
        <List records={records} setSelected={setSelectedRecord} />
        <Map records={records} selectedRecord={selectedRecord} />
      </div>
    </div>
  );
}

const center = {
  lat: 35.4676,
  lng: -97.5164,
};

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
      <ul>
        {records.map((record) => (
          <li
            onClick={() => setSelected(record)}
            key={record.id}
            className="p-4 hover:scale-105 transition-all ease-in-out 1s cursor-pointer
            shadow-sm
            hover:shadow-md 
          font-mono text-md bg-gray-100 rounded-md m-2 "
          >
            {record.fields.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Map({
  records,
  selectedRecord,
}: {
  records: any[];
  selectedRecord: any;
}) {
  return (
    <GoogleMap
      zoom={4}
      center={center}
      mapContainerClassName="w-full h-[60dvh] sm:h-[96dvh]"
    >
      {records &&
        records.map((record) => <MyMarker key={record.id} record={record} />)}
    </GoogleMap>
  );

  function MyMarker({ record }: { record: any }) {
    var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
    const category: keyof typeof icons = record.fields.category;

    var icons = {
      Hiking: iconBase + "hiker.png",
      University: iconBase + "realestate.png",
      Restaurant: iconBase + "volcano.png",
    };
    const icon = icons[category];

    return (
      <Marker
        key={record.id}
        position={{ lat: record.fields.lat, lng: record.fields.lng }}
        // title={record.fields.name}
        icon={{ url: icon, scaledSize: new window.google.maps.Size(32, 32) }}
      />
    );
  }
}
