
import { AIRTABLE_ACCESS_TOKEN } from "../config"

const baseUrl = "https://api.airtable.com/v0"
let baseId = "appHjw2nnIfsNBHTm"
let tableName = "location30k"
const CATEGORIES = ['Hiking', 'Restaurant', 'Pub', 'Lake', 'Airport']



async function insertRecords(records: any[]) {
    const insertUrl = `${baseUrl}/${baseId}/${tableName}`;
    const insertResponse = await fetch(insertUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({ records: records.map(record => ({ fields: record })) }),
    });

    if (insertResponse.ok) {
        console.log(`Inserted ${records.length} records successfully.`);
    } else {
        console.error('Failed to insert records:', await insertResponse.text());
    }
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
            fields: ["name", "lat", "lng", "category"],
            view: "All Records",
            filterByFormula: "",
            sort: [{ field: "name", direction: "asc" }],
            pageSize: 100, 
        }),
    })

    return res.json()
}

// import { faker } from '@faker-js/faker';
// export async function createFakeRecord(totalRecords: number) {

//     const batchSize = 10; // Total records to create
//     const batches = Math.ceil(totalRecords / batchSize);

//     for (let batch = 0; batch < batches; batch++) {
//         const records = [];
//         for (let i = 0; i < batchSize; i++) {

//             const placeName = faker.location.city()
//             const latitude = faker.location.latitude()
//             const longitude = faker.location.longitude()

//             const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
//             const randomCategory = CATEGORIES[randomIndex];
//             const category = randomCategory

//             records.push({
//                 name: placeName,
//                 lat: latitude,
//                 lng: longitude,
//                 category: category,
//             });
//         }

//         await insertRecords(records);

//         if (batch < batches - 1) {
//             await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between batches
//         }
//     }
// }