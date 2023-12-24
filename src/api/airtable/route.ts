import {
    AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_MAP_TABLE_ID
} from "~/config"
import { Record } from "~/components/types"
import { NextResponse } from "next/server"
const baseUrl = "https://api.airtable.com/v0"

export async function GET() {
    // fetchAirtableRecords()
    // return new NextResponse(JSON.stringify(globalRecords.length), {
    //     status: 200,
    // })
}

// update a airtable record 
export async function PATCH(req: { body: { id: string; fields: any } }) {
    const { id, fields } = req.body

    const res = await fetch(`${baseUrl}/${AIRTABLE_BASE_ID}/${AIRTABLE_MAP_TABLE_ID}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ fields }),
    })
    return res.json()
}


// export async function POST() {
//     return new NextResponse(JSON.stringify(globalRecords), {
//         status: 200,
//     })
// }

// async function fetchAirtableRecords() {

//     const pageSize = 100;
//     const fields = ["Title", "Coordinates (lat, lng)", "Tags", "Region", "State / AAL1", "City", "Country"];
//     const view = "Test View";
//     const maxRecords = 5001;
//     let records: Array<Record> = [];

//     let offset = null;
//     let shouldFetchMore = true;

//     const startTime = new Date().getTime(); // Start time

//     while (shouldFetchMore === true) {

//         let finalUrl = `${baseUrl}/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/listRecords`;

//         const res = await fetch(finalUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
//             },
//             body: JSON.stringify({
//                 fields,
//                 view,
//                 maxRecords,
//                 filterByFormula: "",
//                 pageSize,
//                 offset,
//             }),
//         });

//         const data = await res.json();
//         // add lat long from 'Coordinates (lat, lng)'
//         data.records.forEach((record: Record) => {

//             // making searching easier
//             record.fields.SearchString = record.fields.Title + " " + record.fields.Tags + " " + record.fields.Region + " " + record.fields["State / AAL1"] + " " + record.fields.City + " " + record.fields.Country;

//             if (!record.fields["Coordinates (lat, lng)"]) return;
//             const [lat, lng] = record.fields["Coordinates (lat, lng)"].split(",");
//             record.fields.lat = parseFloat(lat);
//             record.fields.lng = parseFloat(lng);
//         });
//         records = records.concat(data.records);
//         globalRecords = records


//         if (data.offset) {
//             offset = data.offset;
//             console.log("Offset: " + offset);
//         } else {
//             shouldFetchMore = false;
//             console.log("No more records");
//         }
//     }

//     const endTime = new Date().getTime(); // End time
//     const duration = endTime - startTime; // Duration in milliseconds
//     console.log("Total records: " + records.length);
//     console.log("Duration: " + duration + "ms");
//     console.log("Time of day: " + new Date().toLocaleTimeString());

// }


// // export async function fetchsql() {
// //     try {
// //         const query = "SELECT * FROM Map limit 20001 ";
// //         const url = `http://localhost:8080/select-data?query=${encodeURIComponent(query)}`;
// //         const res = await fetch(url);
// //         const data = await res.json()
// //         return data
// //     } catch (e) {
// //         console.error(e)
// //         return []
// //     }
// // }


// // export async function fetchRecords() {

// //     let finalUrl = baseUrl + "/" + baseId + "/" + tableName + "/" + 'listRecords'

// //     const res = await fetch(finalUrl, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
// //         },
// //         body: JSON.stringify({
// //             // fields: ["name", "address", "lat", "lng", "phone", "website"],
// //             fields: ["Title", "Description", "Coordinates (lat, lng)", "Tags", "Region", "State / AAL1", "City", "Country"],
// //             view: "All Records",
// //             filterByFormula: "",
// //             // sort by State Title 
// //             // sort: [{ field: "name", direction: "asc" }],
// //             pageSize: 100,
// //         }),
// //     })

// //     return res.json()
// // }
