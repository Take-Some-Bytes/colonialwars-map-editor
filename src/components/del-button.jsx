/* eslint-env react */
/**
 * @fileoverview A simple delete button with an X.
 */

import React from 'react'

/**
 * @typedef {Record<'width'|'height', number>} Dimensions
 *
 * @typedef {Object} DeleteButtonProps
 * @prop {string} id
 * @prop {React.CSSProperties} buttonStyle
 * @prop {import('./button').ButtonClickCallback} onClick
 */

/**
 * A simple delete button.
 * @param {DeleteButtonProps} props Component props.
 */
export default function DeleteButton (props) {
  return (
    <button
      id={props.id}
      className='ui-delete-button'
      style={props.buttonStyle}
      onClick={props.onClick}
    >
      <span
        id={`${props.id}-span`}
        className='ui-delete-button__span'
      >
        &times;
      </span>
    </button>
  )
}
