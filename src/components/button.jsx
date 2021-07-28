/* eslint-env react */
/**
 * @fileoverview Button component.
 */

import React from 'react'

/**
 * @callback ButtonClickCallback
 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
 * @returns {void}
 */
/**
 * @typedef {Object} ButtonProps
 * @prop {string} text
 * @prop {boolean} small Is this a small button?
 * @prop {React.ReactNode} children
 * @prop {ButtonClickCallback} onClick
 * @prop {React.CSSProperties} style
 * @prop {string} className
 */

/**
 * Button component.
 * @param {ButtonProps} props Component props.
 * @returns {JSX.Element}
 */
export default function Button (props) {
  let className = props.small
    ? 'ui-button ui-button--small'
    : 'ui-button ui-button--large'

  if (props.className) {
    className += ` ${props.className}`
  }

  return (
    <button
      onClick={props.onClick}
      className={className}
      style={props.style}
    >
      {props.text || props.children}
    </button>
  )
}
