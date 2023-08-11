"use client";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";
import { useMemo } from "react";

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
  const mapStyles = {width: '100%', height: '10vh'}

  return (
    <GoogleMap 
    zoom={10} 
    center={center} 
    mapContainerClassName='map-container'
    >
      <Marker position={center} />
    </GoogleMap>
  );
}
