/* eslint-env react */
/**
 * @fileoverview React component for the ``New Map`` modal.
 */

import React from 'react'

import SelectMenu from '../components/selectmenu.jsx'
import CustomModal from '../components/custom-modal.jsx'

import Constants from '../constants.js'

/**
 * @callback ChangeHandler
 * @param {React.ChangeEvent<HTMLSelectElement|HTMLInputElement>} e
 * @returns {void}
 *
 * @callback ClickHandler
 * @param {React.MouseEvent<HTMLButtonElement>} e
 * @returns {void}
 *
 * @typedef {Object} FieldValues
 * @prop {Object} size
 * @prop {number} size.x
 * @prop {number} size.y
 * @prop {string} tileType
 * @prop {number} defaultHeight
 *
 * @typedef {Object} NewMapModalProps
 * @prop {boolean} isOpen
 * @prop {ChangeHandler} onChange
 * @prop {ClickHandler} onOkButtonClick
 * @prop {FieldValues} inputFieldValues
 * @prop {Record<'x'|'y', number>} position
 * @prop {import('../components/button').ButtonClickCallback} closeModal
 */

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
        width: 400,
        height: 400
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
      Size &nbsp;
      <input
        type='number'
        name='size.x'
        value={props.inputFieldValues.size.x}
        min={Constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE}
        max={Constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE}
        onChange={props.onChange}
      />
      &nbsp;:&nbsp;
      <input
        type='number'
        name='size.y'
        value={props.inputFieldValues.size.y}
        min={Constants.MAP_CONFIG_LIMITS.MIN_MAP_SIZE}
        max={Constants.MAP_CONFIG_LIMITS.MAX_MAP_SIZE}
        onChange={props.onChange}
      />
      <br /><br />
      Tile type:
      <SelectMenu
        name='tileType'
        id='tile-type-select'
        arrowSrc='/imgs/drop-down-arrow.png'
        dimensions={{
          height: 45
        }}
        value={props.inputFieldValues.tileType}
        options={[
          { id: 'item-1', value: 'grass', displayedText: 'Grass' },
          { id: 'item-2', value: 'sand', displayedText: 'Sand' },
          { id: 'item-3', value: 'rock', displayedText: 'Rock' }
        ]}
        onChange={props.onChange}
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
      />
    </CustomModal>
  )
}
