import { Databricks } from "@databricks/sql"

const databricks = new Databricks({
  host: process.env.DATABRICKS_HOST,
  path: process.env.DATABRICKS_HTTP_PATH,
  token: process.env.DATABRICKS_TOKEN,
})

export async function queryDatabricks(sql: string) {
  let session
  try {
    session = await databricks.openSession()
    const result = await session.sql(sql)
    const rows = await result.collect()
    return rows
  } catch (error) {
    console.error("Error in queryDatabricks:", error)
    throw new Error(`Databricks query failed: ${error instanceof Error ? error.message : String(error)}`)
  } finally {
    if (session) {
      await session.close().catch(console.error)
    }
  }
}

