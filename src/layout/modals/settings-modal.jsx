/* eslint-env react */
/**
 * @fileoverview React component that renders the ``Settings`` modal, which allows
 * the user to specify general map settings.
 */

import React from 'react'

import CustomModal from '../../components/custom-modal.jsx'

import constants from '../../constants.js'

import { centerPos } from '../../helpers/math-utils.js'

/**
 * @typedef {Object} SettingsModalProps
 * @prop {boolean} isOpen
 * @prop {() => void} closeModal
 * @prop {() => void} unsuspendEditor
 * @prop {React.DispatchWithoutAction} forceUpdate
 * @prop {import('../../editor/map-config').default} mapConfig
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 */

/**
 * Renders a modal that allows users to specify general map settings.
 * @param {SettingsModalProps} props Component props.
 */
export default function SettingsModal (props) {
  const dimensions = {
    width: constants.ROOT_FONT_SIZE * 32.5,
    height: constants.ROOT_FONT_SIZE * 25
  }
  const position = centerPos(dimensions, props.vwDimensions)

  /**
   * Handle the input change event.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e The DOM event.
   */
  function onChange (e) {
    if (e.target.name === 'mapName') {
      try {
        props.mapConfig.mapName = e.target.value
      } catch (ex) {
        // Invalid character in map name, ignore.
        return
      }
    } else if (e.target.name === 'mapDescription') {
      props.mapConfig.description = String(
        e.target.value
      ).slice(0, constants.MAP_CONFIG_LIMITS.MAX_MAP_DESC_LEN)
    }

    props.forceUpdate()
  }
  /**
   * Handle the blur event.
   * @param {React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>} e The event.
   */
  function onBlur (e) {
    if (e.target.name === 'mapName') {
      let newMapName = e.target.value
      if (newMapName.length < 1) {
        newMapName = 'unnamed'
      }

      props.mapConfig.mapName = newMapName.slice(
        0, constants.MAP_CONFIG_LIMITS.MAX_MAP_NAME_LEN
      )
    }
    props.forceUpdate()
  }

  return (
    <CustomModal
      id='map-settings-modal'
      isOpen={props.isOpen}
      headerContent='Map Settings'
      dimensions={dimensions}
      position={position}
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        props.closeModal()
      }}
    >
      Map name:
      <input
        type='text'
        name='mapName'
        value={props.mapConfig?.mapName}
        onChange={onChange}
        onBlur={onBlur}
      /><br />
      Description:
      <textarea
        name='mapDescription'
        value={props.mapConfig?.description}
        onChange={onChange}
        onBlur={onBlur}
      />
    </CustomModal>
  )
}
