"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

type AlertSeverity = "low" | "medium" | "high"

interface AlertItem {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  timestamp: string
  read: boolean
}

const initialAlerts: AlertItem[] = [
  {
    id: "1",
    title: "CPU Usage High",
    description: "CPU usage has exceeded 90%",
    severity: "high",
    timestamp: "2025-02-17T12:30:00Z",
    read: false,
  },
  {
    id: "2",
    title: "Memory Low",
    description: "Available memory is below 10%",
    severity: "medium",
    timestamp: "2025-02-17T12:15:00Z",
    read: false,
  },
  {
    id: "3",
    title: "Disk Space Warning",
    description: "Disk space is at 85% capacity",
    severity: "low",
    timestamp: "2025-02-17T11:45:00Z",
    read: true,
  },
  {
    id: "4",
    title: "Network Latency",
    description: "Network latency has increased by 50%",
    severity: "medium",
    timestamp: "2025-02-17T11:30:00Z",
    read: false,
  },
  {
    id: "5",
    title: "Service Unavailable",
    description: "The authentication service is not responding",
    severity: "high",
    timestamp: "2025-02-17T11:00:00Z",
    read: true,
  },
]

export default function AlertsList() {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts)
  const [filteredAlerts, setFilteredAlerts] = useState<AlertItem[]>(initialAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all")
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterAlerts(term, severityFilter, showUnreadOnly)
  }

  const handleSeverityFilter = (severity: AlertSeverity | "all") => {
    setSeverityFilter(severity)
    filterAlerts(searchTerm, severity, showUnreadOnly)
  }

  const handleUnreadFilter = (checked: boolean) => {
    setShowUnreadOnly(checked)
    filterAlerts(searchTerm, severityFilter, checked)
  }

  const filterAlerts = (term: string, severity: AlertSeverity | "all", unreadOnly: boolean) => {
    const filtered = alerts.filter(
      (alert) =>
        (alert.title.toLowerCase().includes(term.toLowerCase()) ||
          alert.description.toLowerCase().includes(term.toLowerCase())) &&
        (severity === "all" || alert.severity === severity) &&
        (!unreadOnly || !alert.read),
    )

    setFilteredAlerts(filtered)
  }

  const toggleRead = (id: string) => {
    const updatedAlerts = alerts.map((alert) => (alert.id === id ? { ...alert, read: !alert.read } : alert))
    setAlerts(updatedAlerts)
    filterAlerts(searchTerm, severityFilter, showUnreadOnly)
  }

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case "low":
        return <Info className="h-5 w-5 text-info" />
    }
  }

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-warning text-warning-foreground"
      case "low":
        return "bg-info text-info-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={severityFilter} onValueChange={handleSeverityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={showUnreadOnly ? "secondary" : "outline"}
          onClick={() => handleUnreadFilter(!showUnreadOnly)}
          className="w-full sm:w-auto"
        >
          {showUnreadOnly ? "Showing unread only" : "Show all"}
        </Button>
      </div>
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div key={alert.id} className="relative cursor-pointer group" onClick={() => toggleRead(alert.id)}>
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-200 ${
                alert.read ? "bg-transparent" : "bg-blue-500"
              }`}
              style={{ left: "-12px" }}
            />
            <Alert className="flex items-center hover:bg-accent transition-colors">
              <div className="mr-4">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-grow">
                <AlertTitle className="text-lg font-semibold">{alert.title}</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">{alert.description}</AlertDescription>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-4" onClick={(e) => e.stopPropagation()}>
                View Details
              </Button>
            </Alert>
          </div>
        ))}
      </div>
    </div>
  )
}

