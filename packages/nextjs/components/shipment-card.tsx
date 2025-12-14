"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import { Button } from "~~/components/ui/button"
import { type Shipment, ShipmentStatus } from "~~/lib/types"
import { Package, Truck, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface ShipmentCardProps {
  shipment: Shipment
  onConfirmShipped?: (shipmentId: string) => void
  onConfirmReceived?: (shipmentId: string) => void
  onCreateDispute?: (shipmentId: string) => void
  onClaimFunds?: (shipmentId: string) => void
  showClaimButton?: boolean
}

export function ShipmentCard({
  shipment,
  onConfirmShipped,
  onConfirmReceived,
  onCreateDispute,
  onClaimFunds,
  showClaimButton = false,
}: ShipmentCardProps) {
  // const { address } = useWallet()
  const address = "0x01234556677790";

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.NONE:
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case ShipmentStatus.SHIPPED:
        return (
          <Badge className="gap-1 bg-blue-500 hover:bg-blue-600">
            <Truck className="h-3 w-3" />
            Shipped
          </Badge>
        )
      case ShipmentStatus.RECEIVED:
        return (
          <Badge className="gap-1 bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Received
          </Badge>
        )
    }
  }

  const isSender = address === shipment.sender
  const isRecipient = address === shipment.recipient

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Package className="h-4 w-4" />
          Shipment #{shipment.shipment_id}
        </CardTitle>
        {getStatusBadge(shipment.shipment_status)}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Product</p>
            <p className="font-medium">{shipment.product_name || `Product #${shipment.product_group_id}`}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p className="font-medium">{shipment.number_of_products}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sender</p>
            <p className="font-medium font-mono text-xs">{truncateAddress(shipment.sender)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Recipient</p>
            <p className="font-medium font-mono text-xs">{truncateAddress(shipment.recipient)}</p>
          </div>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm text-muted-foreground">Amount in Escrow</p>
          <p className="text-xl font-bold">{shipment.amount} ETH</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
        {isSender && shipment.shipment_status === ShipmentStatus.NONE && onConfirmShipped && (
          <Button onClick={() => onConfirmShipped(shipment.shipment_id)} size="sm">
            <Truck className="mr-2 h-4 w-4" />
            Confirm Shipped
          </Button>
        )}
        {isRecipient && shipment.shipment_status === ShipmentStatus.SHIPPED && onConfirmReceived && (
          <Button onClick={() => onConfirmReceived(shipment.shipment_id)} size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Received
          </Button>
        )}
        {isRecipient && shipment.shipment_status === ShipmentStatus.SHIPPED && onCreateDispute && (
          <Button onClick={() => onCreateDispute(shipment.shipment_id)} size="sm" variant="destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Create Dispute
          </Button>
        )}
        {showClaimButton &&
          isSender &&
          shipment.shipment_status === ShipmentStatus.RECEIVED &&
          Number(shipment.amount) > 0 &&
          onClaimFunds && (
            <Button
              onClick={() => onClaimFunds(shipment.shipment_id)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Claim Funds
            </Button>
          )}
      </CardFooter>
    </Card>
  )
}
