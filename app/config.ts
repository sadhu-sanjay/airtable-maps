
export const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

export const AIRTABLE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN as string
export const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID as string
export const AIRTABLE_TABLE_NAME = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME as string
export const AIRTABLE_MAP_TABLE_ID = process.env.NEXT_PUBLIC_AIRTABLE_MAP_TABLE_ID as string
export const TAG_FIELD_ID = process.env.NEXT_PUBLIC_TAG_FIELD_ID as string

// Map Config

// SITE CONFIG
export const SITE_NAME = "Airtable Map"
export const SITE_DESCRIPTION = "Airtable Map"

// URLS
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL as string
export const AIRTABLE_EVENTS_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/sync/events"
export const RECORDS_FETCH_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/records"
export const RECORD_GET = process.env.NEXT_PUBLIC_SERVER_URL + "/api/record"
export const VIEWS_FETCH_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/views"
export const REGIONS_FETCH_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/regions"
export const TAGS_FETCH_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/tags"
export const VIEW_DATA_RELOAD = process.env.NEXT_PUBLIC_SERVER_URL + "/api/view-reload"
export const VIEW_RELOAD_STATUS = process.env.NEXT_PUBLIC_SERVER_URL + "/api/view-reload-status"
export const RECORD_IMAGE_URL = (RecordKey: string) => process.env.NEXT_PUBLIC_SERVER_URL + `/images/${RecordKey}.jpeg`

// DEFAULT FILTERS
export const defaultRegions = ["selVupXcUQUluj5QH", "selFtahXJowxQc55V"]; // North America Vs South America 
export const defaultCountries = ["United States"];
export const defaultCities = ["New York"]
export const defaultTags = ["selluxqqZPJunX450", "sel6vTJ09vBsX6qJo"]

// DEFAULT switch
export let isFirstLoad = true;
