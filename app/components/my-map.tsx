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
  const mapRef = useRef<google.maps.Map>();
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clusterRef = useRef<MarkerClusterer | null>(null);

  markersRef.current = records
    ?.map((record: Record) => MyMarker(record, mapRef.current!))
    .filter(Boolean) as google.maps.Marker[];

  // Clear the existing cluster and create a new one with updated markers
  if (clusterRef.current) {
    clusterRef.current.clearMarkers();
    clusterRef.current.addMarkers(markersRef.current);
  }
  /**
   * Initialize the map , markerRef and clusterRef in one useEffect
   * */
  useEffect(() => {
    // initialize the map
    mapRef.current = new window.google.maps.Map(divRef.current!, {
      center: { lat: 43.21, lng: -74.11},
      zoom: 2,
    });

    // initialize the clusterer
    clusterRef.current = new MarkerClusterer({
      markers: markersRef.current,
      map: mapRef.current,
    });
  }, []);

  /**
   * Set up the map bounds to fit all the markers
   * */

  /**
   * INITIALIZE THE MAP
   */

  /**

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

  // useEffect(() => {
  //   if (selectedRecord && mapRef.current) {
  //     const { lat, lng } = selectedRecord;
  //     if (!lat || !lng) {
  //       return alert("No coordinates found for this record");
  //     }
  //     mapRef.current.setZoom(10); // ADDED THIS
  //     mapRef.current.panTo(new google.maps.LatLng(lat, lng));
  //   }
  // }, [selectedRecord]);

  /**
   * MARKER CLUSTERING
   */

  /*
   * This effect will run every time the records changes
   * it will rerender the cluster on the map
   */
  console.log("MAPS RENDER");
  // useEffect(() => {

  //   // myDebounce(() => {
  //     // clusterRef.current?.addMarkers(markersRef.current);
  //   // }, 1000)

  //   console.timeLog()

  //   return () => {
  //     clusterRef.current?.clearMarkers();
  //   };
  // }, [records]);
  /**
   * MARKER CLUSTERING END
   */

  return <div ref={divRef} className="h-full w-full overflow-clip"></div>;
}

interface MyMarkerProps {
  record: Record;
  map: google.maps.Map;
}

function MyMarker(record: Record, map: google.maps.Map) {
  if (!record.lat || !record.lng) return null;

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(record.lat, record.lng),
    title: record.Title,
    icon: {
      url: icon,
      scaledSize: new google.maps.Size(32, 32),
    },
    // animation: google.maps.Animation.DROP,
  });

  return marker;
}
