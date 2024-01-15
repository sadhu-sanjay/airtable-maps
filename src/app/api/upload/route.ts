import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises'
import { log } from "console";
import { existsSync, mkdirSync } from "fs";

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        console.log("No file found")
        return NextResponse.json({ success: false })
    }
    log('File On Server: ', file)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const workingDir = process.cwd()
    const imagesDir = `${workingDir}/data/images/orignal`
    if (!existsSync(imagesDir)) {
        mkdirSync(imagesDir, { recursive: true }); // This line creates the directories if they do not exist
    }
    const path = `${imagesDir}/${file.name}`

    await writeFile(path, buffer)
    console.log(`open ${path} to see the uploaded file`)
    await uploadToAirtable({
        body: {
            id: "recCPzq3DVyHLsMXf",
            fields: {
                Image: [
                    {
                        url: `https://v5.airtableusercontent.com/v3/u/24/24/1705341600000/VWW11UBbwtEhY5sN_TYPAg/CD9NSr8qsRxFqfijL5SzNgncvpeqPNB6xYXAnkgMwspQ7Lop2rTONQxWJjpGLth5HMoJS2_pUrqnBf3X6vhzPdK9uBaThlDRVuKmY9MrKUC0M2Tp__xrJyC3CsVu10mh89BLAPYNJ5hdpUTlsuyOmw/Mtj0S9NwQ0KZzEnbnquaGbXQ_7ds8lugfpx9QHbGG0o`,
                        filename: file.name,
                        size: file.size,
                        type: file.type,
                    }
                ]
            }
        }
    })

    return NextResponse.json({ success: true })
}

import {
    AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_MAP_TABLE_ID
} from "~/config"
const baseUrl = "https://api.airtable.com/v0"

async function uploadToAirtable(req: { body: { id: string; fields: any } }) {
    const { id, fields } = req.body

    try {
        console.log("uploadToAirtable", req.body)

        const res = await fetch(`${baseUrl}/${AIRTABLE_BASE_ID}/${AIRTABLE_MAP_TABLE_ID}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ fields }),
        })

        const json = await res.json()
        console.log("uploadToAirtable", json)


    } catch (error) {
        console.error(error)
    }
}