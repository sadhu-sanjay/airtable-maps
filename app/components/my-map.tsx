import { useEffect, useRef } from "react";
import { Record } from "~/app/components/types";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { clusterThreshHold } from "~/app/config";

export function MyMap({
  center,
  zoom,
  filteredRecords,
  selectedRecord,
  records,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  filteredRecords?: Record[];
  selectedRecord: Record | null;
  records: Record[];
}) {
  const mapRef = useRef<google.maps.Map>();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && filteredRecords) {
      const bounds = new google.maps.LatLngBounds();
      filteredRecords.forEach((record) => {
        const latLng = new window.google.maps.LatLng(
          record.fields.lat,
          record.fields.lng
        );
        bounds.extend(latLng);
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [filteredRecords]);

  useEffect(() => {
    if (divRef.current) {
      mapRef.current = new window.google.maps.Map(divRef.current, {
        center,
        zoom,
      });
    }
  }, [center, zoom]);

  useEffect(() => {
    if (selectedRecord && mapRef.current) {
      // const [lat, lng] = selectedRecord.fields["Coordinates (lat, lng)"]
      //   .split(",")
      //   .map(parseFloat);
      mapRef.current.setZoom(8); // ADDED THIS
      mapRef.current.panTo(
        new google.maps.LatLng(
          selectedRecord.fields.lat,
          selectedRecord.fields.lng
        )
      );
    }
  }, [selectedRecord]);

  const markers = filteredRecords?.map((value) => {
    const latlong = value.fields["Coordinates (lat, lng)"].split(",");
    value.fields.lat = parseFloat(latlong[0]);
    value.fields.lng = parseFloat(latlong[1]);

    const marker = new google.maps.Marker({
      position: { lat: value.fields.lat, lng: value.fields.lng },
      icon: {
        url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        scaledSize: new google.maps.Size(20, 20),
      },
    });
    return marker;
  });

  useEffect(() => {
    console.log("Lenght", filteredRecords?.length);
    if (filteredRecords && filteredRecords.length < clusterThreshHold) return;

    const mc = new MarkerClusterer({
      markers,
      map: mapRef.current,
    });

    return () => {
      mc.clearMarkers();
    };
  }, [filteredRecords, markers]);

  return (
    <div ref={divRef} className="w-full h-[50dvh] sm:h-[85dvh]">
      {/* {mapRef.current &&
        filteredRecords &&
        filteredRecords?.length < clusterThreshHold &&
        filteredRecords?.map((record) => (
          <MyMarker key={record.id} map={mapRef.current!} record={record} />
        ))} */}
    </div>
  );
}

interface MyMarkerProps {
  record: Record;
  map: google.maps.Map;
}

function MyMarker({ record, map }: MyMarkerProps) {
  var iconBase = "https://maps.google.com/mapfiles/kml/shapes/";
  if (record.fields["Coordinates (lat, lng)"]) {
    const [lat, lng] = record.fields["Coordinates (lat, lng)"]
      .split(",")
      .map(parseFloat);
    record.fields.lat = lat;
    record.fields.lng = lng;
  }

  let category = record.fields.City;

  // var icons: { [key: string]: string } = {
  //   Hiking: iconBase + "hiker.png",
  //   Airport: iconBase + "volcano.png",
  //   Restaurant: iconBase + "coffee.png",
  //   Pub: iconBase + "bars.png",
  //   Lake: iconBase + "terrain.png",
  // };

  // const icon = icons[category];
  const icon = iconBase + "volcano.png";

  useEffect(() => {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(record.fields.lat, record.fields.lng),
      map,
      title: record.fields.Title,
      icon: {
        url: icon,
        scaledSize: new google.maps.Size(32, 32),
      },
      animation: google.maps.Animation.DROP,
    });

    return () => {
      marker.setMap(null); // this removes the marker
    };
  }, [record, map]);

  return null;
}
