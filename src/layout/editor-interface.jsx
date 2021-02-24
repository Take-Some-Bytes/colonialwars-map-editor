/* eslint-env react */
/**
 * @fileoverview The map editor interface component.
 */

import React from 'react'

/**
 * @typedef {Object} MapEditorInterfaceProps
 * @prop {import('../components/custom-modal').Dimensions} dimensions
 */

/**
 * A basic layout component
 * @param {MapEditorInterfaceProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function MapEditorInterface (props) {
  return (
    <div
      className='editor-interface'
      style={{
        height: `${props.dimensions.height}px`,
        width: `${props.dimensions.width}px`
      }}
    >
      hi
    </div>
  )
}
