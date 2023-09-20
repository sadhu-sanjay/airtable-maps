import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { startTransition, useEffect, useRef } from "react";
import { Record } from "~/app/components/types";
import { myDebounce } from "./utility/utilityFunctions";
const icon = "./marker-icon2.png";

export function MyMap({
  records,
  selectedRecord,
}: {
  records?: Record[];
  selectedRecord: Record | undefined;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const clusterRef = useRef<MarkerClusterer | null>(null);

  markersRef.current = records
    ?.map((record: Record) => MyMarker(record, mapRef.current!))
    .filter(Boolean) as google.maps.marker.AdvancedMarkerElement[];

  // Clear the existing cluster and create a new one with updated markers
  if (clusterRef.current) {
    clusterRef.current.clearMarkers();
    clusterRef.current?.addMarkers(markersRef.current);
  }
  
  /**
   * Initialize the map , markerRef and clusterRef in one useEffect
   * */
  useEffect(() => {
    mapRef.current = new window.google.maps.Map(divRef.current!, {
      center: { lat: 43.21, lng: -74.11 },
      zoom: 2,
      minZoom: 2,
    });

    clusterRef.current = new MarkerClusterer({
      markers: markersRef.current,
      map: mapRef.current,
    });

    return () => {
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  /**
   * Adjust the bounds on receiving new new records
   */
  // useEffect(() => {
  //   if (mapRef.current && records && records.length > 0) {
  //     const bounds = new google.maps.LatLngBounds();

  //     records.forEach((record) => {
  //       if (!record.lat || !record.lng) return;
  //       const latLng = new window.google.maps.LatLng(record.lat, record.lng);
  //       bounds.extend(latLng);
  //     });
  //     mapRef.current.fitBounds(bounds);

  //     if (records.length === 1) {
  //       mapRef.current.setZoom(13);
  //     }
  //   }
  // }, [records]);

  useEffect(() => {
    if (selectedRecord && mapRef.current) {
      const { lat, lng } = selectedRecord;
      if (!lat || !lng) {
        return alert("No coordinates found for this record");
      }
      mapRef.current.setZoom(17); // ADDED THIS
      mapRef.current.panTo({ lat, lng });
    }
  }, [selectedRecord]);

  return <div ref={divRef} className="h-full w-full overflow-clip"></div>;
}

interface MyMarkerProps {
  record: Record;
  map: google.maps.Map;
}

function MyMarker(record: Record, map: google.maps.Map) {
  if (!record.lat || !record.lng) return null;

  const pin = new window.google.maps.marker.PinElement({
    borderColor: "white",
    background: "#ea580c",
    glyphColor: "white",
  });

  const marker = new window.google.maps.marker.AdvancedMarkerElement({
    position: { lat: record.lat, lng: record.lng },
    title: record.Title,
    content: pin.element,
  });

  return marker;
}
