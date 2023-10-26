
export const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

export const AIRTABLE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN as string
export const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID as string
export const AIRTABLE_TABLE_NAME = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME as string

// Map Config

// SITE CONFIG
export const SITE_NAME = "Airtable Map"
export const SITE_DESCRIPTION = "Airtable Map"

// URLS
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL as string
export const AIRTABLE_EVENTS_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/sync/events"
export const RECORDS_FETCH_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/records"
export const RECORD_GET = process.env.NEXT_PUBLIC_SERVER_URL + "/api/record"
export const TAGS_FETCH_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/tags"
export const REGIONS_FETCH_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/regions"

// DEFAULT FILTERS
export const defaultRegions = ["selVupXcUQUluj5QH", "selFtahXJowxQc55V"]; // North America Vs South America
export const defaultCountries = ["United States"];
export const defaultCities = ["New York"];
export const defaultTags = [""]