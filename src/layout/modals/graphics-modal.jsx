/* eslint-env react */
/**
 * @fileoverview React component to render the graphics modal.
 */

import React from 'react'
import debugFactory from 'debug'

import { bound } from 'colonialwars-lib/math'
import { Default, Validate } from 'colonialwars-lib/mapconfig'

import Selectmenu from '../../components/selectmenu.jsx'
import ItemEditor, { ItemDisplayRow } from '../../components/item-editor.jsx'

import constants from '../../constants.js'
import { centerPos } from '../../helpers/display-utils.js'

const debug = debugFactory('cw-map-editor:graphics')

const ITEM_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 10.5,
  height: constants.ROOT_FONT_SIZE * 2.25
})
const SELECTMENU_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 12.5,
  height: constants.ROOT_FONT_SIZE * 2.25
})
const staticImgKeys = ['mainImg', 'damaged1Img', 'damaged2Img', 'constructing1Img']
const imgNames = [
  'Main Image', 'Damaged Image', 'Heavily Damaged Image', 'Constructing Image'
]
const animationKeys = [
  'die', 'idle', 'walk', 'attack', 'reload', 'busy',
  'cast', 'busyDamaged1', 'busyDamaged2'
]
const animationNames = [
  'Die Animation', 'Idle Animation', 'Walk Animation', 'Attack Animation',
  'Reload', 'Busy Animation', 'Cast Animation', 'Busy/Damaged Animation',
  'Busy/Heavily Damaged Animation'
]
const MAX_GRAPHICS = Validate.LIMITS.MAX_MAP_GRAPHICS

/**
 * XXX: Some of the names below are a little ambiguous--maybe change them?
 * For example, createHandleImgInputs could create inputs for either a static
 * image or a dynamic animation.
 * (08/09/2021) Take-Some-Bytes */

/**
 * Zip a variable number of iterables.
 * @param  {...Iterable<any>} args The iterables to zip.
 * @returns {Generator<any>}
 */
function * zip (...args) {
  const iters = args.map(iter => iter[Symbol.iterator]())
  // Loop until the shortest iterator is exhausted.
  while (true) {
    const nextResults = iters.map(iter => iter.next())
    for (const result of nextResults) {
      if (result.done) {
        // We are done.
        return
      }
    }

    yield nextResults.map(result => result.value)
  }
}

/**
 * @typedef {import('../../editor/physics/vector2d').default} Vector2D
 * @typedef {import('../../editor/map-config').Graphic} Graphic
 * @typedef {import('../../editor/map-config').StaticImgKeys} StaticImgKeys
 * @typedef {import('../../editor/map-config').DynAnimationKeys} DynAnimationKeys
 * @typedef {(targetVal: string, targetName: string) => void} GraphicEventHandler
 *
 * @typedef {StaticImgInputsProps} DynAnimationInputsProps
 */
/**
 * @typedef {Object} GraphicsModalProps
 * @prop {boolean} isOpen
 * @prop {VoidFunction} closeModal
 * @prop {Array<Graphic>} graphics
 * @prop {VoidFunction} openNewGraphicModal
 * @prop {(name: string) => void} deleteGraphic
 * @prop {React.Dispatch<any>} setError
 * @prop {(id: string, opts: Omit<Graphic, 'id'>) => void} setGraphic
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 *
 * @typedef {Object} ImgInputsProps
 * @prop {string} imgName The name of the static image we're creating the
 * inputs for.
 * @prop {Partial<Record<'w'|'h'|'x'|'y'|'frameSize', number>>} imgObj The
 * object that contains the static image data.
 * @prop {InputEventHandlers} handlers Event handlers for blur and input change
 * events.
 * @prop {boolean} isStatic Are we creating inputs for a static image? This
 * should *not* change between calls to this function.
 *
 * @typedef {Object} NumberInputProps
 * @prop {string} parentName The name of the section the created number input
 * is related to.
 * @prop {string} propName This number input's individual name.
 * @prop {number} inputVal The current value of the input.
 * @prop {InputEventHandlers} handlers Event handlers for blur and input change
 * events.
 *
 * @typedef {Object} StaticImgInputsProps
 * @prop {Graphic} graphic
 * @prop {InputEventHandlers} handlers
 *
 * @typedef {Object} InputEventHandlers
 * @prop {(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => void} onChange
 * @prop {(e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) => void} onBlur
 *
 * @typedef {Object} GraphicEventHandlers
 * @prop {Record<StaticImgKeys, GraphicEventHandler>} staticHandlers
 * @prop {Record<DynAnimationKeys, GraphicEventHandler>} dynHandlers
 */

