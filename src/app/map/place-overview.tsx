import { IconLocation } from "~/components/resources/icons/icon-location";
import dynamic from "next/dynamic";
import { PlaceFieldLink } from "@googlemaps/extended-component-library/react";
const PlaceOverview = dynamic(
  () =>
    import("@googlemaps/extended-component-library/react").then(
      (mod) => mod.PlaceOverview
    ),
  { ssr: false }
);
const PlacePicker = dynamic(
  () =>
    import("@googlemaps/extended-component-library/react").then(
      (mod) => mod.PlacePicker
    ),
  { ssr: false }
);
const IconButton = dynamic(
  () =>
    import("@googlemaps/extended-component-library/react").then(
      (mod) => mod.IconButton
    ),
  { ssr: false }
);
const PlaceDirectionsButton = dynamic(
  () =>
    import("@googlemaps/extended-component-library/react").then(
      (mod) => mod.PlaceDirectionsButton
    ),
  { ssr: false }
);

type PlaceOverviewProps = {
  place?: google.maps.places.Place | undefined;
  setPlace: (place?: google.maps.places.Place) => void;
  coords: google.maps.LatLng;
  onPlaceSave: () => void;
};

export const GooglePlaceOverview = ({ place, setPlace, coords, onPlaceSave }: PlaceOverviewProps) => (
  <>
    <div className="bg-gray-100 w-full p-2 sticky top-0 shadow-lg ">
      <div className="flex items-center mb-1 rounded-full">
        <IconLocation stroke="black" />
        <h1 className=" text-md font-md p-2 text-gray-800">
          {" "}
          Find a location to visit{" "}
        </h1>
      </div>
      <PlacePicker
        onPlaceChange={(e: Event) => {
          const target = e.target;
          // @ts-ignore
          const value = target?.value;
          if (value) {
            setPlace(value);
          }
        }}
        placeholder="Search Google Maps"
        className="w-full "
      />
    </div>
    <PlaceOverview
      size="x-large"
      place={place}
      // place="ChIJbf8C1yFxdDkR3n12P4DkKt0"
      travelOrigin={coords}
      googleLogoAlreadyDisplayed
      onRequestError={(e) => {
        console.error(e);
      }}
      className="relative"
    >
      <IconButton
        slot="action"
        variant="filled"
        onClick={() => setPlace(undefined)}
        className="ml-auto absolute top-3 right-2"
      >
        close
      </IconButton>
      <div slot="action" className="w-full flex flex-row gap-2 ">
        <IconButton onClick={onPlaceSave} icon="note_add">
          Airtable
        </IconButton>
        <PlaceDirectionsButton>Directions</PlaceDirectionsButton>

        <PlaceFieldLink hrefField="googleMapsURI" className=" no-underline">
          <IconButton icon="open_in_new">Google Maps</IconButton>
        </PlaceFieldLink>
      </div>
    </PlaceOverview>
  </>
);
