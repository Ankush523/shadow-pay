import React from 'react'

const Send = () => {
  return (
    <div>
        <label>Send</label>
        <label>Recipient EOA : </label>
        <input placeholder='0xabc...'/>
        <label>Select token to transfer : </label>
        <select>
            <option>ETH</option>
            <option>DAI</option>
            <option>USDC</option>
        </select>
        <label>Amount : </label>
        <input/>
        <button>Send</button>
    </div>
  )
}

export default Send