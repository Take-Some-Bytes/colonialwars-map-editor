/* eslint-env react */
/**
 * @fileoverview The map editor canvas component.
 */

import React from 'react'

import { useCanvas } from '../../helpers/hooks'

/**
 * @typedef {Object} MapEditorCanvasProps
 * @prop {import('../../helpers/hooks').DrawFunction<'2d'>} draw
 * @prop {import('../../components/custom-modal').Dimensions} dimensions
 */

/**
 * A basic layout component
 * @param {MapEditorCanvasProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function MapEditorCanvas (props) {
  const canvasRef = useCanvas(props.draw, '2d', {
    dimensions: props.dimensions
  })
  return (
    <canvas className='editor-canvas' ref={canvasRef} />
  )
}
