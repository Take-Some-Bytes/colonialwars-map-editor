/* eslint-env react */
/**
 * @fileoverview Main content of the application.
 */

import React from 'react'

import Button from '../components/button.jsx'

/**
 * @callback ButtonCallback
 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
 * @returns {void}
 *
 * @typedef {'handleNewMap'|'handleLoadMap'} ButtonNames
 * @typedef {Record<ButtonNames, ButtonCallback>} ButtonCallbacks
 * @typedef {Object} ContentProps
 * @prop {ButtonCallbacks} buttonHandlers
 */

/**
 * Main content component.
 * @param {ContentProps} props Component props.
 * @returns {JSX.Element}
 */
export default function Content (props) {
  return (
    <article id='home-content-container'>
      <header>
        <h2>Either create a new map, or load an existing one from your computer.</h2>
      </header>
      <div className='column'>
        <Button id='new-map-button' onClick={props.buttonHandlers.handleNewMap}>
          New map...
        </Button>
        <Button id='load-map-button' onClick={props.buttonHandlers.handleLoadMap}>
          Load map...
        </Button>
      </div>
    </article>
  )
}
