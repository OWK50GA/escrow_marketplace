import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
import "~~/styles/globals.css";
// import { WalletProvider } from "~~/lib/wallet-context"
// import { Navbar } from "~~/components/navbar"
import { ScaffoldStarkAppWithProviders } from "~~/components/ScaffoldStarkAppWithProviders"
import { ThemeProvider } from "~~/components/ThemeProvider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Escrow Marketplace - P2P Trading on Starknet",
  description: "A peer-to-peer escrow marketplace built on Starknet",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider enableSystem>
          <ScaffoldStarkAppWithProviders>
            {children}
          </ScaffoldStarkAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
