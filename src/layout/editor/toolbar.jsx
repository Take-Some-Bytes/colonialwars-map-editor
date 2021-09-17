/* eslint-env react */
/**
 * @fileoverview EditorToolBar component to display the map editor's
 * toolbar.
 */

import React from 'react'
import ReactTooltip from 'react-tooltip'
// import debugFactory from 'debug'

import Menu from '../../components/menu'
import { SubMenu, MenuItem, useMenuState } from '@szhsin/react-menu'

import constants from '../../constants.js'

// const debug = debugFactory('cw-map-editor:toolbar')

/**
 * @type {Partial<import('react-tooltip').TooltipProps>}
 */
const DEFAULT_TOOLTIP_PROPS = {
  place: 'bottom',
  effect: 'solid',
  insecure: false,
  delayShow: 1200,
  className: 'ui-tooltip'
}

const BUTTON_SIZE = {
  width: `${constants.ROOT_FONT_SIZE * 2.5}px`,
  height: `${constants.ROOT_FONT_SIZE * 2.5}px`
}

/**
 * @typedef {Object} EditorToolBarProps
 * @prop {VoidFunction} quit
 * @prop {VoidFunction} saveMap
 * @prop {VoidFunction} loadMap
 * @prop {VoidFunction} openNewMapModal
 * @prop {VoidFunction} openMapTeamsModal
 * @prop {VoidFunction} openSettingsModal
 * @prop {VoidFunction} openGraphicsModal
 */

/**
 * EditorToolBar component to display the map editor's toolbar.
 * @param {EditorToolBarProps} props Component props.
 * @returns {JSX.Element}
 */
export default function EditorToolBar (props) {
  const menuStates = new Map([
    ['options-menu', useMenuState(true)],
    ['file-menu', useMenuState(true)]
  ])

  function closeAllMenus () {
    menuStates.forEach(menu => {
      menu.toggleMenu(false)
    })
  }
  /**
   * Returns a function that closes all menus and then
   * calls the specified function
   * @param {() => void} fn The function to call.
   * @returns {() => void}
   */
  function closeMenusAnd (fn) {
    return () => {
      closeAllMenus()
      fn()
    }
  }
  /**
   * Create a function that closes all menus except for the menu with
   * the specified ID.
   * @param {string} menuName The name of the menu.
   * @returns {VoidFunction}
   */
  function createOnMenuOpen (menuName) {
    return () => {
      for (const [id, menu] of menuStates.entries()) {
        if (id === menuName) {
          // Do not close this menu.
          continue
        }
        menu.toggleMenu(false)
      }
    }
  }

  const onQuit = closeMenusAnd(props.quit)
  const onNewMap = closeMenusAnd(props.openNewMapModal)
  const onSaveMap = closeMenusAnd(props.saveMap)
  const onLoadMap = closeMenusAnd(props.loadMap)
  const onOpenMapTeams = closeMenusAnd(props.openMapTeamsModal)
  const onOpenSettings = closeMenusAnd(props.openSettingsModal)
  const onOpenGraphics = closeMenusAnd(props.openGraphicsModal)

  return (
    <div
      id='editor-toolbar'
      className='editor-toolbar'
      // Don't let the editor's input tracker get the mousedown
      // event--it belongs to us >:)
      onMouseDown={e => e.stopPropagation()}
    >
      <ReactTooltip id='options-tip' {...DEFAULT_TOOLTIP_PROPS} />
      <Menu
        name='options-menu'
        className='ui-content ui-content--light--no-hover ui-content--radius editor-toolbar__menu'
        buttonOpts={{
          content: (
            <img
              src='/imgs/hamburger.svg'
              width={BUTTON_SIZE.width}
              height={BUTTON_SIZE.height}
            />),
          className: 'editor-toolbar__button'
        }}
        menuState={menuStates.get('options-menu')}
        arrow
        // React tooltip stuff.
        buttonProps={{
          'data-tip': 'Options',
          'data-for': 'options-tip'
        }}
        onOpen={createOnMenuOpen('options-menu')}
      >
        <MenuItem className='editor-toolbar__menu__item'>Keybindings...</MenuItem>
        <MenuItem className='editor-toolbar__menu__item' onClick={onOpenSettings}>Map Settings...</MenuItem>
        <MenuItem className='editor-toolbar__menu__item' onClick={onQuit}>Quit</MenuItem>
      </Menu>
      <ReactTooltip id='file-tip' {...DEFAULT_TOOLTIP_PROPS} />
      <Menu
        name='file-menu'
        className='ui-content ui-content--light--no-hover ui-content--radius editor-toolbar__menu'
        buttonOpts={{
          content: (
            <img
              src='/imgs/folder.svg'
              width={BUTTON_SIZE.width}
              height={BUTTON_SIZE.height}
            />),
          className: 'editor-toolbar__button'
        }}
        menuState={menuStates.get('file-menu')}
        arrow
        // React tooltip stuff.
        buttonProps={{
          'data-tip': 'File operations',
          'data-for': 'file-tip'
        }}
        onOpen={createOnMenuOpen('file-menu')}
      >
        <MenuItem className='editor-toolbar__menu__item' onClick={onNewMap}>New Map...</MenuItem>
        <SubMenu
          label='Save'
          itemProps={{
            className: 'editor-toolbar__menu__submenu'
          }}
          // itemClassName='editor-toolbar__menu__submenu'
          menuClassName='ui-content ui-content--light--no-hover ui-content--radius editor-toolbar__menu'
          arrow
        >
          <MenuItem className='editor-toolbar__menu__item' onClick={onSaveMap}>Save Map...</MenuItem>
          <MenuItem className='editor-toolbar__menu__item'>Save Unit Data...</MenuItem>
          <MenuItem className='editor-toolbar__menu__item'>Save Building Data...</MenuItem>
        </SubMenu>
        <SubMenu
          label='Load'
          itemProps={{
            className: 'editor-toolbar__menu__submenu'
          }}
          // itemClassName='editor-toolbar__menu__submenu'
          menuClassName='ui-content ui-content--light--no-hover ui-content--radius editor-toolbar__menu'
          arrow
        >
          <MenuItem className='editor-toolbar__menu__item' onClick={onLoadMap}>Load Map...</MenuItem>
          <MenuItem className='editor-toolbar__menu__item'>Load Unit Data...</MenuItem>
          <MenuItem className='editor-toolbar__menu__item'>Load Building Data...</MenuItem>
        </SubMenu>
      </Menu>
      <ReactTooltip id='teams-tip' {...DEFAULT_TOOLTIP_PROPS} />
      <button
        name='teams-modal-open'
        className='editor-toolbar__button'
        data-tip='Map teams'
        data-for='teams-tip'
        onClick={onOpenMapTeams}
      >
        <img
          src='/imgs/flags.svg'
          width={BUTTON_SIZE.width}
          height={BUTTON_SIZE.height}
        />
      </button>
      <ReactTooltip id='graphics-tip' {...DEFAULT_TOOLTIP_PROPS} />
      <button
        name='graphics-modal-open'
        className='editor-toolbar__button'
        data-tip='Map graphics'
        data-for='graphics-tip'
        onClick={onOpenGraphics}
      >
        <img
          src='/imgs/graphics.svg'
          width={BUTTON_SIZE.width}
          height={BUTTON_SIZE.height}
        />
      </button>
    </div>
  )
}
