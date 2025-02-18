import { NextResponse } from "next/server"
import { queryDatabricks } from "@/lib/databricks"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const sql = `
      SELECT 
        id,
        title,
        description,
        type,
        timestamp,
        read,
        metric,
        change
      FROM insights
      WHERE id = '${id}'
    `

    const [insight] = await queryDatabricks(sql)

    if (!insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 })
    }

    return NextResponse.json(insight)
  } catch (error) {
    console.error("Error fetching insight:", error)
    return NextResponse.json({ error: "Failed to fetch insight" }, { status: 500 })
  }
}

