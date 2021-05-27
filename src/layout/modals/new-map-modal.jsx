/* eslint-env react, browser */
/**
 * @fileoverview React component for the ``New Map`` modal.
 */

import React from 'react'

import SelectMenu from '../../components/selectmenu.jsx'
import CustomModal from '../../components/custom-modal.jsx'

import Constants from '../../constants.js'

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
 * @prop {ClickHandler} onOkButtonClick
 * @prop {FieldValues} inputFieldValues
 * @prop {Record<'x'|'y', number>} position
 * @prop {React.ChangeEventHandler<HTMLSelectElement|HTMLInputElement>} onChange
 * @prop {React.FocusEventHandler<HTMLSelectElement|HTMLInputElement>} onBlur
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
    <div id='newmap-basic-config' className='newmap-config__bsc'>
      Size &nbsp;
      <input
        type='number'
        name='size.x'
        value={props.inputFieldValues.size.x}
        min={Constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE}
        max={Constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    &nbsp;:&nbsp;
      <input
        type='number'
        name='size.y'
        value={props.inputFieldValues.size.y}
        min={Constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE}
        max={Constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      <br /><br />
      Tile type:
      <SelectMenu
        name='tileType'
        id='tile-type-select'
        arrowSrc='/imgs/drop-down-arrow.png'
        dimensions={{
          height: 45,
          width: 225
        }}
        value={props.inputFieldValues.tileType}
        options={[
          { id: 'tile-type-1', value: 'grass', displayedText: 'Grass' },
          { id: 'tile-type-2', value: 'sand', displayedText: 'Sand' },
          { id: 'tile-type-3', value: 'rock', displayedText: 'Rock' }
        ]}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      <br />
      Game Mode:
      <SelectMenu
        name='mode'
        id='mode-select'
        arrowSrc='/imgs/drop-down-arrow.png'
        dimensions={{
          height: 45,
          width: 225
        }}
        value={props.inputFieldValues.mode}
        options={[
          { id: 'mode-1', value: 'teams', displayedText: 'Teams' },
          { id: 'mode-2', value: 'koth', displayedText: 'KOTH' },
          { id: 'mode-3', value: 'siege', displayedText: 'Siege' }
        ]}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      <br />
      Default height: &nbsp;
      <input
        type='number'
        name='defaultHeight'
        value={props.inputFieldValues.defaultHeight}
        min={0}
        max={2}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  )
}

/**
 * AdvMapConfig component to contain the advanced map configurations
 * for the new map modal.
 * @param {MapConfigProps} props Component props.
 * @returns {JSX.Element}
 */
function AdvMapConfig (props) {
  return (
    <div id='newmap-advanced-config' className='newmap-config__adv'>
      Unit Data: &nbsp;
      <input
        type='text'
        name='dataFiles.unit'
        value={props.inputFieldValues.dataFiles.unit}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      <br />
      Building Data: &nbsp;
      <input
        type='text'
        name='dataFiles.building'
        value={props.inputFieldValues.dataFiles.building}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      <br />
      Graphics Data: &nbsp;
      <input
        type='text'
        name='dataFiles.graphics'
        value={props.inputFieldValues.dataFiles.graphics}
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
  return (
    <CustomModal
      id='new-map-modal'
      isOpen={props.isOpen}
      headerContent='New Map'
      dimensions={{
        width: 550,
        height: 550
      }}
      position={props.position}
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        props.closeModal()
      }}
      footerContent={
        <div className='float-right'>
          <button
            className='ui-button ui-size-small'
            style={{
              margin: '12px'
            }}
            onClick={props.onOkButtonClick}
          >
            OK
          </button>
        </div>
      }
    >
      <div className='newmap-config'>
        <BasicMapConfig
          inputFieldValues={props.inputFieldValues}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
        <AdvMapConfig
          inputFieldValues={props.inputFieldValues}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
      </div>
    </CustomModal>
  )
}
