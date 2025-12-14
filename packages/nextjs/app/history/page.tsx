"use client"

import { useMemo } from "react"
import { ShipmentCard } from "~~/components/shipment-card"
import { DUMMY_SHIPMENTS } from "~~/lib/dummy-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs"
import { Card, CardContent } from "~~/components/ui/card"
import { History, Wallet, ShoppingBag, Package } from "lucide-react"

export default function HistoryPage() {
  const isConnected = parseFloat(Math.random().toFixed(1)) > 0.5
  const address = "0x0123455667677";

  const { asSeller, asBuyer } = useMemo(() => {
    if (!address) return { asSeller: [], asBuyer: [] }

    return {
      asSeller: DUMMY_SHIPMENTS.filter((s) => s.sender === address),
      asBuyer: DUMMY_SHIPMENTS.filter((s) => s.recipient === address),
    }
  }, [address])

  const handleClaimFunds = (shipmentId: string) => {
    // In real app, call smart contract
    console.log(`Claiming funds for shipment ${shipmentId}`)
    alert(`Funds claimed for shipment #${shipmentId}!`)
  }

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Wallet Not Connected</h2>
            <p className="mt-2 text-center text-muted-foreground">
              Please connect your wallet to view your shipment history.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shipment History</h1>
          <p className="mt-1 text-muted-foreground">View all shipments you've been involved in as a buyer or seller</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="seller" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="seller" className="gap-2">
              <Package className="h-4 w-4" />
              As Seller ({asSeller.length})
            </TabsTrigger>
            <TabsTrigger value="buyer" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              As Buyer ({asBuyer.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seller" className="mt-6">
            {asSeller.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {asSeller.map((shipment) => (
                  <ShipmentCard
                    key={shipment.shipment_id}
                    shipment={shipment}
                    onClaimFunds={handleClaimFunds}
                    showClaimButton
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <Package className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No sales yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">You haven't sold any products yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="buyer" className="mt-6">
            {asBuyer.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {asBuyer.map((shipment) => (
                  <ShipmentCard key={shipment.shipment_id} shipment={shipment} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No purchases yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">You haven't purchased any products yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="flex items-start gap-4 p-4">
            <History className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium text-foreground">About Claiming Funds</p>
              <p className="mt-1 text-muted-foreground">
                As a seller, once the buyer confirms receipt of the shipment, you can claim your funds from the escrow.
                The "Claim Funds" button will appear on shipments where you are the seller and the buyer has confirmed
                receipt.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
