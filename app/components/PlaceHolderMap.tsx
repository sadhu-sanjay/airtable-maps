"use client";
import { useRef, useEffect } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MAPS_API_KEY, RECORDS_FETCH_URL } from "~/app/config";

// a placeholder googlemaps which covers the entire screen
export default function PlaceHolderMap() {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <div> Loading</div>;
      case Status.FAILURE:
        return <div>Error Loading Map</div>;
      case Status.SUCCESS:
        return <TestMap />;
    }
  };

  return <Wrapper apiKey={MAPS_API_KEY} render={render} />;
}

function TestMap() {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map>();

  //Q: How do i add padding from left in this map?
  //A: Add a div with width 100vw and height 100dvh and add the map inside it.
  //   Then add a div with width 100vw and height 100dvh and add the map inside it.
  useEffect(() => {
    if (divRef.current) {
      mapRef.current = new google.maps.Map(divRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });
    }
  }, []);

  return <div ref={divRef} style={{ height: "100dvh", width: "100dvw" }} />;
}
