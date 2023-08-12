"use client";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect } from "react";
import { fetchAirtableRecords } from "./airtable-helper";

export function MapComponent() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (loadError) {
    return <div>Error Loading Map</div>;
  }

  return (
    <div className="w-full h-full px-2 sm:px-16 pt-2">
      <div
        className="w-full h-full flex flex-col-reverse sm:flex-row relative
     bg-blue-100 shadow-sm rounded-md border "
      >
        <List />
        <Map />
      </div>
    </div>
  );
}

const center = {
  lat: 39.722688919736584,
  lng: -104.96915769270834,
};

function List() {
  return (
    <div className="w-1/2 p-6">
      <strong>List Item</strong>
      <ul>
        <li className="text-red-500 p-2">Red</li>
        <li className="text-blue-500 p-2">Gree</li>
        <li className="text-yellow-500 p-2">Red</li>
        <li className="text-brown-500 p-2">Red</li>
      </ul>
    </div>
  );
}

function Map() {
  const mapStyles = { width: "100%", height: "10vh" };

  useEffect(() => {
    fetchAirtableRecords()
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
      .finally(() => console.log("finally"));
  }, []);

  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="w-full h-[60dvh] sm:h-[96dvh]">
      <Marker position={center} />
    </GoogleMap>
  );
}
