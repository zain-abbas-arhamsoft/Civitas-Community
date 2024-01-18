// WalletConnection.js
import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const WalletConnection = ({ onAddressChange }) => {
  const { address, isConnected } = useAccount()
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket('wss://relay.walletconnect.org')
    ws.onopen = () => {
      //WebSocket connection established
    }
    ws.onmessage = event => {
      // Handle the WebSocket message here
    }
    ws.onerror = error => {
      // Handle WebSocket errors here
    }
    ws.onclose = event => {}
    setSocket(ws) // Store the WebSocket instance in state
    // Cleanup function to close WebSocket on component unmount
    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  useEffect(() => {
    onAddressChange(address) // Call onAddressChange with the address
  }, [isConnected, address])

  return (
    <div>
      <div>
        <ConnectButton />
      </div>
    </div>
  )
}

export default WalletConnection
