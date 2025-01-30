import { BurgerIcon } from "~/components/resources/icons/burger-icon";
import dynamic from "next/dynamic";

const PlaceFieldLink = dynamic(
  () =>
    import("@googlemaps/extended-component-library/react").then(
      (mod) => mod.PlaceFieldLink
    ),
  { ssr: false }
);
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

export const GooglePlaceOverview = ({
  place,
  setPlace,
  coords,
  onPlaceSave,
}: PlaceOverviewProps) => (
  <>
    <div className="bg-gray-100 w-full p-2 sm:p-0 sticky top-0 shadow-lg ">
      <div className="flex p-2 gap-4 items-center rounded-full">
        <button className=" sm:hidden border-1">
          <BurgerIcon height={24} stroke="black" />
        </button>

        <PlacePicker
          onPlaceChange={(e: Event) => {
            const target = e.target;
            // @ts-ignore
            const value = target?.value;
            if (value) {
              setPlace(value);
            }
          }}
          placeholder="Find a Place on Google "
          className="w-full "
        />
      </div>
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
