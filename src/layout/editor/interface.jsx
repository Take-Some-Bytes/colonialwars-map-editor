/* eslint-env react */
/**
 * @fileoverview The map editor interface component.
 */

import React from 'react'

import EditorToolBar from './toolbar'

/**
 * @typedef {import('./toolbar').EditorToolBarProps} ToolbarProps
 *
 * @typedef {ToolbarProps} EditorInterfaceProps
 */

/**
 * The map editor interface component.
 * @param {EditorInterfaceProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function EditorInterface (props) {
  return (
    <>
      <EditorToolBar
        quit={props.quit}
        saveMap={props.saveMap}
        loadMap={props.loadMap}
        openNewMapModal={props.openNewMapModal}
        openMapTeamsModal={props.openMapTeamsModal}
        openSettingsModal={props.openSettingsModal}
        openGraphicsModal={props.openGraphicsModal}
      />
    </>
  )
}
