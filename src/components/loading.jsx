/* eslint-env react */
/**
 * @fileoverview Loading spinner component.
 */

import React from 'react'

/**
 * Loading component to show a spinner while something is loading.
 * @returns {JSX.Element}
 */
export default function Loading () {
  return (
    <div className='loading'>
      <svg width='100px' height='100px' className='loading__spinner' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='50px' cy='50px' fill='transparent' stroke='black' strokeWidth='10px' strokeOpacity='0.5' r='30' />
        <path d='M20 50 A30 30 0 0 1 50 20' stroke='black' strokeWidth='10px' fill='transparent' />
      </svg>
      <p>Loading...</p>
    </div>
  )
}
