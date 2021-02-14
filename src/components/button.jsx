/* eslint-env react */
/**
 * @fileoverview Button component.
 */

import React from 'react'

/**
 * @callback ButtonClickCallback
 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
 * @returns {void}
 *
 * @typedef {Object} ButtonProps
 * @prop {string} text
 * @prop {{}} children
 * @prop {ButtonClickCallback} onClick
 */

/**
 * Button component.
 * @param {ButtonProps} props Component props.
 * @returns {JSX.Element}
 */
export default function Button (props) {
  return (
    <button onClick={props.onClick}>
      {props.text || props.children}
    </button>
  )
}
