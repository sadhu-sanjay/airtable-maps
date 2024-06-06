"use client";

import dynamic from "next/dynamic";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";
import { Spinner } from "~/components/spinner";
import { DropdownItem, Record } from "~/components/models/types";
import {
  MAPS_API_KEY,
  RECORDS_FETCH_URL,
  TAGS_FETCH_URL,
  VIEWS_FETCH_URL,
} from "~/config";
import MyList from "./my-list";
import MyMap from "./map";
import DropdownMultiSelect from "./common/dropdown/dropdown-multiSelect";
import SearchBar from "./search-bar";
import EmptyList from "./common/empty-states/empty-list";
import useRecords from "./useRecords";
import PlaceDetailModal from "./my-pages/place-detail";
import Dropdown from "./common/dropdown/dropdown";
import { useQuery } from "@tanstack/react-query";
const PlaceOverview = dynamic(() => import("@googlemaps/extended-component-library/react").then(mod => mod.PlaceOverview), { ssr: false });
const PlacePicker = dynamic(() => import("@googlemaps/extended-component-library/react").then(mod => mod.PlacePicker), { ssr: false });
const IconButton = dynamic(() => import("@googlemaps/extended-component-library/react").then(mod => mod.IconButton), { ssr: false });
const PlaceDirectionsButton = dynamic(() => import("@googlemaps/extended-component-library/react").then(mod => mod.PlaceDirectionsButton), { ssr: false });


import { IconLocation } from "./resources/icons/icon-location";
import { CREATE } from "~/airtable/route";
import { toast } from "sonner";
import { capitalizeFirstLetter, replaceUnderScoreWithSpace } from "./lib/utils";

