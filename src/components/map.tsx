import {
  MarkerClusterer,
  SuperClusterViewportAlgorithm,
} from "@googlemaps/markerclusterer";
import { memo, useEffect, useRef, useState } from "react";
import { Record } from "~/components/models/types";
import { SpinnerWithoutBackground } from "./spinner";
import Marker from "./Marker";
import { RECORDS_THRESHHOLD } from "../config";
import { ZoomOutButton } from "./atoms/zoom-out-button";
import { ShareButton } from "./atoms/share-button";
import { MyLocationButton } from "./atoms/my-location-button";
import { toast } from "sonner";
import { DEFAULT_LOCATION } from "~/CONST";
import { MapClickEventHandler } from "./map-click-eventHandler";
type AdvancedMarker = google.maps.marker.AdvancedMarkerElement;

function MyMap({
  records,
  handleZoom,
  onRecordSelected,
  setPlace,
  place,
}: {
  records?: Record[];
  handleZoom: (record: Record[]) => void;
  onRecordSelected: (recordId: string) => void;
  setPlace: (place: google.maps.places.Place) => void;
  place?: google.maps.places.Place;
}) {
  console.log("MAP RENDERED");
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const clusterRef = useRef<MarkerClusterer | null>(null);
  const markerMap = useRef<Map<string, AdvancedMarker>>(new Map());
  const clusterMap = useRef<Map<string, google.maps.LatLng>>(new Map());
  const mapClickEventHandler = useRef<MapClickEventHandler | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const DEFAULT_ZOOM_WITH_LOCATION = 16;

  const updateBounds = () => {
    const bounds = new google.maps.LatLngBounds();
    clusterMap.current.forEach((latLng) => {
      bounds.extend(latLng);
    });

    if (bounds.isEmpty()) return;
    mapRef.current!.fitBounds(bounds);
  };

  /**
   * run when place changes and create a marker on the map at the place
   **/
  useEffect(() => {
    if (!place || !mapRef.current || !place.location) return;
    const marker = new google.maps.Marker({
      map: mapRef.current,
      position: place.location
    });
    mapRef.current.setCenter(place.location);
    mapRef.current.setZoom(12);

    return () => {
      marker.setMap(null);
    };
  }
  , [place]);
  

  useEffect(() => {
    if (!flag || !records) return;

    console.log("RECORDS CHANGED");
    setIsLoading(true);

    const createMarker = async () => {
      await new Promise((resolve) => {
        const markersToAdd: AdvancedMarker[] = [];
        const markersToRemove: AdvancedMarker[] = [];

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          if (!record.lat || !record.lng) continue;

          let marker = markerMap.current.get(record.RecordKey);
          if (!marker) {
            marker = Marker(record, true);
            marker.addListener("click", () => {
              onRecordSelected(record.RecordKey);
            });
            markerMap.current.set(record.RecordKey, marker);
          }

          if (clusterMap.current.get(record.RecordKey)) continue; // skip it if in cluster

          markersToAdd.push(marker);
          clusterMap.current.set(
            record.RecordKey,
            new google.maps.LatLng(marker.position!)
          );
        }

        clusterRef.current?.addMarkers(markersToAdd); // add new markers to cluster

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
      clusterMap.current.clear();
      clusterRef.current!.clearMarkers();
    };
  }, [records, flag, onRecordSelected]);

  /**
   * Initialize the map and the cluster
   **/
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
        maxZoom: 14,
        viewportPadding: -20,
      }),
    });

    const zoomOutbutton = ZoomOutButton(() => mapRef.current?.setZoom(2));
    const myLocationButton = MyLocationButton(mapRef);
    const shareButton = ShareButton(() => {
      const shareableLink = window.location.href;
      navigator.clipboard
        .writeText(shareableLink)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy link to clipboard!");
        });
    });

    mapRef.current.controls[
      window.google.maps.ControlPosition.LEFT_BOTTOM
    ].push(zoomOutbutton);

    mapRef.current.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
      shareButton
    );

    mapRef.current.controls[
      window.google.maps.ControlPosition.LEFT_BOTTOM
    ].push(myLocationButton);

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
          const latLng = new google.maps.LatLng(record.lat, record.lng);
          return bounds?.contains(latLng);
        });
        handleZoom(recordsInViewport || []);
      });

      if (!mapClickEventHandler.current) {
        mapClickEventHandler.current = new MapClickEventHandler(
          mapRef.current,
          new google.maps.LatLng(DEFAULT_LOCATION),
          setPlace
        );
      }

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
