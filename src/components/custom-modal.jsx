/* eslint-env react */
/**
 * @fileoverview Custom modal component.
 */

import React from 'react'
import Modal from 'react-modal'
import Draggable from 'react-draggable'

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
 * @prop {{}} children
 * @prop {{}} footerContent
 * @prop {import('./button').ButtonClickCallback} onCloseRequest
 */

Modal.setAppElement('#root')

/**
 * Custom modal component. Utilizes the ``Modal`` component from ``react-modal``
 * to create a draggable and better looking (IMO) modal.
 * @param {CustomModalProps} props Component props.
 * @returns {JSX.Element}
 */
export default function CustomModal (props) {
  const nodeRef = React.useRef(null)
  return (
    <Modal
      id={props.id}
      isOpen={props.isOpen}
      className='hide-modal'
      overlayClassName='custom-modal-overlay'
      style={{
        content: {
          width: `${props.dimensions.width}px`,
          height: `${props.dimensions.height}px`,
          left: `${props.position.x}px`,
          top: `${props.position.y}px`,
          boxSizing: 'content-box'
        }
      }}
      shouldFocusAfterRender={false}
    >
      <Draggable bounds='body' handle={`#${props.id}-dialog-header`} nodeRef={nodeRef}>
        <section
          className='custom-modal-container ui-content'
          style={{
            width: `${props.dimensions.width}px`,
            height: `${props.dimensions.height}px`,
            left: `${props.position.x}px`,
            top: `${props.position.y}px`
          }}
          ref={nodeRef}
        >
          <>
            <header id={`${props.id}-dialog-header`} className='custom-modal-header ui-cursor-draggable'>
              <span id={`${props.id}-dialog-header-span`} className='custom-modal-header-span'>
                <h3>{props.headerContent}</h3>
              </span>
              <button
                id={`${props.id}-dialog-close-button`}
                className='custom-modal-close-button'
                onClick={props.onCloseRequest}
              >
                <span id={`${props.id}-dialog-close-span`} className='custom-modal-close-span'>
                  &times;
                </span>
              </button>
            </header>
            <div id={`${props.id}-dialog-content`} className='custom-modal-content'>
              {props.children}
            </div>
            <footer id={`${props.id}-dialog-footer`} className='custom-modal-footer ui-content'>
              {props.footerContent}
            </footer>
          </>
        </section>
      </Draggable>
    </Modal>
  )
}
