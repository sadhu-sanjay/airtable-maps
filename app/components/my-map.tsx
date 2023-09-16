import { useEffect, useRef } from "react";
import { Record } from "~/app/components/types";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export function MyMap({
  center,
  zoom,
  filteredRecords,
  selectedRecord,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  filteredRecords?: Record[];
  selectedRecord: Record | undefined;
}) {
  const mapRef = useRef<google.maps.Map>();
  const divRef = useRef<HTMLDivElement>(null);


  /*

   * It will create a new google map and store it in the mapRef
   * It will also set the center and zoom of the map
   * It will also add a listener to the map that will update the center and zoom state when the user changes the map
   */
  useEffect(() => {
    if (divRef.current) {
      mapRef.current = new window.google.maps.Map(divRef.current, {
        center,
        zoom,
      });
    }
  }, []);

  /**
   * It will create a new bounds object and extend it with the lat/lng of each record
   * This effect will run every time the filteredRecords changes
   */
  useEffect(() => {
    if (mapRef.current && filteredRecords && filteredRecords.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      filteredRecords.forEach((record) => {
        if (!record.lat || !record.lng) return;
        const latLng = new window.google.maps.LatLng(record.lat, record.lng);
        bounds.extend(latLng);
      });
      mapRef.current.fitBounds(bounds);

      if (filteredRecords.length === 1) {
        mapRef.current.setZoom(13);
      }
    }
  }, [filteredRecords]);

  useEffect(() => {
    if (selectedRecord && mapRef.current) {

      const { lat, lng } = selectedRecord;
      if (!lat || !lng) {
        return alert("No coordinates found for this record");
      }
      mapRef.current.setZoom(10); // ADDED THIS
      mapRef.current.panTo(new google.maps.LatLng(lat, lng));
    }
  }, [selectedRecord]);


  const markers: google.maps.Marker[] = filteredRecords
    ?.map((record: Record) => MyMarker(record, mapRef.current!))
    .filter(Boolean) as google.maps.Marker[];

  /*
   * This effect will run every time the filteredRecords changes
   * it will rerender the cluster on the map
   */
  useEffect(() => {
    const mc = new MarkerClusterer({
      markers: markers,
      map: mapRef.current,
    });

    return () => {
      mc.clearMarkers();
    };
  }, [markers]);

  return <div ref={divRef} className="h-full w-full bg-red-900 overflow-clip"></div>;
}

interface MyMarkerProps {
  record: Record;
  map: google.maps.Map;
}

function MyMarker(record: Record, map: google.maps.Map) {
  if (!record.lat || !record.lng) return null;
  const icon = "./marker-icon2.png";

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(record.lat, record.lng),
    title: record.Title,
    icon: {
      url: icon,
      scaledSize: new google.maps.Size(32, 32),
    },
    animation: google.maps.Animation.DROP,
  });

  return marker;
}
