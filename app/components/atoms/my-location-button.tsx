import { useEffect, useRef, useState } from "react";
import { ICON_FIND_LOCATION, ICON_MY_LOCATION } from "~/app/CONST";

export const MyLocationButton = (
  mapRef: React.MutableRefObject<google.maps.Map | null>
) => {
  // const { isGeolocationAvailable, isGeolocationEnabled, coords } =
  //   usePosition();
  const controlDiv = document.createElement("button");
  const controlUI = document.createElement("div");
  const controlImg = document.createElement("img");

  controlDiv.appendChild(controlUI);
  controlUI.appendChild(controlImg);

  controlUI.style.backgroundColor = "#fff";
  controlUI.addEventListener("mouseenter", () => {
    controlUI.style.backgroundColor = "#eee";
  });
  controlUI.addEventListener("mouseleave", () => {
    controlUI.style.backgroundColor = "#fff";
  });
  controlUI.style.border = "2px solid #fff";
  controlUI.style.borderRadius = "3px";
  controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  controlUI.style.cursor = "pointer";
  controlUI.style.marginLeft = "10px";
  controlUI.style.marginBottom = "10px";
  controlUI.style.textAlign = "center";
  controlUI.title = "Zoom out completely";
  controlImg.src = ICON_FIND_LOCATION;
  controlUI.style.width = "40px";
  controlUI.style.height = "40px";
  controlUI.style.display = "flex";
  controlUI.style.justifyContent = "center";
  controlUI.style.alignItems = "center";
  controlImg.style.width = "28px";
  controlImg.style.height = "28px";

  let dirtyFlag = false; // a flag to prevent multiple my location markers

  controlDiv.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          zoomToCenter(pos);

          if (!dirtyFlag) {
            addMarker(pos);
            dirtyFlag = true;
          }
        },
        () => {
          console.log("Error: The Geolocation service failed.");
        }
      );
    } else {
      console.log("Error: Your browser doesn't support geolocation.");
    }
  });

  const zoomToCenter = (pos: any) => {
    mapRef.current?.setCenter(pos);
    mapRef.current?.setZoom(18);
  };

  const addMarker = (pos: any) => {
    const markerElement = document.createElement("img");
    markerElement.src = ICON_MY_LOCATION;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: pos,
      content: markerElement,
      title: "My Location",
      map: mapRef.current,
    });
  };

  return controlDiv;
};

function usePosition(): {
  isGeolocationAvailable: any;
  isGeolocationEnabled: any;
  coords: any;
} {
  const [coords, setCoords] = useState<any>();
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false);
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);

  const onChange = ({ coords }: { coords: any }) => {
    setCoords({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  const onError = (error: any) => {
    console.log(error);
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      console.log("Geolocation is not supported");
      return;
    }

    setIsGeolocationAvailable(true);

    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);

  return {
    isGeolocationAvailable,
    isGeolocationEnabled,
    coords,
  };
}

// Test implementation

function TestMap() {
  const mapRef = useRef<google.maps.Map | null>(null);

  return <div></div>;
}
