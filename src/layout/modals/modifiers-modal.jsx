/* eslint-env react */
/**
 * @fileoverview React component to render modifiers.
 */

import Joi from 'joi'
import React from 'react'
import debugFactory from 'debug'

import { bound } from 'colonialwars-lib/math'
import { Default, Validate } from 'colonialwars-lib/mapconfig'

import Selectmenu from '../../components/selectmenu.jsx'
import EditableList from '../../components/editable-list.jsx'
import ColourPicker from '../../components/colour-picker.jsx'
import ItemEditor, { ItemDisplayRow } from '../../components/item-editor.jsx'

import constants from '../../constants.js'
import { centerPos } from '../../helpers/display-utils.js'

const debug = debugFactory('cw-map-editor:modifiers')

const MODAL_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 40,
  height: constants.ROOT_FONT_SIZE * 27.5
})
const ITEM_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 10.5,
  height: constants.ROOT_FONT_SIZE * 2.25
})
const TextSchema = Validate
  .TextSchema
  .max(Validate.LIMITS.MAX_MODIFIER_DESC_LEN)

/**
 * Uppercases the first letter of a string.
 * @param {string} str The string to operate on.
 * @returns {string}
 */
function upperFirstLetter (str) {
  return (
    str.charAt(0).toUpperCase() +
    str.slice(1)
  )
}

/**
 * @typedef {import('../../editor/map-config').Aura} Aura
 * @typedef {import('colonialwars-lib/mapconfig').Modifier} Modifier
 * @typedef {import('../../editor/map-config').Modification} Modification
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
 *
 * @typedef {Object} AuraListProps
 * @prop {Modifier} modifier
 * @prop {Array<Modifier>} allModifiers
 * @prop {React.Dispatch<any>} setError
 * @prop {(id: string, opts: Omit<Modifier, 'id'>) => void} setModifier
 */

/**
 * Renders a list of modifications.
 * @param {ModificationListProps} props Component props.
 * @returns {JSX.Element}
 */
