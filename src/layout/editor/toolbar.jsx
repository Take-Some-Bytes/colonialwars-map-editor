/* eslint-env react */
/**
 * @fileoverview EditorToolBar component to display the map editor's
 * toolbar.
 */

import React from 'react'
import debugFactory from 'debug'

import Menu from '../../components/menu'
import { SubMenu, MenuItem, useMenuState } from '@szhsin/react-menu'

const debug = debugFactory('cw-map-editor:toolbar')

/**
 * @typedef {Object} EditorToolBarProps
 * @prop {() => void} quit
 * @prop {() => void} saveMap
 * @prop {() => void} loadMap
 * @prop {() => void} openNewMapModal
 */

/**
 * EditorToolBar component to display the map editor's toolbar.
 * @param {EditorToolBarProps} props Component props.
 * @returns {JSX.Element}
 */
export default function EditorToolBar (props) {
  const menuStates = new Map([
    ['main-menu', useMenuState(true)],
    ['file-menu', useMenuState(true)]
    // ['menu-menu', ReactMenu.useMenuState(true)]
  ])

  function closeAllMenus () {
    menuStates.forEach(state => {
      state.closeMenu()
    })
  }
  function onQuit () {
    closeAllMenus()
    props.quit()
  }
  function onNewMap () {
    closeAllMenus()
    props.openNewMapModal()
  }
  function onSaveMap () {
    closeAllMenus()
    props.saveMap()
  }
  function onLoadMap () {
    closeAllMenus()
    debug('Load map clicked')
    // props.loadMap()
  }

  return (
    <div
      id='editor-toolbar'
      className='editor-toolbar'
    >
      <Menu
        name='main-menu'
        className='ui-content ui-content--light--no-hover ui-content--radius editor-toolbar__menu'
        buttonOpts={{
          content: (<img src='/imgs/hamburger.svg' width='50px' height='50px' />),
          className: 'editor-toolbar__button'
        }}
        menuState={menuStates.get('main-menu')}
        arrow
      >
        <MenuItem className='editor-toolbar__menu__item'>Keybindings...</MenuItem>
        <MenuItem className='editor-toolbar__menu__item'>Other Settings...</MenuItem>
        <MenuItem className='editor-toolbar__menu__item' onClick={onQuit}>Quit</MenuItem>
      </Menu>
      <Menu
        name='file-menu'
        className='ui-content ui-content--light--no-hover ui-content--radius editor-toolbar__menu'
        buttonOpts={{
          content: (<img src='/imgs/folder.svg' width='50px' height='50px' />),
          className: 'editor-toolbar__button'
        }}
        menuState={menuStates.get('file-menu')}
        arrow
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
    </div>
  )
}
