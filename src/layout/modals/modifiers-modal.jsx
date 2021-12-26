/* eslint-env react */
/**
 * @fileoverview React component to render modifiers.
 */

import Joi from 'joi'
import React from 'react'
import debugFactory from 'debug'

import EditableList from '../../components/editable-list.jsx'
import ItemEditor, { ItemDisplayRow } from '../../components/item-editor.jsx'

import constants from '../../constants.js'
import { bound, centerPos } from '../../helpers/math-utils.js'
import * as schemas from '../../editor/config-schemas.js'

const debug = debugFactory('cw-map-editor:modifiers')

const MODAL_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 40,
  height: constants.ROOT_FONT_SIZE * 27.5
})
const ITEM_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 10.5,
  height: constants.ROOT_FONT_SIZE * 2.25
})
const SingleLineDescSchema = schemas
  .SingleLineDescSchema
  .max(constants.MAP_CONFIG_LIMITS.MAX_MODIFIER_DESC_LEN)

/**
 * @typedef {import('../../editor/map-config').Modification} Modification
 * @typedef {import('../../editor/map-config').Modifier} Modifier
 * @typedef {import('../../helpers/display-utils').ViewportDimensions} ViewportDimensions
 */
/**
 * @typedef {Object} ModifiersModalProps
 * @prop {boolean} isOpen
 * @prop {VoidFunction} closeModal
 * @prop {Array<Modifier>} modifiers
 * @prop {React.Dispatch<any>} setError
 * @prop {ViewportDimensions} vwDimensions
 * @prop {VoidFunction} openNewModifierModal
 * @prop {(name: string) => void} deleteModifier
 * @prop {(id: string, opts: Omit<Modifier, 'id'>) => void} setModifier
 *
 * @typedef {Object} ModificationListProps
 * @prop {Modifier} modifier
 * @prop {React.Dispatch<any>} setError
 * @prop {(id: string, opts: Omit<Modifier, 'id'>) => void} setModifier
 */

/**
 * Renders a list of modifications.
 * @param {ModificationListProps} props Component props.
 * @returns {JSX.Element}
 */
function ModificationList (props) {
  const maxModifications = constants.MAP_CONFIG_LIMITS.MAX_MODIFICATIONS_PER_MODIFIER
  const { modifier, setError, setModifier } = props

  /**
   * Creates a new modification.
   */
  function createModification () {
    if (modifier.modifications.length > maxModifications) {
      debug('Too many modifications')
      setError(new Error('Maximum of 50 modifications is allowed per modifier.'))
      return
    }

    debug('Create new modification')
    modifier.modifications.push(
      constants.DEFAULT.MODIFICATION_CONFIG
    )
    setModifier(modifier.id, modifier)
  }
  /**
   * Renders a modification.
   * @param {Modification & { id: number }} modification The modification to render.
   * @returns {JSX.Element}
   */
  function renderModification (modification) {
    const currentModification = modifier.modifications[modification.id]
    /**
     * Handles an input change.
     * @param {React.ChangeEvent<HTMLInputElement>} e The DOM event.
     */
    function onChange (e) {
      const targetName = e.target.name
      const targetVal = e.target.value

      /**
       * XXX: modification.id is NOT the same as modifier.id
       * The former refers to the index of one of the modifications that
       * a modifier applies, and the latter refers to the ID of a modifier.
       * (12/18/2021) Take-Some-Bytes */
      switch (targetName) {
        case 'field':
          modifier.modifications[modification.id] = {
            ...currentModification,
            field: String(targetVal)
          }
          setModifier(modifier.id, modifier)
          break
        case 'add':
          modifier.modifications[modification.id] = {
            ...currentModification,
            add: Number(targetVal)
          }
          setModifier(modifier.id, modifier)
          break
        case 'multiply':
          modifier.modifications[modification.id] = {
            ...currentModification,
            multiply: Math.abs(Number(targetVal))
          }
          setModifier(modifier.id, modifier)
          break
        default:
          debug('Unrecognized target name %s', targetName)
      }
    }

    return (
      <form id={`modification-${modification.id}-edit`}>
        <label htmlFor='field-input' id='field-input-label'>
          Field:&nbsp;
        </label>
        <input
          type='text'
          id='field-input'
          name='field'
          value={modification.field}
          onChange={onChange}
          style={{ display: 'inline-block' }}
        /><br />
        <label htmlFor='add-input' id='add-input-label'>
          Add:&nbsp;
        </label>
        <input
          type='number'
          id='add-input'
          name='add'
          value={modification.add}
          onChange={onChange}
          style={{ width: '2.5rem' }}
        />&nbsp;&nbsp;
        <label htmlFor='multiply-input' id='multiply-input-label'>
          Multiply:&nbsp;
        </label>
        <input
          type='number'
          id='multiply-input'
          name='multiply'
          value={modification.multiply}
          onChange={onChange}
          style={{ width: '2.5rem' }}
        />
      </form>
    )
  }

  return (
    <EditableList
      id='modifications'
      collectiveItemName='Modification'
      setError={e => debug('%O', e)}
      items={modifier.modifications.map((mod, i) => ({
        id: i,
        ...mod
      }))}
      itemLimits={{ min: 0, max: 50 }}
      itemOps={{
        create: createModification,
        render: renderModification,
        delete: id => {
          debug('Delete modification %s', id)
          id = Number(id)
          if (isNaN(id) || id >= modifier.modifications.length) {
            debug('Invalid modification')
            return
          }

          modifier.modifications.splice(id, 1)
          setModifier(modifier.id, modifier)
        }
      }}
    />
  )
}

