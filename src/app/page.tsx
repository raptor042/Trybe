'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useWeb3Modal } from '@web3modal/ethers/react'
import { ethers } from 'ethers'

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(true)
  const [provider, setProvider] = useState(null)
  const { open } = useWeb3Modal()

  const connectWallet = async () => {
    try {
      const instance = await open()
      const ethersProvider = new ethers.provider __className_1deade.Web3Provider(instance)
      const signer = ethersProvider.getSigner()
      const address = await signer.getAddress()
      console.log('Wallet connected: ', address)
      setProvider(ethersProvider)
      setWalletConnected(true)
    } catch (error) {
      console.error('Error connecting wallet: ', error)
    }
  }

  return (
    <div className="w-full flex items-center justify-center pt-14 gap-5 flex-col">
      <Image
        src="/image.svg"
        alt=""
        width={250}
        height={100}
        className="w-86"
      />
      <div className="flex flex-col gap-4 items-center">
        {!walletConnected ? (
          <>st
            <p className="font-bold text-3xl">No Photos uploaded yet!</p>
            <p>Connect your wallet to be able to upload and store your photos</p>

          </>
        ) : (
          <>
            <p className="font-bold text-3xl">Wallet Connected!</p>
            <button className="btn btn-primary">Upload Photo</button>
          </>
        )}
      </div>
    </div>
  )
}
