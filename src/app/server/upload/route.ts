import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises'
import { log } from "console";
import { existsSync, mkdirSync } from "fs";
import { IMAGE_DIRECTORY } from "~/config";

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        console.log("No file found")
        return NextResponse.json({ success: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    console.log("Writing file to filesystem", IMAGE_DIRECTORY)
    if (!existsSync(IMAGE_DIRECTORY)) {
        console.log("Creating directory")
        mkdirSync(IMAGE_DIRECTORY, { recursive: true }); // This line creates the directories if they do not exist
    }else {
        console.log("Directory exists")
    }

    const path = `${IMAGE_DIRECTORY}/${file.name}`

    try {

        await writeFile(path, buffer)
        console.log(`Sanjay ${path} to see the uploaded file`)
        await uploadToAirtable({
            body: {
                id: "rect3VvKIpUimkGQG",
                fields: {
                    Image: [
                        {
                            url: `https://v5.airtableusercontent.com/v3/u/25/25/1705485600000/Ou2LRg5amgj4-adT6utChw/a-cbWLE_5zqC2m_N8-B0T69wxovfadlFLvLop0rVFclWePes03A2oLbZy676_82pSHyYc4KiKBgIOwJ3IXnnIoeeX4hGFFVH8ciIxZ0ZA9bfEvGXRXShUqVA6U17Ni3Fto1ujTeJH6zSefdktzkTQg/JaNMOK660PteeT2Obo01uPYzQjX628ibnm4dMyOaUD0`,
                            // filename: file.name,
                            // size: file.size,
                            // type: file.type,
                        }
                    ]
                }
            }
        })
    } catch (error) {

        console.error("error", error)
    }

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


    } catch (error) {
        console.error(error)
    }
}