/* eslint-env react */
/**
 * @fileoverview React component for the landing page of the map editor.
 */

import React from 'react'

import Header from '../header.jsx'
import Footer from '../footer.jsx'
import Content from '../content.jsx'

import { loadMap } from '../../helpers/loaders.js'

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
    let config
    e.preventDefault()
    e.stopPropagation()

    try {
      config = await loadMap()
      if (config === null) {
        // No file selected.
        return
      }
    } catch (ex) {
      setError(ex)
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
