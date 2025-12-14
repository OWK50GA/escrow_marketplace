"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import { Input } from "~~/components/ui/input"
import { Label } from "~~/components/ui/label"
import { DUMMY_PRODUCTS } from "~~/lib/dummy-data"
import { ShoppingCart, Plus, Trash2, ArrowLeft, Package, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/dialog"
import { useAccount } from "~~/hooks/useAccount"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  // const { address } = useWallet()
  const [quantity, setQuantity] = useState(1)
  const [stockToAdd, setStockToAdd] = useState(1)
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const [addStockDialogOpen, setAddStockDialogOpen] = useState(false)

  const randomNum = parseFloat(Math.random().toFixed(1));
  const isConnected = randomNum > 0.5;
  const address = "0x012345556";

  const { address: accountAddress } = useAccount();
  console.log(accountAddress);

  const product = DUMMY_PRODUCTS.find((p) => p.group_id === resolvedParams.id)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Product Not Found</h1>
          <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/products")} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  const isSeller = address === product.seller
  const totalPrice = Number(product.price) * quantity

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleBuy = () => {
    // In real app, this would call the smart contract
    console.log(`Buying ${quantity} of product ${product.group_id}`)
    setBuyDialogOpen(false)
    alert(`Purchase initiated for ${quantity} ${product.name}(s)!`)
  }

  const handleAddStock = () => {
    // In real app, this would call the smart contract
    console.log(`Adding ${stockToAdd} to product ${product.group_id}`)
    setAddStockDialogOpen(false)
    alert(`Added ${stockToAdd} units to stock!`)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      // In real app, this would call the smart contract
      console.log(`Deleting product ${product.group_id}`)
      router.push("/products")
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-xl border bg-muted">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{product.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-3xl">{product.price} ETH</span>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Sold by: <span className="font-mono text-xs">{truncateAddress(product.seller)}</span>
                {isSeller && <Badge variant="outline">You</Badge>}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isSeller && product.stock > 0 && (
                <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2" size="lg" disabled={!isConnected}>
                      <ShoppingCart className="h-5 w-5" />
                      {isConnected ? "Buy Now" : "Connect Wallet to Buy"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Purchase {product.name}</DialogTitle>
                      <DialogDescription>Enter the quantity you want to purchase</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.min(Number(e.target.value), product.stock))}
                        />
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex justify-between text-sm">
                          <span>Price per unit</span>
                          <span>{product.price} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Quantity</span>
                          <span>x{quantity}</span>
                        </div>
                        <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                          <span>Total</span>
                          <span>{totalPrice} ETH</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBuy}>Confirm Purchase</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {isSeller && (
                <div className="space-y-2">
                  <Dialog open={addStockDialogOpen} onOpenChange={setAddStockDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2 bg-transparent" variant="outline">
                        <Plus className="h-4 w-4" />
                        Add Stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Stock</DialogTitle>
                        <DialogDescription>Add more units to your product listing</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="stock">Units to Add</Label>
                          <Input
                            id="stock"
                            type="number"
                            min={1}
                            value={stockToAdd}
                            onChange={(e) => setStockToAdd(Number(e.target.value))}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Current stock: {product.stock} → New stock: {product.stock + stockToAdd}
                        </p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddStockDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddStock}>Add Stock</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button className="w-full gap-2" variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                    Delete Product
                  </Button>
                </div>
              )}

              {!isConnected && (
                <p className="text-center text-sm text-muted-foreground">
                  Connect your wallet to interact with this product
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
