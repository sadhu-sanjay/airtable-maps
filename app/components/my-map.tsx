import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { startTransition, use, useEffect, useRef } from "react";
import { Record } from "~/app/components/types";
import { isMarkerInBounds, myDebounce } from "./utility/utilityFunctions";
const icon = "./marker-icon2.png";

export function MyMap({
  records,
  selectedRecord,
}: {
  records?: Record[];
  selectedRecord: Record | undefined;
}) {

  console.log("MAP RENDERED")
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const clusterRef = useRef<MarkerClusterer | null>(null);

  /**
   * SETUP MARKERS
   */
  markersRef.current = records
    ?.map((record: Record) => MyMarker(record, mapRef.current!))
    .filter(Boolean) as google.maps.marker.AdvancedMarkerElement[];
  if (clusterRef.current) {
    clusterRef.current.clearMarkers();
    clusterRef.current?.addMarkers(markersRef.current);
  }
  /**
   * SETUP MARKERS END
   * */

  /**
   * INITILIZE MAP  && CLUSTER
   * */
  useEffect(() => {
    mapRef.current = new window.google.maps.Map(divRef.current!, {
      center: { lat: 43.21, lng: -74.11 },
      zoom: 2,
      mapId: "eb7b69cef73330bc",
      minZoom: 1,
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
   * INITILIZE MAP && CLUSTER END
   * */

  /**
   * CLUSTER MARKERS UPDATER ON BOUNDS CHANGE
   * */
  if (
    mapRef.current ||
    clusterRef.current ||
    (records && records?.length > 6000)
  ) {
    const boundsChangedHandler = myDebounce(() => {
      const bounds = mapRef.current?.getBounds();
      const markersToRemove: google.maps.marker.AdvancedMarkerElement[] = [];
      const markersToAdd: google.maps.marker.AdvancedMarkerElement[] = [];

      markersRef.current.forEach((marker) => {
        if (!isMarkerInBounds(marker, bounds)) {
          markersToRemove.push(marker);
        } else if (!marker.map) {
          markersToAdd.push(marker);
        }
      });

      setTimeout(() => {
        clusterRef.current?.removeMarkers(markersToRemove);
        clusterRef.current?.addMarkers(markersToAdd);
      }, 0);
    }, 1000);

    google.maps.event.clearListeners(mapRef.current || {}, "bounds_changed");
    google.maps.event.addListener(
      mapRef.current!,
      "bounds_changed",
      boundsChangedHandler
    );
  }

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
