/* eslint-env react */
/**
 * @fileoverview A React Menu component that internally uses ``@szhsin/react-menu``
 * to create menus which follow the UI style of this app.
 */

import React from 'react'

import { ControlledMenu } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/core.css'

/**
 * @typedef {Object} ButtonOpts
 * @prop {JSX.Element|string} content What content is inside the button.
 * @prop {string} className The CSS classes to apply to the button.
 * @prop {React.CSSProperties} style Any styles to apply to the button.
 *
 * @typedef {Object} MenuProps
 * @prop {string} name A unique name for this Menu.
 * @prop {boolean} arrow Whether to have an arrow when this Menu is opened.
 * @prop {React.ReactNode} children The stuff that's in the Menu.
 * @prop {string} className The CSS classes to apply to this Menu.
 * @prop {React.CSSProperties} style Any styles to apply to this Menu.
 * @prop {ButtonOpts} buttonOpts Options for the button that opens this Menu.
 * @prop {ReturnType<import('@szhsin/react-menu').useMenuState>} menuState
 * @prop {{}} buttonProps Any props for the menu button.
 * @prop {VoidFunction} onOpen Function to call when this menu is opened.
 * @prop {VoidFunction} onClose Function to call when this menu is closed.
 */

const MenuStates = Object.freeze({
  OPENING: 'opening',
  CLOSING: 'closing',
  CLOSED: 'closed',
  OPEN: 'open'
})

/**
 * The Menu component returns a menu constructed using the ``@szhshin/react-menu``
 * module and a button to open that menu.
 * @param {MenuProps} props Component props.
 * @returns {JSX.Element}
 */
export default function Menu (props) {
  const menuState = props.menuState
  const menuButtonRef = React.useRef(null)
  const onOpen = props.onOpen || (() => {})
  const onClose = props.onClose || (() => {})

  /**
   * Handler for the ``click`` event of the menu button.
   */
  function onMenuButtonClick () {
    if (menuState.state === MenuStates.OPEN) {
      menuState.toggleMenu(false)
      onClose()
    } else {
      menuState.toggleMenu(true)
      onOpen()
    }
  }

  return (
    <>
      <button
        ref={menuButtonRef}
        id={`${props.name}-button`}
        className={props.buttonOpts.className}
        style={props.buttonOpts.style}
        onClick={onMenuButtonClick}
        {...props.buttonProps}
      >
        {props.buttonOpts.content}
      </button>

      <ControlledMenu
        id={props.name}
        menuStyles={props.style}
        menuClassName={props.className}
        anchorRef={menuButtonRef}
        state={menuState.state}
        arrow={props.arrow}
      >
        {props.children}
      </ControlledMenu>
    </>
  )
}
