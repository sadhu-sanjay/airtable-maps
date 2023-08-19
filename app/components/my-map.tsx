import { useEffect, useRef } from "react";
import { Record } from "~/app/components/types";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { clusterThreshHold } from "~/app/config";

export function MyMap({
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

  /*
   * This effect will run once when the component mounts
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
  }, [center, zoom]);

  /**
   * It will create a new bounds object and extend it with the lat/lng of each record
   * This effect will run every time the filteredRecords changes
   */
  useEffect(() => {
    if (mapRef.current && filteredRecords ) {
      const bounds = new google.maps.LatLngBounds();

      filteredRecords.forEach((record) => {
        if (!record.fields.lat || !record.fields.lng) return;
        const latLng = new window.google.maps.LatLng(
          record.fields.lat,
          record.fields.lng
        );
        bounds.extend(latLng);
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [filteredRecords]);

  // useEffect(() => {
  //   if (selectedRecord && mapRef.current) {
  //     if (!selectedRecord.fields["Coordinates (lat, lng)"]) {
  //       alert("No coordinates found for this record");
  //       return;
  //     }

  //     const [lat, lng] = selectedRecord.fields["Coordinates (lat, lng)"]
  //       .split(",")
  //       .map(parseFloat);
  //     mapRef.current.setZoom(8); // ADDED THIS
  //     mapRef.current.panTo(new google.maps.LatLng(lat, lng));
  //   }
  // }, [selectedRecord]);

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

  return <div ref={divRef} className="w-full h-[50dvh] sm:h-[85dvh]"></div>;
}

interface MyMarkerProps {
  record: Record;
  map: google.maps.Map;
}

function MyMarker(record: Record, map: google.maps.Map) {
  if (!record.fields.lat || !record.fields.lng) return null;
  const icon = "./marker-icon3.png";

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

  return marker;
}
