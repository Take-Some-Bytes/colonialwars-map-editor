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
 * @prop {Record<'x'|'y', number>} position
 * @prop {import('../components/button').ButtonClickCallback} closeModal
 */

/**
 * The ``Error`` modal component. Use this only for user-okay error messages.
 * @param {ErrorModal} props Component props.
 * @returns {JSX.Element}
 */
export default function ErrorModal (props) {
  return (
    <CustomModal
      id='error-modal'
      isOpen={props.isOpen}
      headerContent='Error'
      dimensions={{
        width: 400,
        height: 400
      }}
      position={props.position}
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
