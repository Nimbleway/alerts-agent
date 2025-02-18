"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function InsightsList() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/insights?fetchAll=true")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.error) {
        throw new Error(result.error)
      }
      setData(result)
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
        {isLoading ? "Loading..." : "Fetch Data"}
      </Button>
      {error && <div className="text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</div>}
      {data && <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

