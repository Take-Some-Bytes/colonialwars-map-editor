/* eslint-env react */
/**
 * @fileoverview Selectmenu component.
 */

import React from 'react'

/**
 * @callback SelectmenuChangeHandler
 * @param {React.ChangeEvent<HTMLSelectElement>} e
 * @returns {void}
 *
 * @typedef {Record<'width'|'height', number>} Dimensions
 *
 * @typedef {Object} SelectOption
 * @prop {string} id
 * @prop {string} value
 * @prop {string} displayedText
 *
 * @typedef {Object} SelectmenuProps
 * @prop {string} id
 * @prop {string} arrowSrc
 * @prop {string} defaultValue
 * @prop {Dimensions} dimensions
 * @prop {Array<SelectOption>} options
 * @prop {SelectmenuChangeHandler} onChange
 */

/**
 * Selectmenu component.
 * @param {SelectmenuProps} props Component props.
 * @returns {JSX.Element}
 */
export default function Selectmenu (props) {
  return (
    <div
      id={`${props.id}-wrapper`}
      className='selectmenu-wrapper ui-content'
      style={{
        backgroundImage: `url('${props.arrowSrc}')`,
        width: `${props.dimensions.width}px`,
        height: `${props.dimensions.height}px`
      }}
    >
      <select
        id={props.id}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        className='selectmenu-content'
        style={{
          width: `${props.dimensions.width}px`,
          height: `${props.dimensions.height}px`
        }}
      >
        {props.options.map(option => (
          <option id={option.id} key={option.id} value={option.value}>
            {option.displayedText}
          </option>
        ))}
      </select>
    </div>
  )
}
