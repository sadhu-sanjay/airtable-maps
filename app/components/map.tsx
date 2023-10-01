import {
  MarkerClusterer,
  SuperClusterViewportAlgorithm,
} from "@googlemaps/markerclusterer";
import { memo, useCallback, useEffect, useRef } from "react";
import { Record } from "~/app/components/types";
const zoom_out_img = "/zoom-out-area.png";

function MyMap({
  records,
  handleZoom,
  onMarkerClick,
}: {
  records?: Record[];
  handleZoom: (record: Record[]) => void;
  onMarkerClick: (record: Record) => void;
}) {
  console.log("MAP RENDERED");
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const controlRef = useRef<HTMLDivElement | null>(null);
  const clusterRef = useRef<MarkerClusterer | null>(null);
  const record_to_marker_map = useRef<
    Map<Record, google.maps.marker.AdvancedMarkerElement>
  >(new Map());

  /**
   * SETUP MARKERS
   */

  const updateBounds = useCallback(() => {
    if (mapRef.current && records && records.length > 0) {
    }
  }, [records]);

  useEffect(() => {
    records?.forEach((record) => {
      if (!record.fields.lat || !record.fields.lng) return;
      if (record_to_marker_map.current.has(record)) return;
      const marker = MyMarker({ record, onMarkerClick });
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

    if (clusterRef.current) {
      setTimeout(() => {
        clusterRef.current?.removeMarkers(markersToRemove);
        clusterRef.current?.addMarkers(markersToAdd);

        const bounds = new google.maps.LatLngBounds();

        records?.forEach((record) => {
          if (!record.fields.lat || !record.fields.lng) return;
          const latLng = new window.google.maps.LatLng(
            record.fields.lat,
            record.fields.lng
          );
          bounds.extend(latLng);
        });
        mapRef.current?.fitBounds(bounds, 50);

        if (records?.length === 1) {
          mapRef.current?.setZoom(13);
        }
      }, 0);
    }

    return () => {
      markersToAdd.length = 0;
      markersToRemove.length = 0;
    };
  }, [onMarkerClick, records, updateBounds]);

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

    if (mapRef.current) {
      const controlDiv = document.createElement("div");
      const controlUI = document.createElement("div");
      const controlImg = document.createElement("img");

      controlDiv.appendChild(controlUI);
      // controlUI.appendChild(controlText);
      controlUI.appendChild(controlImg);

      controlUI.style.backgroundColor = "#fff";
      controlUI.style.border = "2px solid #fff";
      controlUI.style.borderRadius = "3px";
      controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlUI.style.cursor = "pointer";
      controlUI.style.marginLeft = "10px";
      controlUI.style.textAlign = "center";
      controlUI.title = "Zoom out completely";
      controlImg.src = zoom_out_img;
      controlImg.style.width = "36px";
      controlImg.style.height = "36px";

      controlUI.addEventListener("click", () => {
        mapRef.current?.setZoom(2);
      });

      mapRef.current.controls[
        window.google.maps.ControlPosition.LEFT_CENTER
      ].push(controlDiv);

      controlRef.current = controlDiv;
    }

    clusterRef.current = new MarkerClusterer({
      markers: Array.from(record_to_marker_map.current.values()),
      map: mapRef.current,
      algorithm: new SuperClusterViewportAlgorithm({
        viewportPadding: 0,
      }),
    });

    return () => {
      // this happens when the component unmounts so clear and clean up
      mapRef.current = null;
      clusterRef.current = null;
      controlRef.current = null;
      record_to_marker_map.current = new Map();
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

  // useEffect(() => {
  //   if (selectedRecord && mapRef.current) {
  //     const { lat, lng } = selectedRecord.fields;
  //     if (!lat || !lng) {
  //       return alert("No coordinates found for this record");
  //     }
  //     setTimeout(() => {
  //       mapRef.current?.setZoom(18); // ADDED THIS
  //       mapRef.current?.panTo({ lat, lng });
  //     }, 0);
  //   }
  // }, [selectedRecord]);

  return (
    <>
      {/* <button
        type="button"
        className="absolute top-0 left- text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br  shadow-sm shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-sm text-sm px-5 py-2.5 text-center"
      >
        Zoom
      </button> */}
      <div ref={divRef} className="h-full w-full"></div>
    </>
  );
}

export default memo(MyMap);

interface MyMarkerProps {
  record: Record;
  onMarkerClick: (record: Record) => void;
}

function MyMarker({ record, onMarkerClick }: MyMarkerProps) {
  if (!record.fields.lat || !record.fields.lng) return null;

  const markerElement = document.createElement("div");
  markerElement.innerText = record.fields.Title;
  markerElement.className = "price-tag";

  const marker = new window.google.maps.marker.AdvancedMarkerElement({
    position: { lat: record.fields.lat, lng: record.fields.lng },
    title: record.fields.Title,
    content: markerElement,
  });

  marker.addListener("click", () => {
    console.log("MARKER CLICKED", record);
    onMarkerClick(record);
  });

  return marker;
}
