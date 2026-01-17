import { NextResponse } from "next/server"
import { importPhotographersServer } from "@/lib/firebase/firestore-server"
import { readFileSync } from "fs"
import { join } from "path"

export async function POST() {
  try {
    // Read the JSON file
    const filePath = join(process.cwd(), "data", "photographers.json")
    console.log("Reading file from:", filePath)
    const fileContents = readFileSync(filePath, "utf8")
    const photographersData = JSON.parse(fileContents)
    console.log(`Parsed ${photographersData.length} records from JSON file`)

    // Filter out header row if present
    const data = (photographersData as any[]).filter(
      (item) => {
        const firstName = item["First Name"] || item.Column2
        return firstName && firstName !== "First Name" && firstName !== "Column2"
      }
    )
    console.log(`Filtered to ${data.length} valid photographer records`)

    const result = await importPhotographersServer(data)
    console.log(`Import complete: ${result.success} success, ${result.errors} errors`)

    return NextResponse.json({
      success: true,
      imported: result.success,
      errors: result.errors,
      message: `Successfully imported ${result.success} photographers. ${result.errors} errors.`,
    })
  } catch (error: any) {
    console.error("Error importing photographers:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to import photographers",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

