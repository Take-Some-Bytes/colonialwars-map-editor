/* eslint-env react */
/**
 * @fileoverview RadioList component that renders a visual list of
 * radio buttons.
 */

import React from 'react'

/**
 * @callback ChangeHandler
 * @param {HTMLInputElement} input
 * @param {string} inputVal
 * @param {HTMLLabelElement} label
 * @returns {void}
 */

/**
 * @typedef {Object} RadioItem
 * @prop {string} id
 * @prop {string} value
 * @prop {string} label
 * @prop {boolean} checked
 *
 * @typedef {Object} RadioListProps
 * @prop {string} name
 * @prop {ChangeHandler} onChange
 * @prop {Array<RadioItem>} items
 * @prop {React.CSSProperties} itemStyle
 * @prop {import('./custom-modal').Dimensions} itemDimensions
 *
 * @typedef {Object} RadioListItemProps
 * @prop {string} id
 * @prop {string} value
 * @prop {string} listName
 * @prop {boolean} checked
 * @prop {string} labelContent
 * @prop {React.CSSProperties} style
 * @prop {ChangeHandler} onInput
 */

/**
 * A component representing a single radio list item.
 * @param {RadioListItemProps} props Component props.
 * @returns {JSX.Element}
 */
function RadioListItem (props) {
  const style = props.style || {}
  const inputRef = React.useRef(null)
  const labelRef = React.useRef(null)

  return (
    <label
      id={`${props.id}-label`}
      htmlFor={props.id}
      role='radio'
      style={{ ...style, display: 'block' }}
      className='ui-radio-list__item ui-content ui-content--radius ui-content--light'
      onInput={() => props.onInput(
        inputRef.current, inputRef.current.value, labelRef
      )}
      ref={labelRef}
    >
      {props.labelContent}
      <input
        id={props.id}
        type='radio'
        name={props.listName}
        value={props.value}
        defaultChecked={props.checked}
        ref={inputRef}
      />
      <span className='ui-radio-list__checkmark' />
    </label>
  )
}

/**
 * A RadioList component creates a set of radio buttons that are
 * visually grouped into a list.
 * @param {RadioListProps} props Component props.
 * @returns {JSX.Element}
 */
export default function RadioList (props) {
  const itemStyle = {
    ...props.itemStyle || {},
    width: `${props.itemDimensions.width}px`,
    height: `${props.itemDimensions.height}px`
  }

  return (
    <div
      id={`ui-radio-list-${props.name}`}
      role='radiogroup'
      className='ui-radio-list'
    >
      {props.items.map(item => (
        <RadioListItem
          id={item.id}
          key={item.id}
          value={item.value}
          style={itemStyle}
          checked={item.checked}
          onInput={props.onChange}
          listName={props.name}
          labelContent={item.label}
        />
      ))}
    </div>
  )
}