export default function Home() {
  const asideRef = useRef<HTMLDivElement>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string>();
  const [listRecords, setListRecords] = useState<Record[]>([]);
  const [mapRecords, setMapRecods] = useState<Record[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchTerms = useRef<string[]>([]);
  const currentItem = useRef<DropdownItem | undefined>(undefined)

  const {
    isStreamingRecords,
    isLoadingRecords,
    records,
    fetchRecords,
    status,
  } = useRecords();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<DropdownItem[]>([]);
  const [unSelectedTags, selectUnselectedTags] = useState<DropdownItem[]>([]);

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetch(TAGS_FETCH_URL).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  console.log("RENDER MAP COMPONENT");

  const updateRecords = useCallback((newRecords: Record[]) => {
    setMapRecods(newRecords);
    setListRecords(newRecords);
  }, []);

  useEffect(() => {
    updateRecords(records);
  }, [updateRecords, records]);
  /**
   *  End Update views when new records are fetched
   */

  /**
   * FILTER START
   */
  const filterHandler = useCallback(() => {
    // match allThree selected regions, searchTerms and tags, if any one of them is empty then match with other two,
    // of if 2 are empty then match with the one that is not empty
    console.log("SElect", selectedTags.length);
    console.log("Unselected", unSelectedTags.length);
    let newFilteredRecords = records.filter((record) => {
      let tagMatch = false;
      let searchMatch = false;
      let excludeTagMatch = false;

      // check if any of the selected tags match with record tags

      if (selectedTags.length > 0) {
        tagMatch = selectedTags.some((tag: DropdownItem) => {
          return record.Tags?.toLowerCase()
            .split(",")
            .includes(tag.label.toLowerCase());
        });
      } else {
        tagMatch = true;
      }

      if (unSelectedTags.length > 0) {
        excludeTagMatch = !record.Tags?.toLowerCase()
          .split(",")
          .some((tag) => {
            return unSelectedTags.some(
              (utag) => utag.label.toLowerCase() === tag.toLowerCase()
            );
          });
      } else {
        excludeTagMatch = true;
      }

      // check if any of the search terms match with record search string
      if (searchTerms.current.length > 0) {
        searchMatch = searchTerms.current.every((term) =>
          record.SearchString?.includes(term.toLowerCase())
        );
      } else {
        searchMatch = true;
      }

      return tagMatch && searchMatch && excludeTagMatch;
    });

    updateRecords(newFilteredRecords);
  }, [records, selectedTags, updateRecords, unSelectedTags]);

  const searchHandler = useCallback(
    (value: string) => {
      searchTerms.current = value.split(" ");
      filterHandler();
    },
    [filterHandler]
  );

  let abortController = useRef<AbortController | null>(null);
  const viewChangedHandler = useCallback(
    (item?: DropdownItem) => {
      if (!item) return;

      setSelectedTags([]);
      selectUnselectedTags([]);
      setSearchTerm("");
      currentItem.current = item;

      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      fetchRecords(item, abortController.current.signal);
    },
    [fetchRecords]
  );

  const tagsHandler = useCallback(
    (newTagsHandler: Array<DropdownItem>) => {
      filterHandler();
    },
    [filterHandler]
  );

  /**
   * FILTER END
   */

  const handleZoom = useCallback((viewPortRecords: Record[]) => {
    setListRecords(viewPortRecords);
  }, []);

  const onRecordSelected = useCallback((selectedId: string) => {
    console.log("selectedId", selectedId);
    setSelectedRecordId(selectedId);
    setIsModalOpen(true);
  }, []);

  const addToAirTable = async () => {
    const toastId = toast.loading("Please wait");
    // Fetch Additional Ddetail
    place?.fetchFields({ fields: ["editorialSummary", "websiteURI"] });

    //   await table.updateRecordAsync(recordId, {
    //     "Address": location['results'][0]['formatted_address'],
    //     "Street Number": address_components.find(x => x.types.includes('street_number')) ? address_components.find(x => x.types.includes('street_number')).long_name : '',
    //     "Street": address_components.find(x => x.types.includes('route')) ? address_components.find(x => x.types.includes('route')).long_name : '',
    //     "Neighborhood": address_components.find(x => x.types.includes('neighborhood')) ? address_components.find(x => x.types.includes('neighborhood')).long_name : '',
    //     "City": address_components.find(x => x.types.includes('locality')) ? address_components.find(x => x.types.includes('locality')).long_name :
    //         address_components.find(x => x.types.includes('sublocality')) ? address_components.find(x => x.types.includes('sublocality')).long_name : '',
    //     "State / AAL1": address_components.find(x => x.types.includes('administrative_area_level_1')) ? address_components.find(x => x.types.includes('administrative_area_level_1')).long_name : '',
    //     "County / AAL2": address_components.find(x => x.types.includes('administrative_area_level_2')) ? address_components.find(x => x.types.includes('administrative_area_level_2')).long_name : '',
    //     "Country": address_components.find(x => x.types.includes('country')) ? address_components.find(x => x.types.includes('country')).long_name : '',
    //     "Postal code": address_components.find(x => x.types.includes('postal_code')) ? address_components.find(x => x.types.includes('postal_code')).long_name : ''
    // });

    console.log("addressComponents", place?.addressComponents);
    console.log("editorialSummary", place?.editorialSummary);
    console.log("adrFormatAddress", place?.adrFormatAddress);
    console.log("attributions", place?.attributions);
    console.log("businessStatus", place?.businessStatus);
    console.log("displayName", place?.displayName);
    console.log("formattedAddress", place?.formattedAddress);
    console.log("googleMapsURI", place?.googleMapsURI);
    console.log("location", place?.location);
    console.log("iconBackgroundColor", place?.iconBackgroundColor);
    console.log("id", place?.id);
    console.log("internationalPhoneNumber", place?.internationalPhoneNumber);
    console.log("websiteURI", place?.websiteURI);
    console.log("Photos", place?.photos);
    console.log("Rating", place?.rating);
    console.log("Requested Langauge", place?.requestedLanguage);
    console.log("Reviews", place?.reviews);
    console.log("Types", place?.types);
    console.log("userRatingCount", place?.userRatingCount);
    console.log("pluscode", place?.plusCode);
    console.log(
      "Processed Tags ",
      place?.types?.map(replaceUnderScoreWithSpace).map(capitalizeFirstLetter)
    );

    const req = {
      body: {
        typecast: true,
        fields: {
          Title: place?.displayName,
          Tags: place?.types
            ?.map(replaceUnderScoreWithSpace)
            .map(capitalizeFirstLetter),
          "Coordinates (lat, lng)": place?.location?.toUrlValue(),
          "Postal code": place?.addressComponents?.find((each) =>
            each.types.includes("postal_code")
          )?.longText,
          Country: place?.addressComponents?.find((each) =>
            each.types.includes("country")
          )?.longText,
          "State / AAL1": place?.addressComponents?.find((each) =>
            each.types.includes("administrative_area_level_1")
          )?.longText,
          City: place?.addressComponents?.find(
            (each) =>
              each.types.includes("locality") ||
              each.types.includes("sublocality")
          )?.longText,
          "Recommended By": "sanjaygoswami60@gmail.com",
          Address: place?.formattedAddress,
          Image: place?.photos
            ? place.photos.slice(0, 3).map((photo) => ({ url: photo.getURI() }))
            : [],
          URL: place?.websiteURI,
          Description:
            place?.editorialSummary ??
            "" + place?.googleMapsURI ??
            "" + place?.internationalPhoneNumber ??
            "",
          GooglePlacesID: place?.id,
        },
      },
    };

    const response = await CREATE(req); // create record in airtable

    toast.dismiss(toastId);

    if (response) {
      toast.success("Successfully Added Place to Airtable");
    } else {
      toast.error("Error Adding Place to Airtable");
    }
  };

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <Spinner message={"Loading.."} />;
      case Status.FAILURE:
        return (
          <EmptyList
            title="Failed to load Map."
            subtitle="Please try refreshing the page."
          />
        );
      case Status.SUCCESS:
        return (
          <MyMap
            handleZoom={handleZoom}
            records={mapRecords}
            onRecordSelected={onRecordSelected}
            place={place}
          />
        );
    }
  };

  const closeDetail = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const labelAndValues = useMemo(() => ({ label: "name", value: "id" }), []);
  const [place, setPlace] = useState<google.maps.places.Place | undefined>(
    undefined
  );

  return (
    <div className="h-screen flex flex-col-reverse sm:flex-row relative ">
      <aside
        ref={asideRef}
        className=" h-1/2 sm:h-full w-full md:w-4/12 lg:w-3/12 sm:min-w-[320px] overflow-y-auto"
      >
        <div className="relative shadow-lg bg-gray-100 dark:bg-gray-800 flex w-full h-full flex-col gap-3 justify-start p-4 ">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onValueChange={searchHandler}
          />
          <div className="flex justify-between align-middle">
            <Suspense>
              <Dropdown
                label="Views"
                placeholder="Views"
                itemGotSelected={viewChangedHandler}
                fetchUrl={VIEWS_FETCH_URL}
                labelAndValue={labelAndValues}
              />
            </Suspense>
            <DropdownMultiSelect
              label="include tags"
              placeholder="include tags"
              doneCallBack={tagsHandler}
              fetchUrl={TAGS_FETCH_URL}
              selectedItems={selectedTags}
              setSelectedItems={setSelectedTags}
              isLoading={tagsQuery.isLoading}
              items={tagsQuery.data?.map((tag: any) => ({
                label: tag.name,
                value: tag.id,
                color: tag.color,
              }))}
            />
            <DropdownMultiSelect
              label="exclude tags"
              placeholder="exclude tags"
              doneCallBack={tagsHandler}
              fetchUrl={TAGS_FETCH_URL}
              selectedItems={unSelectedTags}
              setSelectedItems={selectUnselectedTags}
              isLoading={tagsQuery.isLoading}
              items={tagsQuery.data?.map((tag: any) => ({
                label: tag.name,
                value: tag.id,
                color: tag.color,
              }))}
            />
          </div>
          <MyList
            asideRef={asideRef}
            records={listRecords}
            isLoadingRecords={isLoadingRecords}
            isStreamingRecords={isStreamingRecords}
            onRecordSelect={onRecordSelected}
            status={status}
            refetchRecords={() => {
              viewChangedHandler(currentItem.current);
            }}
          />
        </div>
      </aside>

      <main className=" w-full sm:w-8/12 lg:w-9/12 h-1/2 sm:h-full">
        <Wrapper libraries={["marker"]} apiKey={MAPS_API_KEY} render={render} />
      </main>

      <aside
        className="bg-transparent absolute top-0 sm:right-0  h-auto max-h-full
      w-full sm:w-5/12 md:w-4/12 lg:w-3/12 overflow-y-auto "
      >
        <div className="bg-white w-full p-4 sticky top-0 shadow-lg ">
          <div className="flex items-center mb-1">
            <IconLocation />
            <h1 className="text-md font-md p-2"> Find a location to visit </h1>
          </div>
          <PlacePicker
            onPlaceChange={(e: Event) => {
              const target = e.target;
              // @ts-ignore
              const value = target?.value;
              console.log("Place ChangesssSanjay", value);
              if (value) {
                setPlace(value);
              }
            }}
            placeholder="Enter a place to see its address"
            className="w-full"
          ></PlacePicker>
        </div>
        <PlaceOverview
          place={place?.id}
          // place="ChIJbf8C1yFxdDkR3n12P4DkKt0"
          // travelOrigin={DEFAULT_LOCATION}
          googleLogoAlreadyDisplayed
        >
          <div slot="action">
            <IconButton
              slot="action"
              variant="outlined"
              onClick={addToAirTable}
              icon="note_add"
            >
              Add to airtable
            </IconButton>
          </div>
          <div slot="action">
            <PlaceDirectionsButton slot="action" variant="outlined">
              Directions
            </PlaceDirectionsButton>
          </div>
          <IconButton
            slot="action"
            variant="filled"
            onClick={() => setPlace(undefined)}
            className="ml-auto sticky top-0 "
          >
            Close
          </IconButton>
        </PlaceOverview>
      </aside>

      <aside>
        <PlaceDetailModal
          recordId={selectedRecordId ?? ""}
          onClose={closeDetail}
          isOpen={isModalOpen}
        />
      </aside>
    </div>
  );
}
