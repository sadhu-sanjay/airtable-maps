
// Code snippet from page.tsx

import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({"hi:": "Sanjay"})
}