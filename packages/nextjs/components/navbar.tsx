// "use client"

// import Link from "next/link"
// import { Button } from "~~/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~~/components/ui/dropdown-menu"
// import { Package, ShoppingBag, Truck, AlertTriangle, History, Menu, Wallet, LogOut } from "lucide-react"
// import { useState } from "react"

// export function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   const truncateAddress = (addr: string) => {
//     return `${addr.slice(0, 6)}...${addr.slice(-4)}`
//   }

//   const navLinks = [
//     { href: "/products", label: "Products", icon: ShoppingBag },
//     { href: "/create-product", label: "Create", icon: Package },
//     { href: "/shipments", label: "Shipments", icon: Truck },
//     { href: "/disputes", label: "Disputes", icon: AlertTriangle },
//     { href: "/history", label: "History", icon: History },
//   ]

//   return (
//     <nav className="border-b border-border bg-card">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
//                 <Package className="h-5 w-5 text-primary-foreground" />
//               </div>
//               <span className="text-lg font-semibold text-foreground">EscrowMarket</span>
//             </Link>

//             <div className="hidden md:flex items-center gap-1">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
//                 >
//                   <link.icon className="h-4 w-4" />
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             {isConnected ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="gap-2 bg-transparent">
//                     <Wallet className="h-4 w-4" />
//                     <span className="hidden sm:inline">{truncateAddress(address!)}</span>
//                     <span className="text-xs text-muted-foreground capitalize">({connectorName})</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={disconnect} className="gap-2 text-destructive">
//                     <LogOut className="h-4 w-4" />
//                     Disconnect
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button className="gap-2">
//                     <Wallet className="h-4 w-4" />
//                     Connect Wallet
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={() => connect("argent")} className="gap-2">
//                     <div className="h-5 w-5 rounded bg-orange-500" />
//                     Argent
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => connect("braavos")} className="gap-2">
//                     <div className="h-5 w-5 rounded bg-yellow-500" />
//                     Braavos
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}

//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>

//         {mobileMenuOpen && (
//           <div className="border-t border-border py-4 md:hidden">
//             <div className="flex flex-col gap-1">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <link.icon className="h-4 w-4" />
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }
