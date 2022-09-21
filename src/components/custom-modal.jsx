/* eslint-env react */
/**
 * @fileoverview Custom modal component.
 */

import React from 'react'
import Modal from 'react-modal'

import DeleteButton from './del-button.jsx'

/**
 * @typedef {Record<'width'|'height', number>} Dimensions
 * @typedef {Record<'x'|'y', number>} Position
 *
 * @typedef {Object} CustomModalProps
 * @prop {string} id
 * @prop {boolean} isOpen
 * @prop {Dimensions} dimensions
 * @prop {Position} position
 * @prop {string} headerContent
 * @prop {number} priority
 * @prop {{}} children
 * @prop {{}} footerContent
 * @prop {import('./button').ButtonClickCallback} onCloseRequest
 */

Modal.setAppElement('#root')

/**
 * The priority of a modal.
 *
 * This determines if the modal gets to be placed over other modals.
 */
export const ModalPriority = {
  Low: 99,
  Normal: 100,
  High: 101,
  Critical: 200
}

/**
 * Custom modal component. Utilizes the ``Modal`` component from ``react-modal``
 * to create a draggable and better looking (IMO) modal.
 * @param {CustomModalProps} props Component props.
 * @returns {JSX.Element}
 */
export default function CustomModal (props) {
  const priority = props.priority || ModalPriority.Normal

  return (
    <Modal
      id={props.id}
      isOpen={props.isOpen}
      className='custom-modal-container ui-content'
      overlayClassName='custom-modal-overlay'
      style={{
        overlay: {
          zIndex: priority - 1
        },
        content: {
          width: `${props.dimensions.width}px`,
          height: `${props.dimensions.height}px`,
          zIndex: priority
        }
      }}
    >
      <header id={`${props.id}-dialog-header`} className='custom-modal-header'>
        <span id={`${props.id}-dialog-header-span`} className='custom-modal-header-span'>
          <h3>{props.headerContent}</h3>
        </span>
        <DeleteButton
          id={`${props.id}-dialog-close-button`}
          onClick={props.onCloseRequest}
          buttonStyle={{
            position: 'absolute',
            top: '25%',
            right: '1em'
          }}
        />
      </header>
      <div id={`${props.id}-dialog-content`} className='custom-modal-content'>
        {props.children}
      </div>
      <footer id={`${props.id}-dialog-footer`} className='custom-modal-footer ui-content'>
        {props.footerContent}
      </footer>
    </Modal>
  )
}
