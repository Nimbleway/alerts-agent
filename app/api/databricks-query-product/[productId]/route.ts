import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  const { productId } = params;

  const host = process.env.DATABRICKS_HOST;
  const httpPath = process.env.DATABRICKS_HTTP_PATH;
  const token = process.env.DATABRICKS_TOKEN;

  if (!host || !httpPath || !token) {
    return NextResponse.json(
      { error: "Missing Databricks environment variables" },
      { status: 500 }
    );
  }

  const endpoint = `https://${host}/api/2.0/sql/statements`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        statement: `SELECT job_time AS timestamp, best_sellers_category_1_rank AS rank FROM nimble_us.demo.thrasio_amazon_pdp WHERE job_time >= CURRENT_DATE - INTERVAL 7 DAY AND product_id = '${productId}' ORDER BY job_time;`,
        warehouse_id: httpPath.split("/").pop(),
        catalog: "nimble_us",
        schema: "demo"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Databricks API error: ${data.error}`);
    }

    return NextResponse.json({ success: true, result: data });
  } catch (error) {
    const err = error as Error;
    console.error("Error querying Databricks:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
