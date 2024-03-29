/* eslint-env react */
/**
 * @fileoverview React component to create new modifiers.
 */

import Joi from 'joi'
import React from 'react'

import { Default, Validate } from 'colonialwars-lib/mapconfig'

import Button from '../../components/button.jsx'
import CustomModal from '../../components/custom-modal.jsx'

import constants from '../../constants.js'
import { centerPos } from '../../helpers/display-utils.js'

const MODAL_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 25,
  height: constants.ROOT_FONT_SIZE * 25
})
const IdLenSchema = Joi.string().min(1).max(52)

/**
 * Deep copies an object and its values.
 * @param {O} obj The object to copy.
 * @returns {O}
 * @template O
 */
function deepCopy (obj) {
  if (!obj || typeof obj !== 'object') {
    // Don't need to copy.
    return obj
  }

  const result = obj instanceof Date
    ? new Date(obj)
    : new obj.constructor()
  const propNames = Object.getOwnPropertyNames(obj)
  for (const name of propNames) {
    const value = obj[name]
    if (value === obj) {
      // Screw circular objects
      // Even this doesn't handle all cases.
      continue
    }

    result[name] = deepCopy(obj[name])
  }

  return result
}

/**
 * @typedef {import('../../helpers/display-utils').ViewportDimensions} ViewportDimensions
 */
/**
 * @typedef {Record<string, unknown>} NewModifierOpts
 *
 * @typedef {Object} NewModifierModalProps
 * @prop {boolean} isOpen
 * @prop {VoidFunction} closeModal
 * @prop {React.Dispatch<any>} setError
 * @prop {ViewportDimensions} vwDimensions
 * @prop {(id: string, opts: NewModifierOpts) => void} newModifier
 */

/**
 * A component to render a modal which allows the user to create
 * new modifiers for the current map.
 * @param {NewModifierModalProps} props Component props.
 * @returns {JSX.Element}
 */
export default function NewModifierModal (props) {
  const [modifierConfig, setModifierConfig] = React.useState({
    id: 'new_modifier',
    name: 'New Modifier'
  })
  const position = centerPos(MODAL_DIMENSIONS, props.vwDimensions)

  /**
   * Handles React change events.
   * @param {React.ChangeEvent<HTMLInputElement} e The DOM event.
   */
  function onChange (e) {
    e.stopPropagation()
    e.preventDefault()

    setModifierConfig(prevConf => ({
      ...prevConf,
      [e.target.name]: String(e.target.value)
    }))
  }
  /**
   * Handles OK button click.
   * @param {React.MouseEvent<HTMLButtonElement>} e The DOM event.
   */
  function onOkButtonClick (e) {
    e.stopPropagation()
    e.preventDefault()

    const { error: idLenError } = IdLenSchema.validate(modifierConfig.id)
    const { error: idError } = Validate.IdSchema.validate(modifierConfig.id)
    const { error: nameError } = Validate.NameSchema.validate(modifierConfig.name)

    if (idLenError) {
      props.setError(new Error('Modifier ID must be between 1 and 52 characters long.'))
    } else if (idError) {
      props.setError(new Error([
        'Invalid characters in modifier ID. ',
        'Only lowercase letters, numbers, and underscores are allowed.'
      ].join('')))
    } else if (nameError) {
      props.setError(new Error([
        'Invalid characters in modifier name, or graphic name is too long.. ',
        'Maximum 30 characters in modifier name, and only alphanumeric ',
        'characters and spaces are allowed.'
      ].join('')))
    } else {
      // All good.
      props.newModifier(modifierConfig.id, {
        ...deepCopy(Default.MODIFIER_CONFIG),
        id: modifierConfig.id,
        name: modifierConfig.name
      })
      props.closeModal()
    }
  }

  return (
    <CustomModal
      id='new-modifier-modal'
      isOpen={props.isOpen}
      headerContent='New Modifier'
      position={position}
      dimensions={MODAL_DIMENSIONS}
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        props.closeModal()
      }}
      footerContent={(
        <div className='float-right'>
          <Button onClick={onOkButtonClick} style={{ margin: '0.6rem' }} small>
            OK
          </Button>
        </div>
      )}
    >
      Modifier ID:&nbsp;
      <input
        type='text'
        name='id'
        value={modifierConfig.id}
        onChange={onChange}
      /><br />
      Modifier Name:&nbsp;
      <input
        type='text'
        name='name'
        value={modifierConfig.name}
        onChange={onChange}
      />
    </CustomModal>
  )
}
