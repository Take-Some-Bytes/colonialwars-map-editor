/* eslint-env react */
/**
 * @fileoverview React component for the landing page of the map editor.
 */

import React from 'react'
import debugFactory from 'debug'

import Header from '../header.jsx'
import Footer from '../footer.jsx'
import Content from '../content.jsx'

import * as fileUtils from '../../helpers/file-utils.js'
import MapConfig from '../../editor/map-config.js'

const debug = debugFactory('cw-map-editor:landing')

/**
 * @typedef {Object} LandingPageProps
 * @prop {boolean} visible
 * @prop {React.MouseEvent<HTMLButtonElement, MouseEvent>} loadMap
 * @prop {React.Dispatch<any>} setError
 * @prop {React.Dispatch<React.SetStateAction<number>>} setPage
 * @prop {React.Dispatch<React.SetStateAction<{}>>} setMapConfig
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setNewMapModalOpened
 */

/**
 * The LandingPage component, used to display the Colonial Wars Map
 * Editor's landing page.
 * @param {LandingPageProps} props Home page component props.
 * @returns {JSX.Element}
 */
export default function LandingPage (props) {
  const {
    visible,
    setError, setPage,
    setMapConfig, setNewMapModalOpened
  } = props

  /**
   * Function to call when the New Map button is pressed.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e The event object
   */
  function onNewMap (e) {
    e.preventDefault()
    e.stopPropagation()
    setNewMapModalOpened(true)
  }
  /**
   * Function to call when then Load Map button is pressed.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e The event object.
   */
  async function onLoadMap (e) {
    let fileStats
    let config
    e.preventDefault()
    e.stopPropagation()

    try {
      const [file] = await fileUtils.openFiles({
        acceptedTypes: 'application/json',
        multiple: false
      })
      // Do not allow files over 2.5MB
      if (file.size > 25 * 1024 * 1024) {
        throw new RangeError('File too large!')
      }

      /**
       * XXX: The below is an arcane style of array destructuring, in case you didn't know.
       * (05/16/2021) Take-Some-Bytes */
      ;[fileStats] = await fileUtils.readFiles([file])
    } catch (ex) {
      debug(ex.stack)
      if (ex.code !== 'ENOFILE') {
        setError(new Error('Failed to open configuration file!'))
      }
      return
    }

    try {
      config = new MapConfig(
        new TextDecoder().decode(new Uint8Array(fileStats.contents))
      )
    } catch (ex) {
      debug(ex.stack)
      setError(new Error(
        'Configuration file is invalid!' +
        ' Please do not mess with configuration files manually.'
      ))
      return
    }

    setMapConfig(config)
    setPage(1)
    setNewMapModalOpened(false)
  }

  return (
    <>
      <Header show={visible} />
      <Content
        buttonHandlers={{
          handleNewMap: onNewMap,
          handleLoadMap: onLoadMap
        }}
        show={visible}
      />
      <Footer version={import.meta.env.SNOWPACK_PUBLIC_VERSION} show={visible} />
    </>
  )
}
