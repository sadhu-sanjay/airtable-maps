import {
  MarkerClusterer,
  SuperClusterAlgorithm,
  SuperClusterViewportAlgorithm,
} from "@googlemaps/markerclusterer";
import {
  startTransition,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  console.log("MAP RENDERED");
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const clusterRef = useRef<MarkerClusterer | null>(null);
  const record_to_marker_map = useRef<
    Map<Record, google.maps.marker.AdvancedMarkerElement>
  >(new Map());

  /**
   * SETUP MARKERS
   */

  function updateMarkers() {
    // only Create Marker that are not already created. and only add those markers to the cluster
    // which are not already added to the cluster
    console.time("SETUP MARKERS");
    records?.forEach((record) => {
      if (!record.lat || !record.lng) return;
      if (record_to_marker_map.current.has(record)) return;
      const marker = MyMarker(record);
      if (!marker) return;
      record_to_marker_map.current.set(record, marker);
    });

    const markersToAdd: google.maps.marker.AdvancedMarkerElement[] = [];
    const markersToRemove: google.maps.marker.AdvancedMarkerElement[] = [];

    record_to_marker_map.current.forEach((marker, record) => {
      if (!records?.includes(record)) {
        markersToRemove.push(marker);
      } else {
        markersToAdd.push(marker);
      }
    });

    setTimeout(() => {
      clusterRef.current?.removeMarkers(markersToRemove);
      clusterRef.current?.addMarkers(markersToAdd);
    }, 0);

    // Adjust the bounds on receiving new new records
    if (mapRef.current && records && records.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      records.forEach((record) => {
        if (!record.lat || !record.lng) return;
        const latLng = new window.google.maps.LatLng(record.lat, record.lng);
        bounds.extend(latLng);
      });
      mapRef.current.fitBounds(bounds);

      if (records.length === 1) {
        mapRef.current.setZoom(13);
      }
    }

    console.timeEnd("SETUP MARKERS");
  }
  updateMarkers();
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
      minZoom: 2,
    });

    clusterRef.current = new MarkerClusterer({
      markers: markersRef.current,
      map: mapRef.current,
      // algorithm: new SuperClusterAlgorithm({radius: 200}),
      algorithm: new SuperClusterViewportAlgorithm({
        viewportPadding: 0,
      }),
    });

    return () => {
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);
  /**
   * INITILIZE MAP && CLUSTER END
   * */

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

  return <div ref={divRef} className="h-full w-full overflow-clip" />;
}

interface MyMarkerProps {
  record: Record;
  map: google.maps.Map;
}

function MyMarker(record: Record) {
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
