import Link from 'next/link'
import React from 'react'

const Homepage = () => {
  return (
    <div>
        <h1>Private Transfers</h1>
        <h2>Only the parties directly involved have knowledge of the transfer details.</h2>
        <Link href='/send'>
            <label>Wire funds to another user</label>
        </Link>
        <Link href='/receive'>
            <label>Receive funds from another user</label>
        </Link>
        <Link href='/setup'>
            <label>Setup your account</label>
        </Link>
    </div>
  )
}

export default Homepage