/* eslint-env react */
/**
 * @fileoverview The map editor container component.
 */

import React from 'react'

import MapEditorCanvas from './editor-canvas.jsx'
import MapEditorInterface from './editor-interface.jsx'

/**
 * @typedef {Object} MapEditorContainerProps
 * @prop {boolean} show
 * @prop {import('../components/custom-modal').Dimensions} viewportDimensions
 */

/**
 * A basic layout component
 * @param {MapEditorContainerProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function MapEditorContainer (props) {
  const tenthScreenHeight = props.viewportDimensions.height / 10

  return props.show
    ? (
      <div className='editor-container'>
        <MapEditorCanvas
          dimensions={{
            width: props.viewportDimensions.width,
            height: Math.round(7 * tenthScreenHeight)
          }}
          draw={ctx => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = 'green'
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          }}
        />
        <MapEditorInterface
          dimensions={{
            width: props.viewportDimensions.width,
            height: Math.round(3 * tenthScreenHeight)
          }}
        />
      </div>
      )
    : null
}