function ModificationList (props) {
  const maxModifications = Validate.LIMITS.MAX_MODIFICATIONS_PER_MODIFIER
  const { modifier, setError, setModifier } = props

  /**
   * Creates a new modification.
   */
  function createModification () {
    if (modifier.modifications.length + 1 > maxModifications) {
      debug('Too many modifications')
      setError(new Error('Maximum of 50 modifications is allowed per modifier.'))
      return
    }

    debug('Create new modification')
    modifier.modifications.push(Default.MODIFICATION_CONFIG)
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
      setError={setError}
      // So we can distinguish between the modifications.
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
 * Renders a list of auras.
 * @param {AuraListProps} props Component props.
 * @returns {JSX.Element}
 */
function AuraList (props) {
  const maxAuras = Validate.LIMITS.MAX_AURAS_PER_MODIFIER
  const { modifier: currentModifier, allModifiers, setError, setModifier } = props

  /**
   * Creates a new aura.
   */
  function createAura () {
    if (currentModifier.auras.length + 1 > maxAuras) {
      debug('Too many auras')
      setError(new Error('Maximum of 10 auras is allowed per modifier.'))
      return
    }
    if (allModifiers.length === 1) {
      // Auras apply modifiers, and if there is only one modifier (the current one)
      // it won't work properly.
      debug('Not enough modifications')
      setError(new Error([
        'Auras apply modifiers; cannot create aura since ',
        'the only modifier is the current one.'
      ].join('')))
      return
    }

    // Default aura config is the ID of the first modifier which is not
    // the current one, and the default aura radius.
    currentModifier.auras.push({
      modifier: allModifiers
        .map(modifier => modifier.id)
        .find(modifierID => modifierID !== currentModifier.id),
      range: Default.AURA_RANGE
    })
    setModifier(currentModifier.id, currentModifier)
  }

  /**
   * Renders an aura.
   * @param {Aura & { id: number }} aura The aura to render.
   * @returns {JSX.Element}
   */
  function renderAura (aura) {
    const currentAura = currentModifier.auras[aura.id]

    /**
     * Handles an input change.
     * @param {React.ChangeEvent<HTMLInputElement>} e The DOM event.
     */
    function onChange (e) {
      const targetName = e.target.name
      const targetVal = e.target.value

      switch (targetName) {
        case 'modifier':
          currentModifier.auras[aura.id] = {
            ...currentAura,
            modifier: String(targetVal)
          }
          setModifier(currentModifier.id, currentModifier)
          break
        case 'range':
          currentModifier.auras[aura.id] = {
            ...currentAura,
            range: bound(
              // Not 100% precise, but it works here.
              Math.round(Number(targetVal) * 100) / 100,
              Validate.LIMITS.MIN_AURA_RANGE,
              Validate.LIMITS.MAX_AURA_RANGE
            )
          }
          setModifier(currentModifier.id, currentModifier)
          break
        default:
          debug('Unrecognized target name %s', targetName)
      }
    }

    return (
      <form id={`aura-${aura.id}-edit`}>
        <label htmlFor='modifier-select' id='modifier-select-label'>
          Modifier:&nbsp;
        </label>
        <Selectmenu
          id='modifier-select'
          name='modifier'
          onChange={onChange}
          value={currentAura.modifier}
          dimensions={{
            width: 200,
            height: 45
          }}
          options={
            allModifiers
              .filter(modifier => modifier.id !== currentModifier.id)
              .map(modifier => ({
                id: modifier.id,
                value: modifier.id,
                displayedText: modifier.name
              }))
          }
          arrowSrc='/imgs/drop-down-arrow.png'
        />
      </form>
    )
  }

  /**
   * Deletes the specified aura.
   * @param {string} id The ID of the aura.
   */
  function deleteAura (id) {
    debug('Delete aura %s', id)
    id = Number(id)
    if (isNaN(id) || id >= currentModifier.auras.length) {
      debug('Invalid aura')
      return
    }

    currentModifier.auras.splice(id, 1)
    setModifier(currentModifier.id, currentModifier)
  }

  return (
    <EditableList
      id='auras'
      collectiveItemName='Aura'
      setError={setError}
      // So we can distinguish between the auras.
      items={currentModifier.auras.map((aura, i) => ({
        id: i,
        ...aura
      }))}
      itemLimits={{ min: 0, max: 50 }}
      itemOps={{
        create: createAura,
        render: renderAura,
        delete: deleteAura
      }}
    />
  )
}

/**
 * Returns a function that renders a specific modifier.
 * @param {React.Dispatch<any>} setError Set the current error.
 * @param {(id: string, opts: Omit<Modifier, "id">) => void} setModifier
 * Function to update the current modifier.
 * @param {Array<Modifier>} allModifiers An array of all the modifiers
 * currently configured in this map
 * @returns {(modifier: Modifier) => JSX.Element}
 */
function createModifierRenderer (setError, setModifier, allModifiers) {
  return modifier => {
    // Assign a default to modifier so inputs won't change from
    // controlled to uncontrolled and vice versa.
    modifier ??= {
      ...Default.MODIFIER_CONFIG
    }

    /**
     * Handles DOM change events.
     * @param {React.ChangeEvent<HTMLInputElement>} e The DOM event.
     */
    function onChange (e) {
      const targetName = e.target.name
      const targetVal = e.target.value

      // First round
      switch (targetName) {
        case 'desc': {
          try {
            Joi.assert(targetVal, TextSchema)
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
        case '':
      }

      // Second round
      if (targetName.startsWith('auraHits.')) {
        const subName = upperFirstLetter(targetName.slice(9))

        modifier = {
          ...modifier,
          [`auraHits${subName}`]: Boolean(e.target.checked)
        }
        setModifier(modifier.id, modifier)
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
        <ItemDisplayRow name='Auras'>
          <AuraList
            modifier={modifier}
            setError={setError}
            setModifier={setModifier}
            allModifiers={allModifiers}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Aura Hits Self'>
          <input
            type='checkbox'
            name='auraHits.self'
            id='aura-hits-self-input'
            checked={modifier.auraHitsSelf}
            onChange={onChange}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Aura Hits Friendly'>
          <input
            type='checkbox'
            name='auraHits.friendly'
            id='aura-hits-friendly-input'
            checked={modifier.auraHitsFriendly}
            onChange={onChange}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Aura Hits Allied'>
          <input
            type='checkbox'
            name='auraHits.allied'
            id='aura-hits-allied-input'
            checked={modifier.auraHitsAllied}
            onChange={onChange}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Aura Hits Enemy'>
          <input
            type='checkbox'
            name='auraHits.enemy'
            id='aura-hits-enemy-input'
            checked={modifier.auraHitsEnemy}
            onChange={onChange}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Aura Colour'>
          <ColourPicker
            colour={modifier.auraColour}
            dimensions={{ width: 60, height: 16 }}
            onColourChange={result => {
              modifier.auraColour = result.rgb
              setModifier(modifier.id, modifier)
            }}
            enableAlpha
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Aura Target Filters'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Aura Target Filters Exclude'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Disable Commands'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Change Entity Image'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Entity Image'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Change Attack Effect'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Attack Effect'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Effects'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Sound'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Sound Volume'>
          TODO
        </ItemDisplayRow>
        <ItemDisplayRow name='Remove Modifiers'>
          TODO
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
  const renderModifier = createModifierRenderer(
    props.setError,
    props.setModifier,
    props.modifiers
  )

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
      minItems={Validate.LIMITS.MIN_MAP_MODIFIERS}
      maxItems={Validate.LIMITS.MAX_MAP_MODIFIERS}
      newItem={props.openNewModifierModal}
      deleteItem={props.deleteModifier}
    />
  )
}
