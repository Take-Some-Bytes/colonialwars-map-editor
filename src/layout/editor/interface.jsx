/* eslint-env react */
/**
 * @fileoverview The map editor interface component.
 */

import React from 'react'

import EditorToolBar from './toolbar'

/**
 * @typedef {Object} EditorInterfaceProps
 * @prop {import('../../components/custom-modal').Dimensions} dimensions
 * @prop {() => void} quit
 * @prop {() => void} saveMap
 * @prop {() => void} openNewMapModal
 */

/**
 * The map editor interface component.
 * @param {EditorInterfaceProps} props Props for this component.
 * @returns {JSX.Element}
 */
export default function EditorInterface (props) {
  return (
    <>
      <EditorToolBar {...props} />
    </>
  )
}
