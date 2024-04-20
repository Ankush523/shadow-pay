import Link from 'next/link'
import React from 'react'

const Homepage = () => {
  return (
    <div className='flex flex-col justify-center'>
        <h1 className='flex justify-center font-bold text-5xl my-12'>Private Transfers</h1>
        <h2 className='flex justify-center text-3xl mb-[100px]'>Only the parties directly involved have knowledge of the transfer details.</h2>
        <div className='flex flex-col justify-around px-[40%]'>
          <Link href='/setup' className='flex flex-col text-center border border-white p-5 mb-10'>
              <label className='text-2xl mb-2 text-blue-600 font-bold'>Account Setup</label>
              <label>Setup your account</label>
          </Link>
          <Link href='/send' className='flex flex-col text-center border border-white p-5 mb-10'>
              <label className='text-2xl mb-2 text-blue-600 font-bold'>Send</label>
              <label>Wire funds to another user</label>
          </Link>
          <Link href='/receive' className='flex flex-col text-center border border-white p-5 mb-10'>
              <label className='text-2xl mb-2 text-blue-600 font-bold'>Receive</label>
              <label>Receive funds from another user</label>
          </Link>
        </div>
    </div>
  )
}

export default Homepage