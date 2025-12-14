import Link from "next/link"
import { Button } from "~~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { ShoppingBag, Shield, Truck, Package, AlertTriangle, History, ArrowRight } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: "Secure Escrow",
      description: "Funds are held securely in the smart contract until both parties confirm the transaction.",
    },
    {
      icon: Truck,
      title: "Shipment Tracking",
      description: "Track your orders from purchase to delivery with transparent on-chain status updates.",
    },
    {
      icon: AlertTriangle,
      title: "Dispute Resolution",
      description: "Fair dispute system to handle disagreements between buyers and sellers.",
    },
  ]

  const quickLinks = [
    {
      href: "/products",
      icon: ShoppingBag,
      title: "Browse Products",
      description: "Explore all available products from verified sellers",
    },
    {
      href: "/create-product",
      icon: Package,
      title: "Create Product",
      description: "List your own products on the marketplace",
    },
    {
      href: "/shipments",
      icon: Truck,
      title: "Manage Shipments",
      description: "Track and manage all active shipments",
    },
    {
      href: "/disputes",
      icon: AlertTriangle,
      title: "View Disputes",
      description: "Check the status of all disputes",
    },
    {
      href: "/history",
      icon: History,
      title: "Shipment History",
      description: "View your complete transaction history",
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          P2P Escrow Marketplace
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Trade securely on Starknet with built-in escrow protection. Buy and sell with confidence knowing your funds
          are protected until delivery is confirmed.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/products" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Browse Marketplace
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/create-product" className="gap-2">
              <Package className="h-5 w-5" />
              Start Selling
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-semibold text-foreground">How It Works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-semibold text-foreground">Quick Navigation</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link, index) => (
            <Link key={index} href={link.href}>
              <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-primary/10">
                    <link.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {link.title}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm">{link.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Workshop Info */}
      <div className="mt-20 rounded-xl border bg-muted/50 p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">Workshop Demo</h2>
        <p className="mt-2 text-muted-foreground">
          This is a demo frontend for the Cairo Escrow Marketplace smart contract. Connect your wallet using Argent or
          Braavos to interact with the marketplace.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-sm text-muted-foreground">Argent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-muted-foreground">Braavos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
