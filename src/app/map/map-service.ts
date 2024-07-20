// import { PLACE_DATA_FIELDS} from "@googlemaps/extended-component-library/place_picker.js";

import { toast } from "sonner";
import { CREATE } from "~/airtable/route"

export const addToAirTable = async (place?: google.maps.places.Place | undefined ) => {

  console.log("Place", place);
  const toastId = toast.loading("Please wait");

  // Fetch Additional Detail Required
  await place?.fetchFields({
    fields: [
      "editorialSummary",
      "websiteURI",
      "internationalPhoneNumber",
      "addressComponents",
    ],
  });

  const country = place?.addressComponents?.find((each) =>
    each.types.includes("country")
  );

  const req = {
    body: {
      typecast: true,
      fields: {
        Title: place?.displayName,
        Tags: place?.types,
        Address: place?.formattedAddress,
        URL: place?.websiteURI,
        Description: place?.editorialSummary,
        GooglePlacesID: place?.id,
        Phone:
          place?.internationalPhoneNumber ?? place?.nationalPhoneNumber ?? "",
        Image: place?.photos
          ? place.photos.slice(0, 1).map((photo) => ({ url: photo.getURI() }))
          : [],
        Neighborhood: place?.addressComponents?.find((each) =>
          each.types.includes("neighborhood")
        )?.longText,
        City:
          place?.addressComponents?.find(
            (each) =>
              each.types.includes("locality") ||
              each.types.includes("sublocality")
          )?.longText ??
          place?.addressComponents?.find((each) =>
            each.types.includes("postal_town")
          )?.longText,
        Country: country?.longText,
        "Street Number": place?.addressComponents?.find((each) =>
          each.types.includes("street_number")
        )?.longText,
        Street: place?.addressComponents?.find((each) =>
          each.types.includes("route")
        )?.longText,
        "Recommended By": "travel.lbd.ventures",
        "State / AAL1": place?.addressComponents?.find((each) =>
          each.types.includes("administrative_area_level_1")
        )?.longText,
        "County / AAL2": place?.addressComponents?.find((each) =>
          each.types.includes("administrative_area_level_2")
        )?.longText,
        "Coordinates (lat, lng)": place?.location?.toUrlValue(),
        "Postal code": place?.addressComponents?.find((each) =>
          each.types.includes("postal_code")
        )?.longText,
        "Google Maps URL": place?.googleMapsURI,
      },
    },
  };

  const response = await CREATE(req); // create record in airtable
  toast.dismiss(toastId);

  if (response.id) {
    toast.success("Successfully Added Place to Airtable");
  } else if (response.error) {
    toast.error("Error Adding Place to Airtable");
  } else {
    toast.warning("Something went wrong...record not added");
  }
};
