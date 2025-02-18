"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DatabricksFetch() {
  const [data, setData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/databricks-query")
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json()
        setData(JSON.stringify(result, null, 2))
      } else {
        const text = await response.text()
        setData(text)
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : String(error))
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={fetchData} disabled={isLoading}>
        {isLoading ? "Loading..." : "Fetch Data from Databricks"}
      </Button>
      {error && <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</div>}
      {data && <pre className="bg-gray-100 p-4 rounded-md overflow-auto whitespace-pre-wrap">{data}</pre>}
    </div>
  )
}

