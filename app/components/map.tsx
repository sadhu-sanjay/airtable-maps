import {
  MarkerClusterer,
  SuperClusterAlgorithm,
  SuperClusterViewportAlgorithm,
} from "@googlemaps/markerclusterer";
import { memo, use, useEffect, useRef, useState } from "react";
import { Record } from "~/app/components/types";
import { SpinnerWithoutBackground } from "./spinner";
import Marker from "./Marker";
const zoom_out_img = "/zoom-out-area.png";
type AdvancedMarker = google.maps.marker.AdvancedMarkerElement;

function MyMap({
  records,
  handleZoom,
  onRecordSelected,
}: {
  records?: Record[];
  handleZoom: (record: Record[]) => void;
  onRecordSelected: (recordId: string) => void;
}) {
  console.log("MAP RENDERED");
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const clusterRef = useRef<MarkerClusterer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const markerMap = useRef<Map<string, AdvancedMarker>>(new Map());

  const updateBounds = () => {
    const bounds = new google.maps.LatLngBounds();
    for (const marker of clusterRef.current!["markers"]) {
      // @ts-ignore
      bounds.extend(marker.position);
    }
    mapRef.current!.fitBounds(bounds);
  };

  useEffect(() => {
    if (!flag || !records) return;

    console.log("RECORDS CHANGED");
    setIsLoading(true);

    const createMarker = async () => {
      await new Promise((resolve) => {
        const newMarkers: AdvancedMarker[] = [];
        for (const record of records) {
          if (!record.lat || !record.lng) continue;
          const marker = markerMap.current.get(record.RecordKey);
          if (marker) {
            newMarkers.push(marker);
          } else {
            const marker = Marker(record);
            marker.addListener("click", () => {
              onRecordSelected(record.RecordKey);
            });

            markerMap.current.set(record.RecordKey, marker);
            newMarkers.push(marker);
          }
        }

        clusterRef.current!.addMarkers(newMarkers);
        return resolve(null);
      });
    };

    setTimeout(() => {
      createMarker().then(() => {
        setTimeout(() => {
          setIsLoading(false);
          updateBounds();
        }, 50);
      });
    }, 100);

    return () => {
      clusterRef.current!.clearMarkers();
    };
  }, [records, flag, onRecordSelected]);

  useEffect(() => {
    if (!divRef.current || mapRef.current) return; // return if container is not there or map is already initialized
    mapRef.current = new window.google.maps.Map(divRef.current, {
      center: { lat: 40.710553322002546, lng: -74.0085778809653 },
      zoom: 2,
      minZoom: 0,
      mapId: "eb7b69cef73330bc",
    });

    // return if map is not initialized yet or cluster is already initialized
    if (!mapRef.current || clusterRef.current) return;
    clusterRef.current = new MarkerClusterer({
      map: mapRef.current,
      markers: [],
      algorithm: new SuperClusterViewportAlgorithm({
        maxZoom: 8,
        viewportPadding: -20,
      }),
    });

    google.maps.event.addListenerOnce(mapRef.current!, "tilesloaded", () => {
      setFlag(true);
    });
  }, []);

  /**
   * Initilize the listener for the cluster
   **/
  useEffect(() => {
    let initialIdle = true;
    if (mapRef.current) {
      const listener = mapRef.current.addListener("idle", () => {
        if (initialIdle) {
          initialIdle = false;
          return;
        }
        // Get Records which are in the current viewport
        const bounds = mapRef.current?.getBounds();
        const recordsInViewport = records?.filter((record) => {
          if (!record.lat || !record.lng) return false;
          const latLng = new google.maps.LatLng(
            record.lat,
            record.lng
          );
          return bounds?.contains(latLng);
        });
        handleZoom(recordsInViewport || []);
      });
      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [handleZoom, records]);
  // SET UP LISTENER FOR ZOOM CHANGED

  return (
    <div className="relative h-full w-full">
      {isLoading && <SpinnerWithoutBackground className="z-50" />}
      <div ref={divRef} className="h-full w-full" />
    </div>
  );
}

export default memo(MyMap);
