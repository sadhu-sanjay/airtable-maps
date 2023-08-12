"use client";

import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchAirtableRecords } from "./airtable-helper";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MAPS_API_KEY } from "~/app/config";
import { Spinner, Spinner2 } from "~/app/components/spinner";
interface Record {
  id: string;
  fields: {
    lat: number;
    lng: number;
    name: string;
    category: string;
  };
  // Include other fields as needed
}

export function MapComponent() {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner />;
      case Status.FAILURE:
        return <div>Error Loading Div</div>;
      case Status.SUCCESS:
        return (
          <MyMap
            {...mapOptions}
            records={records}
            selectedRecord={selectedRecord}
          />
        );
    }
  };
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

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
        <List setSelectedRecord={setSelectedRecord} records={records} />
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
  selectedRecord,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  records?: Record[];
  selectedRecord: Record | null;
}) {
  const mapRef = useRef<google.maps.Map>();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      mapRef.current = new window.google.maps.Map(divRef.current, {
        center,
        zoom,
      });
    }
  }, [center, zoom]);

  useEffect(() => {
    if (selectedRecord && mapRef.current) {
      const { lat, lng } = selectedRecord.fields;
      mapRef.current.setZoom(8); // ADDED THIS
      mapRef.current.panTo(new google.maps.LatLng(lat, lng));
    }
  }, [selectedRecord]);

  return (
    <div ref={divRef} className="w-full h-[96dvh]">
      {mapRef.current &&
        records?.map((record) => (
          <MyMarker key={record.id} map={mapRef.current!} record={record} />
        ))}
    </div>
  );
}

interface MyMarkerProps {
  record: Record;
  map: google.maps.Map;
}

function MyMarker({ record, map }: MyMarkerProps) {
  var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";

  let category = record.fields.category;

  var icons = {
    Hiking: iconBase + "hiker.png",
    University: iconBase + "realestate.png",
    Restaurant: iconBase + "volcano.png",
  } as const;

  const icon = icons[category];

  useEffect(() => {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(record.fields.lat, record.fields.lng),
      map,
      title: record.fields.name,
      icon: {
        url: icon,
        scaledSize: new google.maps.Size(32, 32),
      },
      animation: google.maps.Animation.DROP,
    });

    return () => {
      marker.setMap(null); // this removes the marker
    };
  }, [record, map]);

  // You should return null as we're directly mutating the DOM
  // and the component does not need to render anything itself
  return null;
}

function List({
  records,
  setSelectedRecord,
}: {
  records: Record[];
  setSelectedRecord: Dispatch<SetStateAction<Record | null>>;
}) {
  return (
    <div className="w-[40%] p-6 h-[96dvh] overflow-y-scroll">
      <h1 className="text-2xl font-bold">List of locations</h1>
      {records.length > 0 ? (
        <ul>
          {records.map((record) => (
            <li
              key={record.id}
              onClick={() => setSelectedRecord(record)}
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
