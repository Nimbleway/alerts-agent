"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, LineChartIcon, Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LineChart } from "@/components/ui/chart"

type InsightType = "performance" | "anomaly" | "trend" | "metric"

interface Insight {
  id: string
  title: string
  description: string
  type: InsightType
  timestamp: string
  read: boolean
  metric?: string
  change?: string
}

// const mockInsights: Insight[] = [
//   {
//     id: "1",
//     title: "Significant CPU Usage Increase",
//     description: "Average CPU utilization has increased by 45% compared to last week",
//     type: "performance",
//     timestamp: "2025-02-17T12:30:00Z",
//     read: false,
//     metric: "85%",
//     change: "+45%",
//   },
//   {
//     id: "2",
//     title: "Memory Usage Anomaly Detected",
//     description: "Unusual pattern in memory consumption detected in production cluster",
//     type: "anomaly",
//     timestamp: "2025-02-17T12:15:00Z",
//     read: false,
//     metric: "7.2GB",
//     change: "+2.1GB",
//   },
//   {
//     id: "3",
//     title: "Storage Growth Trend",
//     description: "Storage usage is growing 2x faster than previous month",
//     type: "trend",
//     timestamp: "2025-02-17T11:45:00Z",
//     read: true,
//     metric: "243GB",
//     change: "2x faster",
//   },
//   {
//     id: "4",
//     title: "Query Performance Metrics",
//     description: "Average query execution time improved by 30%",
//     type: "metric",
//     timestamp: "2025-02-17T11:30:00Z",
//     read: false,
//     metric: "120ms",
//     change: "-30%",
//   },
// ]

export default function InsightDetails() {
  const params = useParams()
  const [insight, setInsight] = useState<Insight | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInsightDetails()
  }, []) // Removed unnecessary dependency: [params.id]

  const fetchInsightDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/insight/${params.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch insight details")
      }
      const data = await response.json()
      setInsight(data)
    } catch (error) {
      console.error("Error fetching insight details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeIcon = (type: InsightType) => {
    switch (type) {
      case "performance":
        return <Activity className="h-5 w-5 text-blue-500" />
      case "anomaly":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "trend":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "metric":
        return <LineChartIcon className="h-5 w-5 text-purple-500" />
    }
  }

  const getTypeColor = (type: InsightType) => {
    switch (type) {
      case "performance":
        return "border-blue-200 bg-blue-50 text-blue-700"
      case "anomaly":
        return "border-orange-200 bg-orange-50 text-orange-700"
      case "trend":
        return "border-green-200 bg-green-50 text-green-700"
      case "metric":
        return "border-purple-200 bg-purple-50 text-purple-700"
    }
  }

  if (isLoading) {
    return <div>Loading insight details...</div>
  }

  if (!insight) {
    return <div>Insight not found</div>
  }

  // Mock data for the chart
  const chartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
    { name: "Jun", value: 239 },
    { name: "Jul", value: 349 },
  ]

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="inline-flex items-center mb-4 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Insights
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getTypeIcon(insight.type)}
              <CardTitle>{insight.title}</CardTitle>
            </div>
            <Badge variant="outline" className={getTypeColor(insight.type)}>
              {insight.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{insight.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium">Current Value</p>
              <p className="text-2xl font-bold">{insight.metric}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Change</p>
              <p className="text-2xl font-bold">{insight.change}</p>
            </div>
          </div>
          <div className="h-[300px]">
            <LineChart
              data={chartData}
              index="name"
              categories={["value"]}
              colors={["blue"]}
              yAxisWidth={40}
              customTooltip={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className="bg-white p-2 shadow rounded">
                      <p className="font-semibold">{payload[0].payload.name}</p>
                      <p>Value: {payload[0].value}</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

