/* eslint-env react */
/**
 * @fileoverview Header layout component of the application.
 */

import React from 'react'

/**
 * @typedef {Object} HeaderProps
 * @prop {boolean} show
 */

/**
 * Header component.
 * @param {HeaderProps} props Component props.
 * @returns {JSX.Element}
 */
export default function Header (props) {
  return (
    <header id='home-header-container' style={{ display: props.show ? 'block' : 'none' }}>
      <h1>Colonial Wars Map Editor</h1>
    </header>
  )
}
