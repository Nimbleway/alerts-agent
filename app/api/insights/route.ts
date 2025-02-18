import { NextResponse } from "next/server"
import { queryDatabricks } from "@/lib/databricks"

export async function GET() {
  try {
    const sql = `SELECT * FROM nimble_us.demo.thrasio_amazon_pdp LIMIT 1`
    const insights = await queryDatabricks(sql)
    return NextResponse.json(insights)
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch insights",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

