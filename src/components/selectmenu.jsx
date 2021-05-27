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
 * @prop {string} name
 * @prop {string} value
 * @prop {string} arrowSrc
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
    <select
      id={props.id}
      name={props.name}
      onChange={props.onChange}
      className='ui-selectmenu ui-content ui-content--light ui-content--radius'
      style={{
        backgroundImage: `url('${props.arrowSrc}')`,
        height: `${props.dimensions.height}px`,
        width: `${props.dimensions.width}px`,
        display: 'block'
      }}
      value={props.value}
    >
      {props.options.map(option => (
        <option id={option.id} key={option.id} value={option.value}>
          {option.displayedText}
        </option>
      ))}
    </select>
  )
}
