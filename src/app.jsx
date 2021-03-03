/* eslint-env react */
/**
 * @fileoverview Main application component.
 */

import React from 'react'

import Layout from './layout/layout.jsx'
import Header from './layout/header.jsx'
import Footer from './layout/footer.jsx'
import Content from './layout/content.jsx'
import ErrorModal from './layout/error-modal.jsx'
import NewMapModal from './layout/new-map-modal.jsx'
import MapEditorContainer from './layout/editor-container.jsx'

import Constants from './constants.js'

import * as mathUtils from './helpers/math-utils.js'
import * as fileUtils from './helpers/file-utils.js'

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
  const viewportDimensions = {
    width: (() => {
      if (window.innerWidth !== undefined) {
        const vw = window.innerWidth
        return vw
      }
      const vw = document.documentElement.clientWidth
      return vw
    })(),
    height: (() => {
      if (window.innerHeight !== undefined) {
        const vw = window.innerHeight
        return vw
      }
      const vw = document.documentElement.clientHeight
      return vw
    })()
  }

  /**
   * Handles a change in the new map modal/form.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e The
   * event that happened.
   */
  function handleNewMapFormChange (e) {
    const target = e.target
    if (target.name === 'size.x' || target.name === 'size.y') {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        size: {
          ...prevConfig.size,
          [target.name[5]]: mathUtils.bound(
            Number(target.value),
            Constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE,
            Constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE
          )
        }
      }))
    } else {
      setNewMapConfig(prevConfig => {
        return ({
          ...prevConfig,
          [target.name]: !isNaN(Number(target.value))
            ? mathUtils.bound(
                Number(target.value),
                Constants.MAP_CONFIG_LIMITS.MIN_DEFAULT_HEIGHT,
                Constants.MAP_CONFIG_LIMITS.MAX_DEFAULT_HEIGHT
              )
            : target.value
        })
      })
    }
  }
  /**
   * Called when the client clicks the ``OK`` button in the New Map modal.
   * @param {React.MouseEvent<HTMLButtonElement>} e The event that happened.
   */
  function onOkButtonClick (e) {
    e.stopPropagation()
    e.preventDefault()
    setPage(1)
    setMapConfig({
      configType: 'game-config',
      meta: {
        worldLimits: Object.fromEntries(Object.entries(newMapConfig.size).map(entry => {
          return [entry[0], entry[1] * 100]
        })),
        tileType: newMapConfig.tileType,
        defaultHeight: newMapConfig.defaultHeight
      }
    })
    setNewMapModalOpened(false)
  }

  return (
    <Layout
      id='app-layout'
      className={page === 0 ? 'space-between' : ''}
      style={{
        padding: page === 0 ? '12%' : '0',
        minHeight: page === 0 ? '100%' : '0',
        height: page === 0 ? '0' : '100%'
      }}
    >
      <Header show={page === 0} />
      <Content
        buttonHandlers={{
          handleNewMap: e => {
            e.preventDefault()
            e.stopPropagation()
            setNewMapModalOpened(true)
          },
          handleLoadMap: async e => {
            let rawData = null
            let data = null
            e.preventDefault()
            e.stopPropagation()
            try {
              rawData = new Uint8Array(
                (await fileUtils.readFiles(await fileUtils.openFile({
                  acceptedTypes: 'application/json',
                  multiple: false
                })))[0].contents
              )
              data = JSON.parse(new TextDecoder('utf-8').decode(rawData))
              if (data.configType !== 'game-config') {
                setError(new TypeError('Invalid configuration file!'))
                return
              }
              setMapConfig(data)
              setPage(1)
            } catch (err) {
              console.error(err)
            }
          }
        }}
        show={page === 0}
      />
      <Footer version={import.meta.env.SNOWPACK_PUBLIC_VERSION} show={page === 0} />
      <MapEditorContainer
        show={page === 1}
        mapConfig={mapConfig}
        keyBindings={{
          basic: {
            directionBindings: {
              up: ['w', 'W'],
              down: ['s', 'S'],
              left: ['a', 'A'],
              right: ['d', 'D']
            }
          }
        }}
        viewportDimensions={viewportDimensions}
      />
      <NewMapModal
        isOpen={newMapModalOpened}
        position={{
          x: Math.round(viewportDimensions.width / 2) - 400 / 2,
          y: Math.round(viewportDimensions.height / 2) - 400 / 2
        }}
        closeModal={() => { setNewMapModalOpened(false) }}
        inputFieldValues={newMapConfig}
        onChange={handleNewMapFormChange}
        onOkButtonClick={onOkButtonClick}
      />
      <ErrorModal
        isOpen={error instanceof Error}
        position={{
          x: Math.round(viewportDimensions.width / 2) - 400 / 2,
          y: Math.round(viewportDimensions.height / 2) - 400 / 2
        }}
        closeModal={() => { setError(null) }}
        error={error === null ? {} : error}
      />
    </Layout>
  )
}
