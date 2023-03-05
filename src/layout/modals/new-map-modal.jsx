/* eslint-env react, browser */
/**
 * @fileoverview React component for the ``New Map`` modal.
 */

import React from 'react'

import * as mathUtils from 'colonialwars-lib/math'

import SelectMenu from '../../components/selectmenu.jsx'
import CustomModal, { ModalPriority } from '../../components/custom-modal.jsx'

import constants from '../../constants.js'

import { centerPos } from '../../helpers/display-utils.js'

const SELECTMENU_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 11.25,
  height: constants.ROOT_FONT_SIZE * 2.25
})

/**
 * @callback ClickHandler
 * @param {React.MouseEvent<HTMLButtonElement>} e
 * @returns {void}
 *
 * @typedef {Object} FieldValues
 * @prop {string} mode
 * @prop {Object} size
 * @prop {number} size.x
 * @prop {number} size.y
 * @prop {string} tileType
 * @prop {number} defaultHeight
 * @prop {Record<'unit'|'building'|'graphics', string>} dataFiles
 *
 * @typedef {Object} NewMapModalProps
 * @prop {boolean} isOpen
 * @prop {() => void} closeModal
 * @prop {FieldValues} inputFieldValues
 * @prop {(config: FieldValues) => void} onNewMap
 * @prop {Record<'width'|'height', number>} vwDimensions
 *
 * @typedef {Object} MapConfigProps
 * @prop {FieldValues} inputFieldValues
 * @prop {React.ChangeEventHandler<HTMLSelectElement|HTMLInputElement>} onChange
 * @prop {React.FocusEventHandler<HTMLSelectElement|HTMLInputElement>} onBlur
 */

/**
 * BasicMapConfig component to contain the basic map configurations in the new
 * map modal.
 * @param {MapConfigProps} props Component props.
 * @returns {JSX.Element}
 */
function BasicMapConfig (props) {
  return (
    // <div id='newmap-basic-config' className='newmap-config__bsc'>
    <div id='newmap-basic-config'>
      Size &nbsp;
      <input
        type='number'
        name='size.x'
        value={props.inputFieldValues.size.x}
        min={constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE}
        max={constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      &nbsp;:&nbsp;
      <input
        type='number'
        name='size.y'
        value={props.inputFieldValues.size.y}
        min={constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE}
        max={constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      <br /><br />
      Game Mode:
      <SelectMenu
        name='mode'
        id='mode-select'
        arrowSrc='/imgs/drop-down-arrow.png'
        dimensions={SELECTMENU_DIMENSIONS}
        value={props.inputFieldValues.mode}
        options={[
          { id: 'mode-1', value: 'teams', displayedText: 'Teams' },
          { id: 'mode-2', value: 'koth', displayedText: 'KOTH' },
          { id: 'mode-3', value: 'siege', displayedText: 'Siege' }
        ]}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  )
}

/**
 * The ``New Map`` modal component.
 * @param {NewMapModalProps} props Component props.
 * @returns {JSX.Element}
 */
export default function NewMapModal (props) {
  const [newMapConfig, setNewMapConfig] = React.useState({
    ...constants.FALLBACKS.STARTING_MAP_CONFIG
  })

  const dimensions = {
    width: constants.ROOT_FONT_SIZE * 27.5,
    height: constants.ROOT_FONT_SIZE * 27.5
  }
  const position = centerPos(dimensions, props.vwDimensions)

  /**
   * @param {React.MouseEvent<HTMLButtonElement} e
   */
  function onOkButtonClick (e) {
    e.preventDefault()
    e.stopPropagation()

    props.onNewMap(newMapConfig)
  }
  /**
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e
   */
  function onChange (e) {
    const target = e.target

    if (target.name === 'size.x' || target.name === 'size.y') {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        size: {
          ...prevConfig.size,
          [target.name[5]]: target.value
        }
      }))
    } else {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        [target.name]: target.value
      }))
    }
  }
  /**
   * @param {React.FocusEvent<HTMLInputElement|HTMLSelectElement>} e
   */
  function onBlur (e) {
    const target = e.target

    // This function is mainly to bound the number inputs to
    // their respective minimums and maximums.
    if (target.name === 'size.x' || target.name === 'size.y') {
      setNewMapConfig(prevConfig => ({
        ...prevConfig,
        size: {
          ...prevConfig.size,
          [target.name[5]]: mathUtils.bound(
            Math.round(Number(target.value)),
            constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE,
            constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE
          )
        }
      }))
    }
  }

  return (
    <CustomModal
      id='new-map-modal'
      isOpen={props.isOpen}
      headerContent='New Map'
      dimensions={dimensions}
      position={position}
      priority={ModalPriority.High}
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        props.closeModal()
      }}
      footerContent={
        <div className='float-right'>
          <button
            className='ui-button ui-button--small'
            style={{
              margin: '12px'
            }}
            onClick={onOkButtonClick}
          >
            OK
          </button>
        </div>
      }
    >
      <div className='newmap-config'>
        <BasicMapConfig
          inputFieldValues={newMapConfig}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    </CustomModal>
  )
}