/**
 * Returns a function that renders a specific modifier.
 * @param {React.Dispatch<any>} setError Set the current error.
 * @param {(id: string, opts: Omit<Modifier, "id">) => void} setModifier
 * Function to update the current modifier.
 * @returns {(modifier: Modifier) => JSX.Element}
 */
function createModifierRenderer (setError, setModifier) {
  return modifier => {
    // Assign a default to modifier so inputs won't change from
    // controlled to uncontrolled and vice versa.
    modifier ??= {
      ...constants.DEFAULT.MODIFIER_CONFIG
    }

    /**
     * Handles DOM change events.
     * @param {React.ChangeEvent<HTMLInputElement>} e The DOM event.
     */
    function onChange (e) {
      const targetName = e.target.name
      const targetVal = e.target.value

      switch (targetName) {
        case 'desc': {
          try {
            Joi.assert(targetVal, SingleLineDescSchema)
          } catch (ex) {
            // Invalid characters in input. Ignore.
            return
          }
          modifier = { ...modifier, description: targetVal }
          setModifier(modifier.id, modifier)
          break
        }
        case 'duration': /* fallthrough */
        case 'maxStack': {
          modifier = { ...modifier, [targetName]: Number(targetVal) }
          setModifier(modifier.id, modifier)
          break
        }
        default:
          debug('Unrecognized input name: %s', targetName)
      }
    }
    /**
     * Handles DOM blur events.
     * @param {React.FocusEvent<HTMLInputElement>} e The DOM event.
     */
    function onBlur (e) {
      const targetName = e.target.name
      const targetVal = e.target.value

      switch (targetName) {
        case 'duration': /* fallthrough */
        case 'maxStack': {
          modifier = {
            ...modifier,
            [targetName]: bound(
              Math.round(Number(targetVal)),
              -1, Infinity
            )
          }
          setModifier(modifier.id, modifier)
          break
        }
      }
    }

    return (
      <>
        <ItemDisplayRow name='ID'>
          {modifier.id}
        </ItemDisplayRow>
        <ItemDisplayRow name='Name'>
          {modifier.name}
        </ItemDisplayRow>
        <ItemDisplayRow name='Description'>
          <input
            type='text'
            name='desc'
            id='desc-textbox'
            value={modifier.description}
            onChange={onChange}
            onBlur={onBlur}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Duration'>
          <input
            type='number'
            name='duration'
            id='duration-input'
            value={modifier.duration}
            onChange={onChange}
            step={0.01}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Max Stack'>
          <input
            type='number'
            name='maxStack'
            id='max-stack-input'
            value={modifier.maxStack}
            onChange={onChange}
            onBlur={onBlur}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Modifications'>
          <ModificationList
            modifier={modifier}
            setError={setError}
            setModifier={setModifier}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
        <ItemDisplayRow name='next'>
          Next item value.
        </ItemDisplayRow>
      </>
    )
  }
}

/**
 * React component that renders the modifiers modal, which allows the user
 * to view and edit map modifiers.
 * @param {ModifiersModalProps} props Component props.
 */
export default function ModifiersModal (props) {
  const position = centerPos(MODAL_DIMENSIONS, props.vwDimensions)
  const renderModifier = createModifierRenderer(props.setError, props.setModifier)

  return (
    <ItemEditor
      id='modifiers'
      isOpen={props.isOpen}
      position={position}
      dimensions={MODAL_DIMENSIONS}
      itemName='Modifier'
      headerContent='Map Modifiers'
      closeModal={props.closeModal}
      listItemStyle={{
        fontSize: '0.85rem',
        paddingTop: '0.6rem',
        paddingBottom: '0.6rem'
      }}
      items={props.modifiers}
      listItemDimensions={ITEM_DIMENSIONS}
      renderItem={renderModifier}
      minItems={constants.MAP_CONFIG_LIMITS.MIN_MAP_MODIFIERS}
      maxItems={constants.MAP_CONFIG_LIMITS.MAX_MAP_MODIFIERS}
      newItem={props.openNewModifierModal}
      deleteItem={props.deleteModifier}
    />
  )
}
