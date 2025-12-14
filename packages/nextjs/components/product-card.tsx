import Link from "next/link"
import { Card, CardContent, CardFooter } from "~~/components/ui/card"
import { Badge } from "~~/components/ui/badge"
import type { Product } from "~~/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Link href={`/product/${product.group_id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
            <Badge variant="secondary" className="shrink-0">
              {product.category}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-4 py-3">
          <div>
            <p className="text-lg font-bold text-foreground">{product.price} ETH</p>
            <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
          </div>
          <p className="text-xs text-muted-foreground">by {truncateAddress(product.seller)}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
