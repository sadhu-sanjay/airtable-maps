import {
  AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME
} from "~/app/config"
import { Record } from "~/app/components/types"
// fetch from next

const baseUrl = "https://api.airtable.com/v0"
let baseId = AIRTABLE_BASE_ID
let tableName = AIRTABLE_TABLE_NAME
const CATEGORIES = ['Hiking', 'Restaurant', 'Pub', 'Lake', 'Airport']

export async function fetchRecord( signal: AbortSignal, recordId?: string) {

  const finalUrl = `${baseUrl}/${baseId}/${tableName}/${recordId}`;
  const res = await fetch(finalUrl, {
    signal,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
    },
  });

  return res.json();
}

export async function fetchAirtableRecords() {

  let finalUrl = baseUrl + "/" + baseId + "/" + tableName + "/" + 'listRecords'

  const res = await fetch(finalUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      // fields: ["name", "address", "lat", "lng", "phone", "website"],
      fields: ["Title", "Coordinates (lat, lng)", "Tags", "Region", "State / AAL1", "City", "Country"],
      view: "All Records",
      filterByFormula: "",
      // sort by State Title 
      // sort: [{ field: "name", direction: "asc" }],
      pageSize: 100,
    }),
  })

  return res.json()
}

export async function sampleFetch() {
  const pageSize = 100;
  const fields = ["Title", "Coordinates (lat, lng)", "Tags", "Region", "State / AAL1", "City", "Country"];
  const view = "All Records";
  const maxRecords = 500;
  let allRecords: Array<Record> = [];

  let offset = null;
  let shouldFetchMore = true;

  const startTime = new Date().getTime(); // Start time

  while (shouldFetchMore) {
    let finalUrl = `${baseUrl}/${baseId}/${tableName}/listRecords`;

    const res = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        fields,
        view,
        maxRecords,
        filterByFormula: "",
        pageSize,
        offset,
      }),
    });

    const data = await res.json();
    allRecords = allRecords.concat(data.records);

    if (data.offset) {
      offset = data.offset;
      console.log("Offset: " + offset);
    } else {
      shouldFetchMore = false;
      console.log("No more records");
    }
  }

  const endTime = new Date().getTime(); // End time
  const duration = endTime - startTime; // Duration in milliseconds
  console.log("Total records: " + allRecords);
  console.log("Duration: " + duration + "ms");

  return allRecords;
}


export async function fetchsql() {
  try {
    const query = "SELECT * FROM Map limit 20001 ";
    const url = `http://localhost:8080/select-data?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json()
    return data
  } catch (e) {
    console.error(e)
    return []
  }
}