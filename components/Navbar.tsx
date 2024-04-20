import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

const Navbar = () => {
  return (
    <div className='flex flex-row justify-around my-4'>
        <label className='text-3xl text-blue-600 font-bold'>Shadow Pay</label>
        <ConnectButton/>
    </div>
  )
}

export default Navbar