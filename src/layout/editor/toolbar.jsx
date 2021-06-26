/* eslint-env react */
/**
 * @fileoverview EditorToolBar component to display the map editor's
 * toolbar.
 */

import React from 'react'
import ReactTooltip from 'react-tooltip'
import debugFactory from 'debug'

import Menu from '../../components/menu'
import { SubMenu, MenuItem, useMenuState } from '@szhsin/react-menu'

const debug = debugFactory('cw-map-editor:toolbar')

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

/**
 * @typedef {Object} EditorToolBarProps
 * @prop {() => void} quit
 * @prop {() => void} saveMap
 * @prop {() => void} loadMap
 * @prop {() => void} openNewMapModal
 * @prop {() => void} openMapTeamsModal
 * @prop {() => void} openSettingsModal
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
      menu.closeMenu()
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
  const onQuit = closeMenusAnd(props.quit)
  const onNewMap = closeMenusAnd(props.openNewMapModal)
  const onSaveMap = closeMenusAnd(props.saveMap)
  const onLoadMap = closeMenusAnd(debug.bind(null, 'Load map clicked'))
  const onOpenMapTeams = closeMenusAnd(props.openMapTeamsModal)
  const onOpenSettings = closeMenusAnd(props.openSettingsModal)

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
          content: (<img src='/imgs/hamburger.svg' width='50px' height='50px' />),
          className: 'editor-toolbar__button'
        }}
        menuState={menuStates.get('options-menu')}
        arrow
        // React tooltip stuff.
        buttonProps={{
          'data-tip': 'Options',
          'data-for': 'options-tip'
        }}
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
          content: (<img src='/imgs/folder.svg' width='50px' height='50px' />),
          className: 'editor-toolbar__button'
        }}
        menuState={menuStates.get('file-menu')}
        arrow
        // React tooltip stuff.
        buttonProps={{
          'data-tip': 'File operations',
          'data-for': 'file-tip'
        }}
      >
        <MenuItem className='editor-toolbar__menu__item' onClick={onNewMap}>New Map...</MenuItem>
        <SubMenu
          label='Save'
          itemClassName='editor-toolbar__menu__submenu'
          className='ui-content ui-content--light--no-hover ui-content--radius editor-toolbar__menu'
          arrow
        >
          <MenuItem className='editor-toolbar__menu__item' onClick={onSaveMap}>Save Map...</MenuItem>
          <MenuItem className='editor-toolbar__menu__item'>Save Unit Data...</MenuItem>
          <MenuItem className='editor-toolbar__menu__item'>Save Building Data...</MenuItem>
        </SubMenu>
        <SubMenu
          label='Load'
          itemClassName='editor-toolbar__menu__submenu'
          className='ui-content ui-content--light--no-hover ui-content--radius editor-toolbar__menu'
          arrow
        >
          <MenuItem className='editor-toolbar__menu__item' onClick={onLoadMap}>Load Map...</MenuItem>
          <MenuItem className='editor-toolbar__menu__item'>Save Unit Data...</MenuItem>
          <MenuItem className='editor-toolbar__menu__item'>Save Building Data...</MenuItem>
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
        <img src='/imgs/flags.svg' width='50px' height='50px' />
      </button>
    </div>
  )
}
