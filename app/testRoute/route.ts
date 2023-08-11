
// Code snippet from page.tsx

import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({"hi:": "Sanjay"})
}