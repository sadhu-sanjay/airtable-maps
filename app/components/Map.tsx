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

  return <Map />;
}

const center = {
  lat: 39.722688919736584,
  lng: -104.96915769270834,
};

function Map() {
  // const center = useMemo(() => {center}, [])
  const mapStyles = { width: "100%", height: "10vh" };

  useEffect(() => {

    fetchAirtableRecords()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
    .finally(() => console.log("finally"))

    

  }, []);

  return (
    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
      <Marker position={center} />
    </GoogleMap>
  );
}
