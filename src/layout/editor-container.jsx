/* eslint-env react, browser */
/**
 * @fileoverview The map editor container component.
 */

import React from 'react'

import EditorCanvas from './editor/canvas.jsx'
import EditorInterface from './editor/interface.jsx'

import Editor from '../editor/editor.js'
import Loading from '../components/loading.jsx'

import debugFactory from 'debug'

import { saveAs } from 'file-saver'

const debug = debugFactory('cw-map-editor:editor-container')

export const EDITOR_STATE_RUNNING = 0
export const EDITOR_STATE_STARTING = 1
export const EDITOR_STATE_SUSPENDED = 2
export const EDITOR_STATE_HAD_ERROR = 3
export const EDITOR_STATE_NOT_STARTED = 4
export const EDITOR_STATE_DO_NOT_START = 5

/**
 * @typedef {Object} EditorContainerProps
 * @prop {boolean} show
 * @prop {() => void} closeEditor
 * @prop {() => Promise<boolean>} openNewMapModal
 * @prop {Record<string, any>} mapConfig
 * @prop {Record<string, string>} keyBindings
 * @prop {import('../components/custom-modal').Dimensions} viewportDimensions
 */

/**
 * A basic layout component
 * @param {EditorContainerProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function EditorContainer (props) {
  const [editor, setEditor] = React.useState(null)
  const [editorLoading, setEditorLoading] = React.useState(false)
  const editorState = React.useRef(EDITOR_STATE_DO_NOT_START)
  // const [editorState, setEditorState] = React.useState(EDITOR_STATE_NOT_STARTED)

  // If we're going to show the editor, set editor state to EDITOR_STATE_NOT_STARTED.
  if (props.show && editorState.current === EDITOR_STATE_DO_NOT_START) {
    editorState.current = EDITOR_STATE_NOT_STARTED
  }

  /**
   * @type {import('../helpers/hooks').DrawFunction<'2d'>}
   */
  function draw (ctx) {
    // debugger
    if (
      editorState.current === EDITOR_STATE_DO_NOT_START ||
      editorState.current === EDITOR_STATE_HAD_ERROR ||
      editorState.current === EDITOR_STATE_STARTING
    ) {
    // if (editorState === EDITOR_STATE_HAD_ERROR || editorState === EDITOR_STATE_STARTING) {
      // Do nothing.
      // The editor either had an error, is already starting, or is not shown.
      return
    }

    if (editorState.current === EDITOR_STATE_RUNNING && editor instanceof Editor) {
    // if (editorState === EDITOR_STATE_RUNNING && editor instanceof Editor) {
      // Editor has started. Run it.
      try {
        editor.run()
      } catch (ex) {
        console.error(ex.stack)
        editorState.current = EDITOR_STATE_HAD_ERROR
        // setEditorState(EDITOR_STATE_HAD_ERROR)
      }
      return
    }

    if (editorState.current === EDITOR_STATE_NOT_STARTED) {
    // if (editorState === EDITOR_STATE_NOT_STARTED) {
      // editorStarting.current = true
      // setEditorState(EDITOR_STATE_STARTING)
      debug('Starting editor')
      editorState.current = EDITOR_STATE_STARTING
      setEditorLoading(true)
      Editor.create(props.mapConfig, props.keyBindings, ctx, props.viewportDimensions)
        .then(edtr => {
          // editorStarting.current = false
          setEditor(edtr)
          // setEditorState(EDITOR_STATE_RUNNING)
          editorState.current = EDITOR_STATE_RUNNING
          setEditorLoading(false)
        })
        .catch(ex => {
          console.error(ex.stack)
          // setEditorState(EDITOR_STATE_HAD_ERROR)
          editorState.current = EDITOR_STATE_HAD_ERROR
        })
    }
  }

  return (
    <div className='editor-container' style={{ display: props.show ? 'block' : 'none' }}>
      <EditorCanvas
        dimensions={{
          width: props.viewportDimensions.width,
          height: props.viewportDimensions.height
        }}
        draw={draw}
      />
      <EditorInterface
        quit={() => {
          if (editor instanceof Editor) {
            // Do this so that we stop taking input.
            editor.stop()
          }

          editorState.current = EDITOR_STATE_DO_NOT_START
          setEditor(null)
          props.closeEditor()
        }}
        openNewMapModal={() => {
          if (editor instanceof Editor) {
            // Suspend the editor while the user messes with the new map modal.
            debug('Suspending editor.')
            editor.suspend()
            editorState.current = EDITOR_STATE_SUSPENDED
          }

          props.openNewMapModal().then(doWeCreateNewMap => {
            if (doWeCreateNewMap) {
              debug('Creating new map.')
              editorState.current = EDITOR_STATE_NOT_STARTED
              setEditor(null)
              return
            }

            // Unsuspend the editor.
            if (editor instanceof Editor) {
              editorState.current = EDITOR_STATE_RUNNING
              editor.unsuspend()
            }
          })
        }}
        saveMap={() => {
          debug('Save map called')
          if (!(editor instanceof Editor)) {
            return
          }
          const exportedMapConf = new Blob([editor.mapConfig.exportAsJson()], {
            type: 'application/json;charset=utf-8'
          })
          saveAs(exportedMapConf, `${editor.mapConfig.mapName}.json`)
        }}
      />
      {/* We have to use state to do this because changing refs don't cause re-renders. */}
      {editorLoading &&
        <div
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'rgb(172, 118, 61)',
            zIndex: '101',
            position: 'absolute',
            top: '0',
            bottom: '0'
          }}
        >
          <Loading />
        </div>}
    </div>
  )
}
