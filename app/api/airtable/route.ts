import {
    AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME
} from "~/app/config"
import { Record } from "~/app/components/types"
import { NextResponse } from "next/server"
const baseUrl = "https://api.airtable.com/v0"
let globalRecords: Record[] = []
let recordCount = 0

fetchAirtableRecords().then(() => console.log("Ok Iam done"))

export async function GET() {
    // fetchAirtableRecords()
    return new NextResponse(JSON.stringify(globalRecords.length), {
        status: 200,
    })
}

export async function POST() {
    console.log("Records", globalRecords.length)
    return new NextResponse(JSON.stringify(globalRecords), {
        status: 200,
    })
}

async function fetchAirtableRecords() {

    const pageSize = 100;
    const fields = ["Title", "Coordinates (lat, lng)", "Tags", "Region", "State / AAL1", "City", "Country"];
    const view = "Test View";
    const maxRecords = 5000;
    let records: Array<Record> = [];

    let offset = null;
    let shouldFetchMore = true;

    const startTime = new Date().getTime(); // Start time

    while (shouldFetchMore === true) {

        let finalUrl = `${baseUrl}/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/listRecords`;

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
        records = records.concat(data.records);
        globalRecords = records

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
    console.log("Total records: " + records.length);
    console.log("Duration: " + duration + "ms");

}


// export async function fetchsql() {
//     try {
//         const query = "SELECT * FROM Map limit 20001 ";
//         const url = `http://localhost:8080/select-data?query=${encodeURIComponent(query)}`;
//         const res = await fetch(url);
//         const data = await res.json()
//         return data
//     } catch (e) {
//         console.error(e)
//         return []
//     }
// }


// export async function fetchRecords() {

//     let finalUrl = baseUrl + "/" + baseId + "/" + tableName + "/" + 'listRecords'

//     const res = await fetch(finalUrl, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
//         },
//         body: JSON.stringify({
//             // fields: ["name", "address", "lat", "lng", "phone", "website"],
//             fields: ["Title", "Description", "Coordinates (lat, lng)", "Tags", "Region", "State / AAL1", "City", "Country"],
//             view: "All Records",
//             filterByFormula: "",
//             // sort by State Title 
//             // sort: [{ field: "name", direction: "asc" }],
//             pageSize: 100,
//         }),
//     })

//     return res.json()
// }
