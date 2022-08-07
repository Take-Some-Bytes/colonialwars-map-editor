/* eslint-env react */
/**
 * @fileoverview Main application component.
 */

import React from 'react'
import debugFactory from 'debug'

import * as mathUtils from 'colonialwars-lib/math'
import { MutableMapConfig } from 'colonialwars-lib/mapconfig'

import Layout from './layout/layout.jsx'
import Modals from './layout/modals/index.jsx'
import LandingPage from './layout/pages/landing.jsx'
import EditorContainer from './layout/editor-container.jsx'

import Constants from './constants.js'

import { ViewportDimensions } from './helpers/display-utils.js'
import { loadKeybindings } from './helpers/loaders.js'

const debug = debugFactory('cw-map-editor:main-app')

/**
 * @callback NewMapFormCB
 * @param {T extends React.SyntheticEvent ? T : never} e
 * @returns {void}
 * @template T
 */

/**
 * Handles a change in the new map modal/form.
 * @param {React.Dispatch<React.SetStateAction<{
 *  mode: string;
 *  defaultHeight: number;
 *  tileType: string;
 *  size: {
 *   x: number;
 *   y: number;
 *  };
 *  dataFiles: {
 *   unit: string;
 *   building: string;
 *   graphics: string;
 *  };
 * }>>} setNewMapConfig Function to set a new map config.
 * @returns {NewMapFormCB<React.ChangeEvent<HTMLInputElement|HTMLSelectElement>>}
 */
function onNewMapConfigChange (setNewMapConfig) {
  return e => {
    const target = e.target
    if (target.name === 'size.x' || target.name === 'size.y') {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        size: {
          ...prevConfig.size,
          [target.name[5]]: target.value
        }
      }))
    } else if (target.name.startsWith('dataFiles')) {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        dataFiles: {
          ...prevConfig.dataFiles,
          [target.name.slice(10)]: target.value
        }
      }))
    } else {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        [target.name]: target.value
      }))
    }
  }
}
/**
 * Handles an input blur in the new map modal/form.
 * @param {React.Dispatch<React.SetStateAction<{
 *  mode: string;
 *  defaultHeight: number;
 *  tileType: string;
 *  size: {
 *   x: number;
 *   y: number;
 *  };
 *  dataFiles: {
 *   unit: string;
 *   building: string;
 *   graphics: string;
 *  };
 * }>>} setNewMapConfig Function to set a new map config.
 * @returns {NewMapFormCB<React.FocusEvent<HTMLInputElement|HTMLSelectElement>>}
 */
function onNewMapConfigBlur (setNewMapConfig) {
  return e => {
    const target = e.target
    // This function is mainly to bound the number inputs to
    // their respective minimums and maximums.
    if (target.name === 'size.x' || target.name === 'size.y') {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        size: {
          ...prevConfig.size,
          [target.name[5]]: mathUtils.bound(
            Math.round(Number(target.value)),
            Constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE,
            Constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE
          )
        }
      }))
    } else if (target.name === 'defaultHeight') {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        defaultHeight: mathUtils.bound(
          Math.round(Number(target.value)),
          Constants.MAP_CONFIG_LIMITS.MIN_DEFAULT_HEIGHT,
          Constants.MAP_CONFIG_LIMITS.MAX_DEFAULT_HEIGHT
        )
      }))
    }
  }
}

/**
 * Main component.
 * @returns {JSX.Element}
 */
export default function App () {
  const [page, setPage] = React.useState(0)
  const [error, setError] = React.useState(null)
  const [mapConfig, setMapConfig] = React.useState({})
  const [newMapConfig, setNewMapConfig] = React.useState({
    ...Constants.FALLBACKS.STARTING_MAP_CONFIG
  })
  const [newMapModalOpened, setNewMapModalOpened] = React.useState(false)
  const newMapPromiseRef = React.useRef(null)

  const viewportDimensions = new ViewportDimensions()
  const handleNewMapFormBlur = onNewMapConfigBlur(setNewMapConfig)
  const handleNewMapFormChange = onNewMapConfigChange(setNewMapConfig)

  /**
   * Called when the client clicks the ``OK`` button in the New Map modal.
   * @param {React.MouseEvent<HTMLButtonElement>} e The event that happened.
   */
  function onOkButtonClick (e) {
    const config = MutableMapConfig.createNew({
      mode: newMapConfig.mode,
      tileType: newMapConfig.tileType,
      defaultHeight: newMapConfig.defaultHeight,
      dataFiles: newMapConfig.dataFiles,
      worldLimits: {
        x: newMapConfig.size.x * 100,
        y: newMapConfig.size.y * 100
      }
    })

    debug('New map config: %O', config)

    e.stopPropagation()
    e.preventDefault()
    // If the editor is waiting on the new map modal, tell it to stop, since
    // we're creating a new map.
    if (typeof newMapPromiseRef.current === 'function') {
      debug('OK button clicked')
      newMapPromiseRef.current(true)
      newMapPromiseRef.current = null
    }

    setPage(1)
    setMapConfig(config)
    setNewMapModalOpened(false)
  }
  function closeEditor () {
    setPage(0)
    setError(null)
    setMapConfig({})
    setNewMapModalOpened(false)
  }

  const rootClassNames = []
  if (page === 0) {
    rootClassNames.push('space-between')
    rootClassNames.push('root--home')
  } else {
    rootClassNames.push('root--editor')
  }

  return (
    <Layout
      id='app-layout'
      className={rootClassNames.join(' ')}
    >
      <LandingPage
        visible={page === 0}
        setPage={setPage}
        setError={setError}
        setMapConfig={setMapConfig}
        setNewMapModalOpened={setNewMapModalOpened}
      />
      <EditorContainer
        show={page === 1}
        mapConfig={mapConfig}
        keyBindings={loadKeybindings()}
        vwDimensions={viewportDimensions}
        closeEditor={closeEditor}
        openNewMapModal={() => {
          return new Promise(resolve => {
            newMapPromiseRef.current = resolve
            debug('Opening new map modal')
            setNewMapModalOpened(true)
            debug('New map modal opened')
          })
        }}
        setError={setError}
        setMapConfig={setMapConfig}
      />
      <Modals
        errorModalOpts={{
          error,
          setError
        }}
        newMapModal={{
          open: newMapModalOpened,
          setOpen: isOpen => {
            // If the editor is waiting on the new map modal, tell it to keep going.
            if (typeof newMapPromiseRef.current === 'function' && !isOpen) {
              debug('Closing new map modal')
              newMapPromiseRef.current(false)
              newMapPromiseRef.current = null
            }

            setNewMapModalOpened(isOpen)
          },
          inputFieldValues: newMapConfig,
          onBlur: handleNewMapFormBlur,
          onChange: handleNewMapFormChange,
          onOkButtonClick
        }}
        vwDimensions={viewportDimensions}
      />
    </Layout>
  )
}
