import {
  MarkerClusterer,
  SuperClusterAlgorithm,
  SuperClusterViewportAlgorithm,
} from "@googlemaps/markerclusterer";
import { memo, use, useEffect, useRef, useState } from "react";
import { Record } from "~/app/components/types";
import { SpinnerWithoutBackground } from "./spinner";
import { SERVER_URL } from "../config";
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
          if (!record.fields.lat || !record.fields.lng) continue;
          const marker = markerMap.current.get(record.id);
          if (marker) {
            newMarkers.push(marker);
          } else {
            const marker = Marker(record);
            markerMap.current.set(record.id, marker);
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
  }, [records, flag]);

  useEffect(() => {
    if (!divRef.current || mapRef.current) return; // return if container is not there or map is already initialized
    mapRef.current = new window.google.maps.Map(divRef.current, {
      center: { lat: 40.710553322002546, lng: -74.0085778809653 },
      zoom: 2,
      minZoom: 1,
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

  return (
    <div className="relative h-full w-full">
      {isLoading && <SpinnerWithoutBackground className="z-50" />}
      <div ref={divRef} className="h-full w-full" />
    </div>
  );
}

export default memo(MyMap);

function Marker(record: Record) {
  const title = record.fields.Title ?? "";
  const markerDiv = document.createElement("div");
  markerDiv.classList.add("marker");

  const imgDiv = document.createElement("img");
  imgDiv.classList.add("marker-img");
  imgDiv.src = markerImage(title);

  // Create a new div for the title
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("marker-title");
  titleDiv.innerText = title + " " + markerCategory(record.fields.Tags);

  markerDiv.appendChild(imgDiv);
  markerDiv.appendChild(titleDiv);  // Append the title div to the marker div

  const marker = new window.google.maps.marker.AdvancedMarkerElement({
    position: { lat: record.fields.lat, lng: record.fields.lng },
    content: markerDiv,
  });

  return marker;
}


function markerImage(title: string): string {
  const fileName = title
    .replace(/\s/g, "")
    .toLowerCase()
    .replace(/[^a-zA-Z ]/g, "");
  const imgUrl = SERVER_URL + "/images" + "/" + fileName + ".jpeg";
  return imgUrl;
}

function markerCategory(tags: string[]): string {
  
  if (!tags) return "";

  // turn array of tags into a string and remove whitespace and commas
  const tagsString = tags.join(",").replace(/\s/g, "").replace(/,/g, "");

  if (tagsString.includes("Camping")) {
    return "🏕️";
  } else if (tagsString.includes("Hotel")) {
    return "🏨";
  } else if (tagsString.includes("Swimming")) {
    return "🏊";
  } else if (tagsString.includes("ToTry")) {
    return "🎯";
  } else if (tagsString.includes("Art")) {
    return "🎨";
  } else if (tagsString.includes("Food")) {
    return "🍔";
  } else if (tagsString.includes("Hiking")) {
    return "🥾";
  } else if (tagsString.includes("Nature")) {
    return "🌳";
  } else if (tagsString.includes("Shopping")) {
    return "🛍️";
  } else if (tagsString.includes("Sightseeing")) {
    return "🏛️";
  } else if (tagsString.includes("Sports")) {
    return "🏀";
  } else if (tagsString.includes("Drive")) {
    return "🚗";
  } else if (tagsString.includes("Culture")) {
    return "🎭";
  } else if (tagsString.includes("History")) {
    return "📜";
  } else if (tagsString.includes("Relax")) {
    return "🧘";
  } else if (tagsString.includes("Beach")) {
    return "🏖️";
  } else if (tagsString.includes("Nightlife")) {
    return "🍻";
  } else if (tagsString.includes("Music")) {
    return "🎵";
  } else if (tagsString.includes("Architecture")) {
    return "🏛️";
  } else if (tagsString.includes("Museum")) {
    return "🏛️";
  } else if (tagsString.includes("Park")) {
    return "🌳";
  } else if (tagsString.includes("Zoo")) {
    return "🐘";
  } else if (tagsString.includes("Aquarium")) {
    return "🐠";
  } else if (tagsString.includes("Bar")) {
    return "🍻";
  } else if (tagsString.includes("Activities")) {
    return "🏄";
  } else if (tagsString.includes("Restaurant")) {
    return "🍔";
  } else {
    return "🎲";
  }
}
