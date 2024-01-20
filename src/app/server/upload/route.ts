import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises'
import { log } from "console";
import { existsSync, mkdirSync } from "fs";
import { IMAGE_DIRECTORY, SERVER_URL } from "~/config";

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const recId = data.get('recId') as unknown as string

    const images = data.get('images') as unknown
    let imagesArr = []
    if (images) {
        imagesArr = JSON.parse(images as string)
    }

    if (!file) {
        console.log("No file found")
        return NextResponse.json({ success: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    if (!existsSync(IMAGE_DIRECTORY)) {
        mkdirSync(IMAGE_DIRECTORY, { recursive: true }); // This line creates the directories if they do not exist
    }


    const path = `${IMAGE_DIRECTORY}/${file.name}`
    try {

        await writeFile(path, buffer)
        const fileUrl = `${SERVER_URL}/images/orignal/${file.name}`
        const imgObject = { url: fileUrl }
        imagesArr.push(imgObject)

        const record = await uploadToAirtable({
            body: {
                id: recId,
                fields: {
                    Image: imagesArr
                }
            }
        })

        const returnObject = { success: true, fileUrl, record }
        return NextResponse.json(returnObject)

    } catch (error) {

        console.error("error", error)
        return NextResponse.json({ success: false })
    }

}

import {
    AIRTABLE_ACCESS_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_MAP_TABLE_ID
} from "~/config"
const baseUrl = "https://api.airtable.com/v0"

async function uploadToAirtable(req: { body: { id: string; fields: any } }) {
    const { id, fields } = req.body

    try {
        const res = await fetch(`${baseUrl}/${AIRTABLE_BASE_ID}/${AIRTABLE_MAP_TABLE_ID}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ fields }),
        })

        return await res.json()

    } catch (error) {
        console.error(error)
        throw error
    }
}