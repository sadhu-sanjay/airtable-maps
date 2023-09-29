import {
  MarkerClusterer,
  SuperClusterViewportAlgorithm,
} from "@googlemaps/markerclusterer";
import { memo, useEffect, useRef } from "react";
import { Record } from "~/app/components/types";

function MyMap({
  records,
  handleZoom,
  onMarkerClick
}: {
  records?: Record[];
  handleZoom: (record: Record[]) => void;
  onMarkerClick: (record: Record) => void;
}) {
  console.log("MAP RENDERED");
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const clusterRef = useRef<MarkerClusterer | null>(null);
  const record_to_marker_map = useRef<
    Map<Record, google.maps.marker.AdvancedMarkerElement>
  >(new Map());

  /**
   * SETUP MARKERS
   */

  function updateMarkers() {
    records?.forEach((record) => {
      if (!record.fields.lat || !record.fields.lng) return;
      if (record_to_marker_map.current.has(record)) return;
      const marker = MyMarker({record, onMarkerClick});
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

    // UPDATE UI AFTER 0ms so that the UI is not blocked
    setTimeout(() => {
      console.error("CLUSTER CURENT REF", clusterRef.current);
      console.error("CLUSTER REF", clusterRef);
      console.error("MARKERS TO REMOVE", markersToRemove.length);
      console.error("MARKERS TO ADD", markersToAdd.length);
      clusterRef.current?.removeMarkers(markersToRemove);
      clusterRef.current?.addMarkers(markersToAdd);
      updateBounds();
    }, 0);
  }

  function updateBounds() {
    if (mapRef.current && records && records.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      records.forEach((record) => {
        if (!record.fields.lat || !record.fields.lng) return;
        const latLng = new window.google.maps.LatLng(
          record.fields.lat,
          record.fields.lng
        );
        bounds.extend(latLng);
      });
      mapRef.current.fitBounds(bounds, 100);

      if (records.length === 1) {
        mapRef.current.setZoom(13);
      }
    }
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
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
    });

    clusterRef.current = new MarkerClusterer({
      markers: Array.from(record_to_marker_map.current.values()),
      map: mapRef.current,
      algorithm: new SuperClusterViewportAlgorithm({
        viewportPadding: 0,
      }),
    });


    // get place id when a place is clicked
    const listener = mapRef.current.addListener(
      "click",
      (event: google.maps.MapMouseEvent) => {
        console.log("MAP CLICKED", event);
        // if (event.placeId) {
        //   console.log("PLACE ID", event.placeId);
        // }
      }
    );

    return () => {
      mapRef.current = null;
      clusterRef.current = null;
    };
  }, []);
  /**
   * INITILIZE MAP && CLUSTER END
   * */

  /**
   * Initilize the listener for the cluster
   **/
  useEffect(() => {
    let initialIdle = true;
    if (mapRef.current) {
      const listener = mapRef.current.addListener("idle", () => {
        console.log("INITIAL IDLE");
        if (initialIdle) {
          initialIdle = false;
          return;
        }
        // Get Records which are in the current viewport
        const bounds = mapRef.current?.getBounds();
        const recordsInViewport = records?.filter((record) => {
          if (!record.fields.lat || !record.fields.lng) return false;
          const latLng = new google.maps.LatLng(
            record.fields.lat,
            record.fields.lng
          );
          return bounds?.contains(latLng);
        });
        console.log("RECORDS IN VIEWPORT", recordsInViewport?.length);
        handleZoom(recordsInViewport || []);
      });
      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [handleZoom, records]);

  return <div ref={divRef} className="h-full w-full overflow-clip" />;
}

export default memo(MyMap);

interface MyMarkerProps {
  record: Record;
  onMarkerClick: (record: Record) => void;
}

function MyMarker({ record, onMarkerClick }: MyMarkerProps) {
  if (!record.fields.lat || !record.fields.lng) return null;

  const pin = new window.google.maps.marker.PinElement({
    borderColor: "white",
    background: "#ea580c",
    glyphColor: "white",
  });

  const marker = new window.google.maps.marker.AdvancedMarkerElement({
    position: { lat: record.fields.lat, lng: record.fields.lng },
    title: record.fields.Title,
    content: pin.element,
  });
  marker.addListener("click", () => {
    console.log("MARKER CLICKED", record);
    onMarkerClick(record);
  })

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

// useEffect(() => {
//   if (selectedRecord && mapRef.current) {
//     const { lat, lng } = selectedRecord;
//     if (!lat || !lng) {
//       return alert("No coordinates found for this record");
//     }
//     mapRef.current.setZoom(18); // ADDED THIS
//     mapRef.current.panTo({ lat, lng });
//   }
// }, [selectedRecord]);
