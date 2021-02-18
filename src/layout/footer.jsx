/* eslint-env react */
/**
 * @fileoverview Footer layout component of the application.
 */

import React from 'react'

/**
 * @typedef {Object} FooterProps
 * @prop {string} version
 * @prop {boolean} show
 */

/**
 * Footer component.
 * @param {FooterProps} props Component props
 * @returns {JSX.Element}
 */
export default function Footer (props) {
  return (
    <footer id='home-footer-container' style={{ display: props.show ? 'block' : 'none' }}>
      Version {props.version}.
    </footer>
  )
}