/**
 * Returns a controlled number input that is bound semantically to a larger section.
 * The returned ``<input />`` element will have its name set to
 * ``${parentName}.${propName}`` for easy identification.
 * @param {NumberInputProps} props Component props.
 * @returns {JSX.Element}
 */
function NumberInput (props) {
  const { parentName, propName, inputVal, handlers } = props
  const { onChange, onBlur } = handlers

  return (
    <input
      type='number'
      name={`${parentName}.${propName}`}
      id={`${parentName.toLowerCase()}-${propName.toLowerCase()}`}
      style={{ width: '2.5rem' }}
      value={inputVal}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
}

/**
 * Create a set of inputs for modifying image/animation properties. Returns a
 * ``<div>`` element.
 * @param {ImgInputsProps} props Component props.
 * @returns {JSX.Element}
 */
function ImgInputs (props) {
  const { imgName, imgObj, handlers, isStatic } = props
  const frameSizeElem = isStatic
    ? null
    : (
      <>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        frameSize:&nbsp;
        <NumberInput
          parentName={imgName}
          propName='frameSize'
          inputVal={imgObj.frameSize}
          handlers={handlers}
        />
      </>
      )

  return (
    <div id={`${imgName.toLowerCase()}-inputs`}>
      x:&nbsp;
      <NumberInput
        parentName={imgName}
        propName='x'
        inputVal={imgObj.x}
        handlers={handlers}
      />
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;
      w:&nbsp;
      <NumberInput
        parentName={imgName}
        propName='w'
        inputVal={imgObj.w}
        handlers={handlers}
      />
      {frameSizeElem}
      <br />
      y:&nbsp;
      <NumberInput
        parentName={imgName}
        propName='y'
        inputVal={imgObj.y}
        handlers={handlers}
      />
      &nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;
      h:&nbsp;
      <NumberInput
        parentName={imgName}
        propName='h'
        inputVal={imgObj.h}
        handlers={handlers}
      />
    </div>
  )
}

/**
 * TODO: See if we could refactor the two functions into one.
 * (08/09/2021) Take-Some-Bytes */
/**
 * Render all the static image inputs.
 * @param {StaticImgInputsProps} props Component props.
 * @returns {Array<JSX.Element>}
 */
function StaticImgInputs (props) {
  const { graphic, handlers } = props

  return Array.from(zip(imgNames, staticImgKeys)).map(val => {
    const [name, key] = val
    return (
      <ItemDisplayRow name={name} key={key}>
        <ImgInputs
          imgName={key}
          imgObj={graphic[key]}
          handlers={handlers}
          isStatic
        />
      </ItemDisplayRow>
    )
  })
}
/**
 * Render all the dynamic animation inputs.
 * @param {DynAnimationInputsProps} props Component props.
 * @returns {Array<JSX.Element>}
 */
function DynAnimationInputs (props) {
  const { graphic, handlers } = props

  return Array.from(zip(animationNames, animationKeys)).map(val => {
    const [name, key] = val
    return (
      <ItemDisplayRow name={name} key={key}>
        <ImgInputs
          imgName={key}
          imgObj={graphic.animations[key]}
          handlers={handlers}
        />
      </ItemDisplayRow>
    )
  })
}

/**
 * Create event handlers for a graphic's static image inputs and dynamic
 * animation inputs.
 * @param {Graphic} graphic The current graphic.
 * @param {(id: string, opts: Omit<Graphic, 'id'>) => void} setGraphic A function
 * to update the current graphic.
 * @param {boolean} createAnimationHandlers Do we create animation handlers?
 * @returns {GraphicEventHandlers}
 */
function createGraphicEventHandlers (graphic, setGraphic, createAnimationHandlers) {
  /**
   * @param {Array<string>} keys
   * @param {boolean} isStatic
   * @returns {Record<string, GraphicEventHandler>}
   */
  function createHandlers (keys, isStatic) {
    const result = {}
    for (const key of keys) {
      result[key] = createHandleImgInputs(
        setGraphic, graphic, key, false, isStatic
      )
      result[`${key}Blur`] = createHandleImgInputs(
        setGraphic, graphic, key, true, isStatic
      )
    }
    return result
  }

  return {
    staticHandlers: createHandlers(staticImgKeys, true),
    dynHandlers: createAnimationHandlers
      ? createHandlers(animationKeys, false)
      : null
  }
}

/**
 * Creates a function that handles input for a static image or dynamic animation.
 * @param {(id: string, opts: Omit<Graphic, 'id'>) => void} setGraphic A function
 * to update the current graphic.
 * @param {Graphic} graphic The current graphic.
 * @param {string} imgName Name of the image field to handle input for.
 * @param {boolean} isBlurHandler Are we creating a blur event handler?
 * @param {boolean} isStatic Is the image static?
 * @returns {(targetVal: string, targetName: string) => void}
 */
function createHandleImgInputs (setGraphic, graphic, imgName, isBlurHandler, isStatic) {
  const parentImgObj = isStatic
    ? graphic
    : graphic.animations
  const imgObj = isStatic
    ? graphic[imgName]
    : graphic.animations[imgName]

  let processVal = () => {}
  if (isBlurHandler) {
    processVal = (val) => Math.round(bound(Number(val), 0, Infinity))
  } else {
    processVal = (val) => Number(val)
  }

  return (targetVal, targetName) => {
    const dotIndex = targetName.indexOf('.')
    if (!~dotIndex) {
      // What.
      debug("Didn't find dot in target name--no op.")
      return
    }

    const field = targetName.slice(dotIndex + 1)
    switch (field) {
      // Fallthrough for everyone!!!
      case 'frameSize':
        if (isStatic) {
          // Ignore frameSize, because it's a static image.
          debug('Static image, received frameSize field--ignoring.')
          break
        }
      // Fallthrough
      case 'x':
      case 'y':
      case 'w':
      case 'h':
        parentImgObj[imgName] = { ...imgObj, [field]: processVal(targetVal) }
        setGraphic(graphic.id, graphic)
        break
      default:
        // Something's not right.
        debug('Unrecognized %s field %s', imgName, field)
    }
  }
}

/**
 * Returns a function that could render a specific graphic.
 * @param {(id: string, opts: Omit<Graphic, 'id'>) => void} setGraphic A function
 * to update the current graphic.
 * @returns {(graphic: Graphic) => JSX.Element}
 */
function createGraphicRenderer (setGraphic) {
  return graphic => {
    // If graphic is nullish, assign a default to avoid changing the
    // below inputs from controlled to uncontrolled (and vice versa).
    graphic ??= {
      ...Default.GRAPHIC_CONFIG
    }
    let staticHandlers, dynHandlers

    /**
     * Handler for DOM 'change' event.
     * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement} e The DOM event.
     */
    function onInputChange (e) {
      const dotIndex = e.target.name.indexOf('.')
      const targetName = (~dotIndex)
        ? e.target.name.slice(0, dotIndex)
        : e.target.name

      switch (targetName) {
        case 'file': {
          graphic = { ...graphic, file: e.target.value }
          setGraphic(graphic.id, graphic)
          break
        }
        case 'angles': {
          graphic = { ...graphic, angles: Number(e.target.value) }
          setGraphic(graphic.id, graphic)
          break
        }
        case 'hasAnimations': {
          graphic = { ...graphic, hasAnimations: Boolean(e.target.checked) }
          setGraphic(graphic.id, graphic)
          break
        }
        default:
          if (staticImgKeys.includes(targetName)) {
            // Static image.
            staticHandlers[targetName](e.target.value, e.target.name)
          } else if (animationKeys.includes(targetName)) {
            // Dynamic animation.
            dynHandlers[targetName](e.target.value, e.target.name)
          }
      }
    }
    /**
     * Handler for DOM 'change' event.
     * @param {React.FocusEvent<HTMLInputElement|HTMLSelectElement} e The DOM event.
     */
    function onInputBlur (e) {
      const dotIndex = e.target.name.indexOf('.')
      const targetName = (~dotIndex)
        ? e.target.name.slice(0, dotIndex)
        : e.target.name

      if (staticImgKeys.includes(targetName)) {
        // Static image.
        staticHandlers[`${targetName}Blur`](e.target.value, e.target.name)
      } else if (animationKeys.includes(targetName)) {
        // Dynamic animation.
        dynHandlers[`${targetName}Blur`](e.target.value, e.target.name)
      }
    }

    const handlers = {
      onChange: onInputChange,
      onBlur: onInputBlur
    }
    // Rule of React: You are not allowed to modify state WHILE a component
    // is rendering. So, we are using React.useEffect here.
    // Another Rule of React: You MUST call hooks in the exact same order,
    // every single time. That is why we wrap the entire if-condition in
    // React.useEffect().
    React.useEffect(() => {
      if (graphic.hasAnimations && !graphic.animations) {
        // We need animations!
        graphic = {
          ...graphic,
          animations: Object.fromEntries(animationKeys.map(key => [
            key, { ...Default.ANIMATION_CONFIG }
          ]))
        }
        setGraphic(graphic.id, graphic)
      } else if (!graphic.hasAnimations && graphic.animations) {
        // Clear animations.
        graphic.animations = null
        setGraphic(graphic.id, graphic)
      }

      // Create the graphic event handlers.
      ;({
        staticHandlers, dynHandlers
      } = createGraphicEventHandlers(graphic, setGraphic, graphic.hasAnimations))
    }, [graphic])

    return (
      <>
        <ItemDisplayRow name='ID'>
          {graphic.id}
        </ItemDisplayRow>
        <ItemDisplayRow name='Name'>
          {graphic.name}
        </ItemDisplayRow>
        <ItemDisplayRow name='Image File'>
          <Selectmenu
            name='file'
            id='file-select'
            arrowSrc='/imgs/drop-down-arrow.png'
            dimensions={SELECTMENU_DIMENSIONS}
            value={graphic.file}
            options={constants.SELECTABLE.GRAPHIC_FILES}
            onChange={onInputChange}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Angles'>
          <Selectmenu
            name='angles'
            id='angles-specify'
            arrowSrc='/imgs/drop-down-arrow.png'
            dimensions={SELECTMENU_DIMENSIONS}
            value={graphic.angles}
            options={constants.SELECTABLE.ANGLES}
            onChange={onInputChange}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Has Animations'>
          <input
            type='checkbox'
            name='hasAnimations'
            id='has-animations-toggle'
            checked={graphic.hasAnimations}
            onChange={onInputChange}
          />
        </ItemDisplayRow>
        <StaticImgInputs graphic={graphic} handlers={handlers} />
        {/*
          * Only render animation-related inputs if needed, and if the graphic.animations
          * object is not null.
          */}
        {graphic.hasAnimations && graphic.animations &&
          <DynAnimationInputs graphic={graphic} handlers={handlers} />}
      </>
    )
  }
}

/**
 * React component that renders the graphics modal, which allows the user
 * to view and edit map graphics.
 * @param {GraphicsModalProps} props Component props.
 */
export default function GraphicsModal (props) {
  const dimensions = {
    width: constants.ROOT_FONT_SIZE * 40,
    height: constants.ROOT_FONT_SIZE * 27.5
  }
  const position = centerPos(dimensions, props.vwDimensions)
  const renderGraphic = createGraphicRenderer(props.setGraphic)

  return (
    <ItemEditor
      id='graphics'
      isOpen={props.isOpen}
      position={position}
      dimensions={dimensions}
      itemName='Graphic'
      headerContent='Map Graphics'
      closeModal={props.closeModal}
      listItemStyle={{
        fontSize: '0.85rem',
        paddingTop: '0.6rem',
        paddingBottom: '0.6rem'
      }}
      items={props.graphics}
      listItemDimensions={ITEM_DIMENSIONS}
      renderItem={renderGraphic}
      newItem={() => {
        if (props.graphics.length + 1 > MAX_GRAPHICS) {
          props.setError(new Error(`Maximum of ${MAX_GRAPHICS} graphics per map.`))
          return
        }

        props.openNewGraphicModal()
      }}
      deleteItem={name => {
        if (Validate.REQUIRED.GRAPHICS.includes(name)) {
          // Thou shall not delete a required graphic.
          props.setError(new Error(`The ${name.toLowerCase()} graphic is required.`))
          return false
        }

        props.deleteGraphic(name)
        return true
      }}
    />
  )
}
