/* eslint-env react */
/**
 * @fileoverview React component that renders the PlayerConfig modal, which
 * allows the user to configure the player entity.
 */

import React from 'react'

import { bound } from 'colonialwars-lib/math'
import { Validate } from 'colonialwars-lib/mapconfig'

import CustomModal from '../../components/custom-modal.jsx'
import Selectmenu from '../../components/selectmenu.jsx'

import constants from '../../constants.js'

import { centerPos } from '../../helpers/display-utils.js'

const DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 30,
  height: constants.ROOT_FONT_SIZE * 20
})
const SELECTMENU_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 12.5,
  height: constants.ROOT_FONT_SIZE * 2.25
})

/**
 * @typedef {Object} PlayerConfigModalProps
 * @prop {boolean} isOpen
 * @prop {VoidFunction} closeModal
 * @prop {React.DispatchWithoutAction} forceUpdate
 * @prop {import('colonialwars-lib/mapconfig').MutableMapConfig} mapConfig
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 */

/**
 * Renders a modal that allows the user to configure the player entity.
 * @param {PlayerConfigModalProps} props Component props.
 * @returns {JSX.Element}
 */
export default function PlayerConfigModal (props) {
  const position = centerPos(DIMENSIONS, props.vwDimensions)

  /**
   * Handle the input change event.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e The DOM event.
   */
  function onChange (e) {
    const targetName = e.target.name
    const targetVal = e.target.value

    switch (targetName) {
      case 'img':
        props.mapConfig.player.img = String(targetVal)
        break
      case 'speed':
        props.mapConfig.player.speed = targetVal
        break
    }

    props.forceUpdate()
  }
  /**
   * Handle the blur event.
   * @param {React.FocusEvent<HTMLInputElement|HTMLTextAreaElement>} e The event.
   */
  function onBlur (e) {
    const targetName = e.target.name
    const targetVal = e.target.value

    switch (targetName) {
      case 'speed':
        props.mapConfig.player.speed = bound(
          Number(targetVal), 0,
          Validate.LIMITS.MAX_PLAYER_SPEED
        )
        break
    }

    props.forceUpdate()
  }

  return (
    <CustomModal
      id='player-config-modal'
      isOpen={props.isOpen}
      headerContent='Player Settings'
      dimensions={DIMENSIONS}
      position={position}
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        props.closeModal()
      }}
    >
      <label htmlFor='player-speed-input'>
        Player speed:&nbsp;&nbsp;
      </label>
      <input
        name='speed'
        id='player-speed-input'
        type='number'
        step={0.1}
        min={Validate.LIMITS.MIN_PLAYER_SPEED}
        max={Validate.LIMITS.MAX_PLAYER_SPEED}
        value={props.mapConfig?.player?.speed}
        onChange={onChange}
        onBlur={onBlur}
      />

      <br />
      <br />

      <label htmlFor='player-graphic-select'>
        Player graphic:
      </label>
      <Selectmenu
        name='img'
        id='player-graphic-select'
        arrowSrc='/imgs/drop-down-arrow.png'
        dimensions={SELECTMENU_DIMENSIONS}
        value={props.mapConfig?.player?.img}
        options={Array.from(props.mapConfig?.graphics?.values?.()).map(graphic => ({
          id: graphic.id,
          value: graphic.id,
          displayedText: graphic.name
        }))}
        onChange={onChange}
      />
    </CustomModal>
  )
}
