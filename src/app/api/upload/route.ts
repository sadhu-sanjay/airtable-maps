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

    return NextResponse.json({ success: true })
}