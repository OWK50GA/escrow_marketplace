"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import { DUMMY_DISPUTES } from "~~/lib/dummy-data"
import { DisputeStatus } from "~~/lib/types"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function DisputesPage() {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case DisputeStatus.OPEN:
        return (
          <Badge variant="destructive" className="gap-1">
            <Clock className="h-3 w-3" />
            Open
          </Badge>
        )
      case DisputeStatus.RESOLVED:
        return (
          <Badge className="gap-1 bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </Badge>
        )
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Disputes</h1>
          <p className="mt-1 text-muted-foreground">View all marketplace disputes and their status</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{DUMMY_DISPUTES.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-destructive">
                {DUMMY_DISPUTES.filter((d) => d.status === DisputeStatus.OPEN).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">
                {DUMMY_DISPUTES.filter((d) => d.status === DisputeStatus.RESOLVED).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Disputes List */}
        {DUMMY_DISPUTES.length > 0 ? (
          <div className="space-y-4">
            {DUMMY_DISPUTES.map((dispute) => (
              <Card key={dispute.dispute_id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Dispute #{dispute.dispute_id}
                  </CardTitle>
                  {getStatusBadge(dispute.status)}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Shipment ID</p>
                      <p className="font-medium">#{dispute.shipment_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Disputer</p>
                      <p className="font-medium font-mono text-xs">{truncateAddress(dispute.disputer)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{formatDate(dispute.created_at)}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="mt-1 font-medium">{dispute.reason}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No disputes</h3>
            <p className="mt-1 text-sm text-muted-foreground">There are no disputes to display</p>
          </div>
        )}
      </div>
    </div>
  )
}
