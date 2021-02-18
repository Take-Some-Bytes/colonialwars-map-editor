/* eslint-env react */
/**
 * @fileoverview Main application component.
 */

import React from 'react'

import Layout from './layout/layout.jsx'
import Header from './layout/header.jsx'
import Footer from './layout/footer.jsx'
import Content from './layout/content.jsx'
import NewMapModal from './layout/new-map-modal.jsx'
import MapEditorContainer from './layout/editor-container.jsx'

import * as mathUtils from './helpers/math-utils.js'
import * as fileUtils from './helpers/file-utils.js'

/**
 * Main component.
 * @returns {JSX.Element}
 */
export default function App () {
  const [page, setPage] = React.useState(0)
  const [mapConfig, setMapConfig] = React.useState({})
  const [newMapConfig, setNewMapConfig] = React.useState({
    size: {
      x: 60,
      y: 60
    },
    tileType: 'grass',
    defaultHeight: 0
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
          [target.name[5]]: mathUtils.bound(Number(target.value), 40, 120)
        }
      }))
    } else {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        [target.name]: !isNaN(Number(target.value))
          ? mathUtils.bound(target.value, 0, 2)
          : target.value
      }))
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
        }))
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
      <MapEditorContainer show={page === 1} viewportDimensions={viewportDimensions} />
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
    </Layout>
  )
}
