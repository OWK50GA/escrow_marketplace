"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connectorName: string | null
  connect: (connector: "argent" | "braavos") => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Simulated wallet addresses for demo
const DEMO_ADDRESSES = {
  argent: "0x04a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
  braavos: "0x07d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [connectorName, setConnectorName] = useState<string | null>(null)

  const connect = (connector: "argent" | "braavos") => {
    // In real app, this would use starknet-react
    setAddress(DEMO_ADDRESSES[connector])
    setConnectorName(connector)
  }

  const disconnect = () => {
    setAddress(null)
    setConnectorName(null)
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        connectorName,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

// export function useWallet() {
//   const context = useContext(WalletContext)
//   if (!context) {
//     throw new Error("useWallet must be used within a WalletProvider")
//   }
//   return context
// }
