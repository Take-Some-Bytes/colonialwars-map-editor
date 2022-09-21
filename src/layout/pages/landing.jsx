/* eslint-env react */
/**
 * @fileoverview React component for the landing page of the map editor.
 */

import React from 'react'

import { useNavigate } from 'react-router-dom'

import Button from '../../components/button.jsx'

import constants from '../../constants.js'
import { loadMap } from '../../helpers/loaders.js'

/**
 * @typedef {Object} LandingPageProps
 * @prop {React.Dispatch<any>} setError
 * @prop {React.Dispatch<React.SetStateAction<any>>} setMapConfig
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
    setError, setMapConfig, setNewMapModalOpened
  } = props

  const navigate = useNavigate()

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
    setNewMapModalOpened(false)

    navigate('/editor')
  }

  return (
    <>
      <header id='home-header-container'>
        <h1>Colonial Wars Map Editor</h1>
      </header>
      <main id='home-content-container'>
        <header>
          <h2>Either create a new map, or load an existing one from your computer.</h2>
        </header>
        <div className='column'>
          <Button id='new-map-button' onClick={onNewMap}>
            New map...
          </Button>
          <Button id='load-map-button' onClick={onLoadMap}>
            Load map...
          </Button>
        </div>
      </main>
      <footer id='home-footer-container'>
        Version {constants.VERSION}.
      </footer>
    </>
  )
}
