/* eslint-env react */
/**
 * @fileoverview React component that returns all the modals of
 * this application.
 */

import React from 'react'

import ErrorModal from './error-modal.jsx'
import NewMapModal from './new-map-modal.jsx'

/**
 * @typedef {Object} ModalsProps
 * @prop {Object} errorModalOpts
 * @prop {Error|null} errorModalOpts.error
 * @prop {React.Dispatch<any>} errorModalOpts.setError
 * @prop {Object} newMapModal
 * @prop {boolean} newMapModal.open
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} newMapModal.setOpen
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 */

/**
 * A ``React.Fragment`` of all the modals in this application.
 * @param {ModalsProps} props Component props.
 * @returns {JSX.Element}
 */
export default function Modals (props) {
  const modalPosition = {
    x: Math.round(props.vwDimensions.width / 2) - 550 / 2,
    y: Math.round(props.vwDimensions.height / 2) - 550 / 2
  }
  const error = props.errorModalOpts.error
  const setError = props.errorModalOpts.setError
  const { open: mapModalOpen, setOpen: setMapModalOpen, ...rest } = props.newMapModal

  return (
    <>
      <ErrorModal
        position={modalPosition}
        isOpen={error instanceof Error}
        closeModal={() => { setError(null) }}
        error={error || {}}
      />
      <NewMapModal
        isOpen={mapModalOpen}
        position={modalPosition}
        closeModal={() => setMapModalOpen(false)}
        {...rest}
      />
    </>
  )
}
