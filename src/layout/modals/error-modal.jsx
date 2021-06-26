/* eslint-env react */
/**
 * @fileoverview React component for the ``Error`` modal.
 */

import React from 'react'

import CustomModal from '../../components/custom-modal.jsx'

/**
 * @typedef {Object} ErrorModal
 * @prop {boolean} isOpen
 * @prop {Error} error The error to display.
 * @prop {import('../components/button').ButtonClickCallback} closeModal
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 */

/**
 * The ``Error`` modal component. Use this only for user-okay error messages.
 * @param {ErrorModal} props Component props.
 * @returns {JSX.Element}
 */
export default function ErrorModal (props) {
  const dimensions = { width: 400, height: 400 }
  const position = {
    x: Math.round(
      props.vwDimensions.width / 2
    ) - dimensions.width / 2,
    y: Math.round(
      props.vwDimensions.height / 2
    ) - dimensions.height / 2
  }

  return (
    <CustomModal
      id='error-modal'
      isOpen={props.isOpen}
      headerContent='Error'
      dimensions={dimensions}
      position={position}
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        props.closeModal()
      }}
    >
      An Error occured: {props.error.message}
    </CustomModal>
  )
}
