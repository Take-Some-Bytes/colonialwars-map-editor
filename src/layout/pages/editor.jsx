/* eslint-env react, browser */
/**
 * @fileoverview The map editor container component.
 */

import React from 'react'
import debugFactory from 'debug'

import { saveAs } from 'file-saver'

import Loading from '../../components/loading.jsx'

import EditorModals, { useEditorModalState } from './editor/modals.jsx'
import EditorInterface from './editor/interface.jsx'

import { useForceUpdate } from '../../helpers/hooks.js'

import Editor from '../../editor/editor.js'

const debug = debugFactory('cw:editor:editor-page')

const loadingElem = (
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
  </div>
)

/**
 * @typedef {Object} EditorContainerProps
 * @prop {() => void} closeEditor
 * @prop {() => Promise<boolean>} loadMap
 * @prop {React.Dispatch<any>} setError
 * @prop {Record<string, any>} mapConfig
 * @prop {Record<string, string>} keyBindings
 * @prop {() => Promise<boolean>} openNewMapModal
 * @prop {React.Dispatch<React.SetStateAction<{}>>} setMapConfig
 * @prop {import('../../components/custom-modal').Dimensions} vwDimensions
 */

/**
 * The editor page.
 * @param {EditorContainerProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function EditorPage (props) {
  /** @type {[Editor, React.Dispatch<React.SetStateAction<Editor>>]} */
  const [editor, setEditor] = React.useState(null)
  const [editorLoading, setEditorLoading] = React.useState(true)

  const canvasRef = React.useRef(null)

  const forceUpdate = useForceUpdate()
  const [isModalOpen, setModalOpen] = useEditorModalState()

  React.useEffect(() => {
    if (editor instanceof Editor) {
      return
    }
    if (!(canvasRef.current instanceof HTMLCanvasElement)) {
      return
    }

    const ctx = canvasRef.current.getContext('2d')

    canvasRef.current.height = props.vwDimensions.height
    canvasRef.current.width = props.vwDimensions.width

    setEditorLoading(true)
    Editor.create(props.mapConfig, props.keyBindings, ctx, props.vwDimensions)
      .then(edtr => {
        setEditor(edtr)
        // editorState.current = constants.EDITOR_STATE.RUNNING
        setEditorLoading(false)

        edtr.start()
      })
      .catch(ex => {
        console.error(ex.stack)
        // editorState.current = constants.EDITOR_STATE.HAD_ERROR
      })

    return () => {
      if (editor instanceof Editor) {
        editor.stop()
      }
    }
  }, [props.mapConfig])

  return (
    <main className='editor-container'>
      {editorLoading && loadingElem}
      <canvas className='editor-canvas' ref={canvasRef} />
      <EditorInterface
        quit={() => {
          editor.pause()
          setEditor(null)
          props.closeEditor()
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
            .reduce((acc, current) => acc + current, 0)

          const exportedMapConf = new Blob([editor.mapConfig.exportAsJson()], {
            type: 'application/json;charset=utf-8'
          })
          saveAs(exportedMapConf, `${editor.mapConfig.mapName}.json`)
        }}
        loadMap={() => {
          debug('Load map called')

          props.loadMap().then(newMapPicked => {
            if (newMapPicked) {
              setEditor(null)
              setEditorLoading(true)
            }
          })
        }}
        openModal={modal => {
          editor.pause()

          setModalOpen(modal, true)
        }}
        openNewMapModal={() => {
          editor.pause()

          props.openNewMapModal().then(createNewMap => {
            if (createNewMap) {
              setEditor(null)
              return
            }

            editor.unpause()
          })
        }}
      />
      <EditorModals
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        forceUpdate={forceUpdate}
        setError={props.setError}
        mapConfig={props.mapConfig}
        vwDimensions={props.vwDimensions}
        unpauseEditor={editor?.unpause?.bind?.(editor)}
      />
    </main>
  )
}
