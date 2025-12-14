"use client"

import { useState, useMemo } from "react"
import { Input } from "~~/components/ui/input"
import { Button } from "~~/components/ui/button"
import { ProductCard } from "~~/components/product-card"
import { DUMMY_PRODUCTS, CATEGORIES } from "~~/lib/dummy-data"
import { Search, Filter } from "lucide-react"

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sellerFilter, setSellerFilter] = useState("")

  const filteredProducts = useMemo(() => {
    return DUMMY_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory

      const matchesSeller = sellerFilter === "" || product.seller.toLowerCase().includes(sellerFilter.toLowerCase())

      return matchesSearch && matchesCategory && matchesSeller
    })
  }, [searchQuery, selectedCategory, sellerFilter])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-muted-foreground">Browse all available products on the marketplace</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by seller address..."
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
              className="pl-10 font-mono text-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.group_id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Search className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
