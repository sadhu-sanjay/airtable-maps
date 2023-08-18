"use client";

import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Spinner, Spinner2 } from "~/app/components/spinner";
import { Record } from "~/app/components/types";
import { MAPS_API_KEY, clusterThreshHold } from "~/app/config";
import { fetchAirtableRecords, fetchsql, sampleFetch } from "./airtable-helper";

export function MapComponent() {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner />;
      case Status.FAILURE:
        return <div>Error Loading Map</div>;
      case Status.SUCCESS:
        return (
          <MyMap
            {...mapOptions}
            filteredRecords={filteredRecords}
            selectedRecord={selectedRecord}
            records={records}
          />
        );
    }
  };
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const filteredRecords = records
    ? records.filter((record) =>
        // record.fields.category.includes(category) &&
        record.fields.Title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    setIsLoading(true);
    // fetchsql().then((value: any) => {
    //   const mappedArray: Record[] = value.map((data: any) => ({
    //     id: data.Id.toString(), // Convert Id to string
    //     createdTime: data.Date, // Assuming Date is the creation time
    //     fields: {
    //       lat: parseFloat(data.Coordinates.split(",")[0]),
    //       lng: parseFloat(data.Coordinates.split(",")[1]),
    //       Title: data.Title || "",
    //       Region: data.Region.split(","), // Assuming Region is comma-separated
    //       City: data.City,
    //       "Coordinates (lat, lng)": data.Coordinates,
    //       Tags: data.Tags.split(","), // Assuming Tags is comma-separated
    //       "State / AAL1": data.State,
    //       Country: data.Country,
    //     },
    //   }));

    //   setRecords(mappedArray);
    //   setIsLoading(false);
    // });

    // fetchAirtableRecords()
    //   .then((res: any) => setRecords(res.records))
    //   .finally(() => setIsLoading(false));

    // sampleFetch()

  }, []);

  return (
    <div className="w-full h-full px-2 sm:px-16 pt-2 ">
      <div className="rounded-sm z-20 p-4 gap-2 shadow-sm bg-slate-50 dark:bg-gray-800 flex items-stretch justify-between">
        <h1 className="self-center text-xl font-bold dark:text-slate-200">
          Airtable Records
        </h1>
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
          <option value="Airport">Airport</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Lake">Lake</option>
          <option value="Pub">Pub</option>
        </select>
      </div>
      <div
        className="w-full h-full flex flex-col-reverse sm:flex-row relative
     bg-gray-100 dark:bg-gray-800 shadow-sm rounded-md border "
      >
        {/* <List
          isLoading={isLoading}
          filteredRecords={filteredRecords}
          setSelectedRecord={setSelectedRecord}
          records={records}
        /> */}
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
  records,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  filteredRecords?: Record[];
  selectedRecord: Record | null;
  records: Record[];
}) {
  const mapRef = useRef<google.maps.Map>();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && filteredRecords) {
      const bounds = new google.maps.LatLngBounds();
      filteredRecords.forEach((record) => {
        const latLng = new window.google.maps.LatLng(
          record.fields.lat,
          record.fields.lng
        );
        bounds.extend(latLng);
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [filteredRecords]);

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
      // const [lat, lng] = selectedRecord.fields["Coordinates (lat, lng)"]
      //   .split(",")
      //   .map(parseFloat);
      mapRef.current.setZoom(8); // ADDED THIS
      mapRef.current.panTo(
        new google.maps.LatLng(
          selectedRecord.fields.lat,
          selectedRecord.fields.lng
        )
      );
    }
  }, [selectedRecord]);

  const markers = filteredRecords?.map((value) => {
    const marker = new google.maps.Marker({
      position: { lat: value.fields.lat, lng: value.fields.lng },
      icon: {
        url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        scaledSize: new google.maps.Size(20, 20),
      },
    });
    return marker;
  });

  useEffect(() => {
    console.log("Lenght", filteredRecords?.length);
    if (filteredRecords && filteredRecords.length < clusterThreshHold) return;

    const mc = new MarkerClusterer({
      markers,
      map: mapRef.current,
    });

    return () => {
      mc.clearMarkers();
    };
  }, [markers]);

  return (
    <div ref={divRef} className="w-full h-[50dvh] sm:h-[85dvh]">
      {mapRef.current &&
        filteredRecords &&
        filteredRecords?.length < clusterThreshHold &&
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
  if (record.fields["Coordinates (lat, lng)"]) {
    const [lat, lng] = record.fields["Coordinates (lat, lng)"]
      .split(",")
      .map(parseFloat);
    record.fields.lat = lat;
    record.fields.lng = lng;
  }

  let category = record.fields.City;

  // var icons: { [key: string]: string } = {
  //   Hiking: iconBase + "hiker.png",
  //   Airport: iconBase + "volcano.png",
  //   Restaurant: iconBase + "coffee.png",
  //   Pub: iconBase + "bars.png",
  //   Lake: iconBase + "terrain.png",
  // };

  // const icon = icons[category];
  const icon = iconBase + "volcano.png";

  useEffect(() => {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(record.fields.lat, record.fields.lng),
      map,
      title: record.fields.Title,
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
  isLoading,
  records,
  filteredRecords,
  setSelectedRecord,
}: {
  isLoading: boolean;
  records: Record[];
  filteredRecords: Record[];
  setSelectedRecord: Dispatch<SetStateAction<Record | null>>;
}) {
  return (
    <div className="relative sm:w-[25%] w-full  ">
      {isLoading ? (
        <Spinner2 />
      ) : records?.length > 0 ? (
        <ul className="overflow-y-scroll h-[85dvh] p-4">
          {filteredRecords.map((record, index) => (
            <li
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="p-4 hover:scale-105 transition-all ease-in-out 1s cursor-pointer
            shadow-sm hover:shadow-md font-mono text-md bg-gray-100 rounded-md m-2 
            dark:bg-gray-700"
            >
              <strong>
                {index + 1}
                {". "}{" "}
              </strong>
              {record.fields.Title}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center p-5 top-1/4 ">
          <p style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            No records found ~!
          </p>
          <p style={{ fontSize: "1rem", color: "gray" }}>
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
