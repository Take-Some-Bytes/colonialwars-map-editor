/* eslint-env react */
/**
 * @fileoverview React component for the ``Error`` modal.
 */

import React from 'react'

import CustomModal, { ModalPriority } from '../../components/custom-modal.jsx'

import constants from '../../constants.js'
import { centerPos } from '../../helpers/display-utils.js'

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
  const dimensions = {
    width: constants.ROOT_FONT_SIZE * 20,
    height: constants.ROOT_FONT_SIZE * 20
  }
  const position = centerPos(dimensions, props.vwDimensions)

  return (
    <CustomModal
      id='error-modal'
      isOpen={props.isOpen}
      headerContent='Error'
      dimensions={dimensions}
      position={position}
      priority={ModalPriority.Critical}
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
