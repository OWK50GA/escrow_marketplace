"use client"

import { useState } from "react"
import { ShipmentCard } from "~~/components/shipment-card"
import { DUMMY_SHIPMENTS } from "~~/lib/dummy-data"
import { Input } from "~~/components/ui/input"
import { Search, Truck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~~/components/ui/dialog"
import { Button } from "~~/components/ui/button"
import { Label } from "~~/components/ui/label"
import { Textarea } from "~~/components/ui/textarea"
import { ShipmentStatus } from "~~/lib/types"

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [shipments, setShipments] = useState(DUMMY_SHIPMENTS)
  const [confirmShipDialog, setConfirmShipDialog] = useState<string | null>(null)
  const [disputeDialog, setDisputeDialog] = useState<string | null>(null)
  const [expectedTime, setExpectedTime] = useState("")
  const [disputeReason, setDisputeReason] = useState("")

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.shipment_id.includes(searchQuery) ||
      shipment.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.recipient.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleConfirmShipped = (shipmentId: string) => {
    setConfirmShipDialog(shipmentId)
  }

  const submitConfirmShipped = () => {
    // In real app, call smart contract
    console.log(`Confirming shipment ${confirmShipDialog} with expected time ${expectedTime}`);
    const shipment = shipments.find((s) => s.shipment_id === confirmShipDialog);
    if (!shipment) return;

    const shipmentIndex = shipments.indexOf(shipment);

    setShipments(
      shipments.map((s) => (s.shipment_id === confirmShipDialog ? { ...s, shipment_status: ShipmentStatus.SHIPPED as const } : s)),
      // (prev) => ([...prev, shipment])
    )
    // shipments[shipmentIndex].shipment_status = ShipmentStatus.SHIPPED;
    setConfirmShipDialog(null)
    setExpectedTime("")
    alert("Shipment confirmed!")
  }

  const handleConfirmReceived = (shipmentId: string) => {
    // In real app, call smart contract
    console.log(`Confirming receipt of shipment ${shipmentId}`)
    setShipments(
      shipments.map((s) => (s.shipment_id === shipmentId ? { ...s, shipment_status: ShipmentStatus.RECEIVED as const } : s)),
    )
    alert("Receipt confirmed!")
  }

  const handleCreateDispute = (shipmentId: string) => {
    setDisputeDialog(shipmentId)
  }

  const submitDispute = () => {
    // In real app, call smart contract
    console.log(`Creating dispute for shipment ${disputeDialog}: ${disputeReason}`)
    setDisputeDialog(null)
    setDisputeReason("")
    alert("Dispute created!")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shipments</h1>
          <p className="mt-1 text-muted-foreground">View and manage all marketplace shipments</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, product, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Shipments List */}
        {filteredShipments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredShipments.map((shipment) => (
              <ShipmentCard
                key={shipment.shipment_id}
                shipment={shipment}
                onConfirmShipped={handleConfirmShipped}
                onConfirmReceived={handleConfirmReceived}
                onCreateDispute={handleCreateDispute}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Truck className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No shipments found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "No shipments to display"}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Shipped Dialog */}
      <Dialog open={!!confirmShipDialog} onOpenChange={() => setConfirmShipDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Shipment</DialogTitle>
            <DialogDescription>Enter the expected delivery time for this shipment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expectedTime">Expected Delivery Time (hours)</Label>
              <Input
                id="expectedTime"
                type="number"
                min={1}
                placeholder="e.g., 72"
                value={expectedTime}
                onChange={(e) => setExpectedTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmShipDialog(null)}>
              Cancel
            </Button>
            <Button onClick={submitConfirmShipped} disabled={!expectedTime}>
              Confirm Shipped
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dispute Dialog */}
      <Dialog open={!!disputeDialog} onOpenChange={() => setDisputeDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Dispute</DialogTitle>
            <DialogDescription>Describe the issue with your order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Dispute</Label>
              <Textarea
                id="reason"
                placeholder="Describe the problem..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeDialog(null)}>
              Cancel
            </Button>
            <Button onClick={submitDispute} disabled={!disputeReason} variant="destructive">
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
