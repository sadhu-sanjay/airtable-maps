import { PLACE_DATA_FIELDS} from "@googlemaps/extended-component-library/place_picker.js";

export const placeDetails = (placeId: string) =>{
    
    return new Promise((resolve, reject) => {
        const request = {
            placeId,
            // get all fields 
            fields: PLACE_DATA_FIELDS
        };
        const service = new google.maps.places.PlacesService(document.createElement("div"));
        service.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
            } else {
                reject(status);
            }
        });
    });
}
