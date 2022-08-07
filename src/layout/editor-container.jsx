/* eslint-env react, browser */
/**
 * @fileoverview The map editor container component.
 */

import React from 'react'
import debugFactory from 'debug'

import Loading from '../components/loading.jsx'
import EditorCanvas from './editor/canvas.jsx'
import EditorInterface from './editor/interface.jsx'
import { EditorModals } from './modals/index.jsx'

import Editor from '../editor/editor.js'

import constants from '../constants.js'

import { saveAs } from 'file-saver'
import { loadMap } from '../helpers/loaders.js'

const debug = debugFactory('cw-map-editor:editor-container')

/**
 * @typedef {Object} EditorContainerProps
 * @prop {boolean} show
 * @prop {() => void} closeEditor
 * @prop {() => void} openMapTeamsModal
 * @prop {React.Dispatch<any>} setError
 * @prop {Record<string, any>} mapConfig
 * @prop {Record<string, string>} keyBindings
 * @prop {() => Promise<boolean>} openNewMapModal
 * @prop {React.Dispatch<React.SetStateAction<{}>>} setMapConfig
 * @prop {import('../components/custom-modal').Dimensions} vwDimensions
 */

/**
 * A basic layout component
 * @param {EditorContainerProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function EditorContainer (props) {
  const [editor, setEditor] = React.useState(null)
  const [editorLoading, setEditorLoading] = React.useState(false)
  const [teamsModalOpen, setTeamsModalOpen] = React.useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false)
  const [graphicsModalOpen, setGraphicsModalOpen] = React.useState(false)
  const [modifiersModalOpen, setModifiersModalOpen] = React.useState(false)
  const [playerConfigModalOpen, setPlayerConfigModalOpen] = React.useState(false)
  const forceUpdate = React.useReducer(() => ({}))[1]
  const editorState = React.useRef(constants.EDITOR_STATE.DO_NOT_START)

  // If we're going to show the editor, set editor state to EDITOR_STATE_NOT_STARTED.
  if (props.show && editorState.current === constants.EDITOR_STATE.DO_NOT_START) {
    editorState.current = constants.EDITOR_STATE.NOT_STARTED
  }

  /**
   * @type {import('../helpers/hooks').DrawFunction<'2d'>}
   */
  function draw (ctx) {
    if (
      editorState.current === constants.EDITOR_STATE.DO_NOT_START ||
      editorState.current === constants.EDITOR_STATE.HAD_ERROR ||
      editorState.current === constants.EDITOR_STATE.STARTING
    ) {
      // Do nothing.
      // The editor either had an error, is already starting, or is not shown.
      return
    }

    if (editorState.current === constants.EDITOR_STATE.RUNNING && editor instanceof Editor) {
      // Editor has started. Run it.
      try {
        editor.run()
      } catch (ex) {
        console.error(ex.stack)
        editorState.current = constants.EDITOR_STATE.HAD_ERROR
      }
      return
    }

    if (editorState.current === constants.EDITOR_STATE.NOT_STARTED) {
      debug('Starting editor with config %O', props.mapConfig)
      editorState.current = constants.EDITOR_STATE.STARTING
      setEditorLoading(true)
      Editor.create(props.mapConfig, props.keyBindings, ctx, props.vwDimensions)
        .then(edtr => {
          setEditor(edtr)
          editorState.current = constants.EDITOR_STATE.RUNNING
          setEditorLoading(false)
        })
        .catch(ex => {
          console.error(ex.stack)
          editorState.current = constants.EDITOR_STATE.HAD_ERROR
        })
    }
  }
  /**
   * Convenience function to pause the editor.
   */
  function pauseEditor () {
    editor.pause()
    editorState.current = constants.EDITOR_STATE.SUSPENDED
  }
  /**
   * Convenience function to unpause the editor.
   */
  function unpauseEditor () {
    editor.unpause()
    editorState.current = constants.EDITOR_STATE.RUNNING
  }

  return (
    <>
      <div className='editor-container' style={{ display: props.show ? 'block' : 'none' }}>
        <EditorCanvas
          dimensions={{
            width: props.vwDimensions.width,
            height: props.vwDimensions.height
          }}
          draw={draw}
        />
        <EditorInterface
          quit={() => {
            if (editor instanceof Editor) {
              // Do this so that we stop taking input.
              editor.pause()
            }

            editorState.current = constants.EDITOR_STATE.DO_NOT_START
            setEditor(null)
            props.closeEditor()
          }}
          openNewMapModal={() => {
            if (editor instanceof Editor) {
              pauseEditor()
            }

            props.openNewMapModal().then(createNewMap => {
              if (createNewMap) {
                debug('Creating new map.')
                editorState.current = constants.EDITOR_STATE.NOT_STARTED
                setEditor(null)
                return
              }

              if (editor instanceof Editor) {
                editorState.current = constants.EDITOR_STATE.RUNNING
                unpauseEditor()
              }
            })
          }}
          saveMap={() => {
            debug('Save map called')
            if (!(editor instanceof Editor)) {
              return
            }
            // Set the maximum amount of players in the map to the total of the
            // max players in each team.
            editor.mapConfig.maxPlayers = editor.mapConfig
              .allTeams()
              .map(team => team.maxPlayers)
              .reduce((acc, current) => acc + current)

            const exportedMapConf = new Blob([editor.mapConfig.exportAsJson()], {
              type: 'application/json;charset=utf-8'
            })
            saveAs(exportedMapConf, `${editor.mapConfig.mapName}.json`)
          }}
          loadMap={async () => {
            debug('Load map called')
            let config = null

            try {
              config = await loadMap()
            } catch (ex) {
              props.setError(ex)
            }

            if (config === null) {
              // No file is selected.
              return
            }
            props.setMapConfig(config)
            editorState.current = constants.EDITOR_STATE.NOT_STARTED
            setEditor(null)
          }}
          openMapTeamsModal={() => {
            pauseEditor()
            setTeamsModalOpen(true)
          }}
          openSettingsModal={() => {
            pauseEditor()
            setSettingsModalOpen(true)
          }}
          openGraphicsModal={() => {
            pauseEditor()
            setGraphicsModalOpen(true)
          }}
          openModifiersModal={() => {
            pauseEditor()
            setModifiersModalOpen(true)
          }}
          openPlayerConfigModal={() => {
            pauseEditor()
            setPlayerConfigModalOpen(true)
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
      <EditorModals
        mapConfig={editor?.mapConfig}
        forceUpdate={forceUpdate}
        teamsModal={{
          open: teamsModalOpen,
          setOpen: setTeamsModalOpen
        }}
        settingsModal={{
          open: settingsModalOpen,
          setOpen: setSettingsModalOpen
        }}
        graphicsModal={{
          open: graphicsModalOpen,
          setOpen: setGraphicsModalOpen
        }}
        modifiersModal={{
          open: modifiersModalOpen,
          setOpen: setModifiersModalOpen
        }}
        playerConfigModal={{
          open: playerConfigModalOpen,
          setOpen: setPlayerConfigModalOpen
        }}
        unsuspendEditor={unpauseEditor}
        setError={props.setError}
        vwDimensions={props.vwDimensions}
      />
    </>
  )
}
