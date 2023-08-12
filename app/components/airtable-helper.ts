import { AIRTABLE_ACCESS_TOKEN } from "../config"

const baseUrl = "https://api.airtable.com/v0"
let baseId = "appHjw2nnIfsNBHTm"
let tableName = "locations"


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
            fields: ["name", "lat", "lng", "category"],
            view: "All Records",
            filterByFormula: "",
            sort: [{ field: "name", direction: "asc" }],
            pageSize: 100, 
        }),
    })

    return res.json()
}
