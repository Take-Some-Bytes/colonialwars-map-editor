/* eslint-env react */
/**
 * @fileoverview React component that allows you to construct tables
 * that only have one purpose: to render a table with two columns.
 */

import React from 'react'

/**
 * @typedef {Object} Column
 * @prop {string} name
 * @prop {any} content
 *
 * @typedef {Object} TwoColTableProps
 * @prop {React.ReactNode} children
 * @prop {string} tableID
 * @prop {string} className
 * @prop {string} rowClassName
 * @prop {string} bodyClassName
 * @prop {string} itemClassName
 * @prop {string} [headerClassName='']
 * @prop {boolean} [hasHeaders=false]
 * @prop {[string, string]} [headers=[]]
 *
 * @typedef {Object} RowProps
 * @prop {string} className
 * @prop {string} nameClassName
 * @prop {string} itemClassName
 * @prop {string} name
 * @prop {React.ReactNode} children
 */

/**
 * A ``Row`` component represents a row of a ``TwoColTable``.
 * @param {RowProps} props Component props.
 */
export function Row (props) {
  return (
    <tr
      className={props.className}
    >
      <td className={props.nameClassName}>{props.name}</td>
      <td className={props.itemClassName}>{props.children}</td>
    </tr>
  )
}

/**
 * A ``TwoColTable`` component allows you to create HTML tables with
 * only *two* columns. Headers are not supported.
 * @param {TwoColTableProps} props Component props.
 * @returns {JSX.Element}
 */
export default function TwoColTable (props) {
  const headerClassName = props.headerClassName || ''
  const headers = props.headers || []

  return (
    <table id={props.tableID} className={props.className}>
      <thead
        style={{
          display: props.hasHeaders
            ? 'block'
            : 'none'
        }}
        className={headerClassName}
      >
        <tr>
          <th>{headers[0]}</th>
          <th>{headers[1]}</th>
        </tr>
      </thead>
      <tbody className={props.bodyClassName}>
        {props.children}
      </tbody>
    </table>
  )
}
