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
import { Record } from "~/app/components/types";
import { calculateBounds } from "~/app/components/map-helper";

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
            filteredRecords={filteredRecords}
            selectedRecord={selectedRecord}
          />
        );
    }
  };
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value);
  };
  const filteredRecords = records.filter(
    (record) =>
      record.fields.category.includes(category) &&
      record.fields.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAirtableRecords().then((res) => setRecords(res.records));
  }, []);

  return (
    <div className="w-full h-full px-2 sm:px-16 pt-2 ">
      <div className=" z-20 p-4 gap-2 shadow-sm bg-slate-50 flex items-stretch justify-between">
        <h1 className="self-center text-xl font-bold">Airtable Records</h1>
        <div className="flex ">
          <input
            type="text"
            placeholder="Search..."
            className="w-[100%] p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleSearchChange}
          />
        </div>
        <select
          value={category}
          onChange={handleCategoryChange}
          id="countries"
          className=" bg-gray-50 w-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Hiking">Hiking</option>
          <option value="University">University</option>
          <option value="Restaurant">Restaurant</option>
        </select>
      </div>
      <div
        className="w-full h-full flex flex-col-reverse sm:flex-row relative
     bg-blue-100 shadow-sm rounded-md border "
      >
        <List
          filteredRecords={filteredRecords}
          setSelectedRecord={setSelectedRecord}
          records={records}
        />
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
  filteredRecords,
  selectedRecord,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  filteredRecords?: Record[];
  selectedRecord: Record | null;
}) {
  const mapRef = useRef<google.maps.Map>();
  const divRef = useRef<HTMLDivElement>(null);
  const bounds = calculateBounds(selectedRecord, filteredRecords || []);

  useEffect(() => {
    if (bounds && mapRef.current) {
      const googleBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(bounds.south, bounds.west),
        new google.maps.LatLng(bounds.north, bounds.east)
      );
      mapRef.current.fitBounds(googleBounds, {
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
      });
    }
  }, [bounds]);

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
    <div ref={divRef} className="w-full h-[50dvh] sm:h-[85dvh]">
      {mapRef.current &&
        filteredRecords?.map((record) => (
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

  var icons: { [key: string]: string } = {
    Hiking: iconBase + "hiker.png",
    University: iconBase + "volcano.png",
    Restaurant: iconBase + "coffee.png",
  };

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

  return null;
}

function List({
  records,
  filteredRecords,
  setSelectedRecord,
}: {
  records: Record[];
  filteredRecords: Record[];
  setSelectedRecord: Dispatch<SetStateAction<Record | null>>;
}) {
  return (
    <div className="relative sm:w-[40%] w-full  ">
      {records.length > 0 ? (
        <ul className="overflow-y-scroll h-[85dvh] p-4">
          {filteredRecords.map((record) => (
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
