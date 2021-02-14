/* eslint-env react */
/**
 * @fileoverview Basic layout component.
 */

import React from 'react'

/**
 * @typedef {Object} LayoutProps
 * @prop {{}} children
 * @prop {string} id
 * @prop {string} className
 */

/**
 * A basic layout component
 * @param {LayoutProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function Layout (props) {
  const { children, ...rest } = props
  return (
    <main {...rest}>{children}</main>
  )
}
