/* eslint-env react */
/**
 * @fileoverview The map editor container component.
 */

import React from 'react'

import MapEditorCanvas from './editor-canvas.jsx'
import MapEditorInterface from './editor-interface.jsx'

import Editor from '../editor/editor.js'

/**
 * @typedef {Object} MapEditorContainerProps
 * @prop {boolean} show
 * @prop {Record<string, any>} mapConfig
 * @prop {Record<string, string>} keyBindings
 * @prop {import('../components/custom-modal').Dimensions} viewportDimensions
 */

/**
 * A basic layout component
 * @param {MapEditorContainerProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function MapEditorContainer (props) {
  const editor = React.useRef(undefined)
  const tenthScreenHeight = props.viewportDimensions.height / 10
  const tenthScreenWidth = props.viewportDimensions.width / 10

  return props.show
    ? (
      <div className='editor-container'>
        <MapEditorCanvas
          dimensions={{
            width: props.viewportDimensions.width,
            height: props.viewportDimensions.height
          }}
          draw={async ctx => {
            if (editor.current instanceof Error) {
              // Do nothing.
              // The above check makes sure that, if an error was encountered
              // while doing messing with the Editor, we would stop doing things.
            } else if (editor.current instanceof Editor) {
              try {
                await editor.current.run()
              } catch (ex) {
                console.error(ex)
                editor.current = new Error(JSON.stringify(ex))
              }
            } else {
              try {
                editor.current = await Editor.create(
                  props.mapConfig, props.keyBindings, ctx
                )
              } catch (ex) {
                console.error(ex)
                editor.current = new Error(JSON.stringify(ex))
              }
            }
          }}
        />
        <MapEditorInterface
          dimensions={{
            width: Math.round(6 * tenthScreenWidth),
            height: Math.round(3 * tenthScreenHeight)
          }}
        />
      </div>
      )
    : null
}
