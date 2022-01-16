/* eslint-env react, browser */
/**
 * @fileoverview Custom color picker, built off react-color.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { ChromePicker } from 'react-color'

/**
 * @typedef {Record<'width'|'height', number>} Dimensions
 * @typedef {import('react-color').Color} Colour
 * @typedef {import('react-color').ColorChangeHandler} ColourChangeHandler
 */

/**
 * @typedef {Object} ColourPickerProps
 * @prop {Colour} colour
 * @prop {boolean} [enableAlpha=false] Whether to enable the alpha channel.
 * Default is false.
 * @prop {Dimensions} dimensions
 * @prop {ColourChangeHandler} onColourChange
 *
 * @typedef {Object} ColourPickerPopoverProps
 * @prop {Colour} colour
 * @prop {boolean} pickerOpen
 * @prop {boolean} enableAlpha
 * @prop {Dimensions} inputSize
 * @prop {ColourChangeHandler} onColourChange
 * @prop {React.MutableRefObject<HTMLElement>} pickerRef
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setPickerOpen
 */

/**
 * The popover for the colour picker window.
 * @param {ColourPickerPopoverProps} props Component props.
 */
function ColourPickerPopover (props) {
  let pickerPosition = { x: 0, y: 0 }

  if (props.pickerRef.current instanceof HTMLElement) {
    const boundingClientRect = props.pickerRef.current.getBoundingClientRect()
    pickerPosition = {
      x: boundingClientRect.x + 1,
      y: boundingClientRect.y + props.inputSize.height + 14
    }
  }

  return ReactDOM.createPortal((
    <div
      style={{
        display: props.pickerOpen
          ? 'block'
          : 'none',
        top: `${pickerPosition.y}px`,
        left: `${pickerPosition.x}px`
      }}
      className='ui-colour-picker__popover'
    >
      <div
        className='ui-colour-picker__popover__overlay'
        onClick={() => {
          console.log('boo')
          props.setPickerOpen(false)
        }}
      />
      <ChromePicker
        className='ui-colour-picker__popover__picker-window'
        color={props.colour}
        onChange={props.onColourChange}
        disableAlpha={!props.enableAlpha}
      />
    </div>
  ), document.body)
}

/**
 * Creates a colour picker. Looks like Chrome's picker.
 * @param {ColourPickerProps} props Component props.
 */
export default function ColourPicker (props) {
  const pickerRef = React.useRef(null)
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const enableAlpha = typeof props.enableAlpha === 'boolean'
    ? props.enableAlpha
    : false

  return (
    <>
      <div
        className='ui-content ui-radius ui-colour-picker'
        onClick={() => setPickerOpen(true)}
        ref={pickerRef}
      >
        <div
          style={{
            width: `${props.dimensions.width}px`,
            height: `${props.dimensions.height}px`,
            backgroundColor: `rgba(${props.colour.r}, ${props.colour.g}, ${props.colour.b}, ${props.colour.a})`
          }}
          className='ui-content ui-radius'
        />
      </div>
      <ColourPickerPopover
        pickerOpen={pickerOpen}
        setPickerOpen={setPickerOpen}
        pickerRef={pickerRef}
        enableAlpha={enableAlpha}
        inputSize={props.dimensions}
        colour={props.colour}
        onColourChange={props.onColourChange}
      />
    </>
  )
}
