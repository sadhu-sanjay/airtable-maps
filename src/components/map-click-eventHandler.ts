/**
 * This class is responsible for handling click events on the google map.
 */
export class MapClickEventHandler {
  origin?: google.maps.LatLng;
  map: google.maps.Map;
  placesService: google.maps.places.PlacesService | undefined;
  onPlaceChanged: (
    place: google.maps.places.Place | google.maps.places.PlaceResult
  ) => void;

  constructor(
    map: google.maps.Map,
    origin: google.maps.LatLng,
    setPlace: (
      place: google.maps.places.Place | google.maps.places.PlaceResult
    ) => void
  ) {
    this.origin = origin;
    this.map = map;
    this.map.addListener("click", this.handleClick);
    google.maps.event.addListenerOnce(map, "tilesloaded", () => {
      this.placesService = new google.maps.places.PlacesService(map);
    });
    this.onPlaceChanged = setPlace;
  }

  isIconMouseEvent(
    event: google.maps.MapMouseEvent | google.maps.IconMouseEvent
  ): event is google.maps.IconMouseEvent {
    return "placeId" in event;
  }

  handleClick = (
    event: google.maps.MapMouseEvent | google.maps.IconMouseEvent
  ) => {
    if (this.isIconMouseEvent(event) && event.placeId) {
      event.stop();

      this.placesService?.getDetails(
        { placeId: event.placeId },
        (place, status) => {
          if (!place) return console.error("Place not found");
          this.onPlaceChanged(place);
        }
      );
    }
  };
}
