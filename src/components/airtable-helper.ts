import {
  AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_MAP_TABLE_ID, RECORD_GET, TAG_FIELD_ID
} from "~/config"

export async function fetchRecord(signal: AbortSignal, recordId: string) {

  try {
    const res = await fetch(RECORD_GET(recordId), {
      signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch record:", error);
    // You can throw the error again to let the caller handle it
    throw error;
  }
}

export async function fetchTagsAirtable() {

  const url = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

  return new Promise((resolve) => fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`
    }
  }).then(response => response.json())
    .then(response => {
      try {
        const fields = response.tables.find((table: any) => table.id === AIRTABLE_MAP_TABLE_ID).fields;
        const choices = fields.find((field: any) => field.id === TAG_FIELD_ID).options.choices;
        return resolve(choices);
      }
      catch (error) {
        throw new Error(`Error parsing tags: ${error}`);
      }
    })
    .catch(error => {
      console.log("Error", error)
    }));
}