/* eslint-env react */
/**
 * @fileoverview A react component to render a list with items that
 * could be added and removed.
 */

import React from 'react'

import Button from './button.jsx'
import DeleteButton from './del-button.jsx'

/**
 * @typedef {Object} BaseItem
 * @prop {string} id
 *
 * @typedef {Object} CurrentItemOps
 * @prop {() => JSX.Element} render
 * @prop {() => void} delete
 */
/**
 * @typedef {Object} ItemOps
 * @prop {(item: T) => JSX.Element} render
 * @prop {(id: string) => void} delete
 * @prop {() => void} create
 * @template {BaseItem} T
 */
/**
 * @typedef {Object} EditableListProps
 * @prop {string} collectiveItemName A string that could refer to all
 * items collectively (eg "All the [teams]").
 * @prop {React.Dispatch<any>} setError
 * @prop {ItemOps<T>} itemOps An object containing actions that
 * may be performed on the items in this list.
 * @prop {Array<T>} items
 * @prop {string} id
 * @template {BaseItem} T
 */
/**
 * @typedef {Object} EditableListItemProps
 * @prop {(id: string) => void} deleteItem
 * @prop {React.ReactNode} children
 * @prop {string} itemID
 */

/**
 * A React component to render each item of an EditableList.
 * @param {EditableListItemProps} props Component props.
 * @returns {JSX.Element}
 */
function EditableListItem (props) {
  return (
    <li
      id={`item-${props.itemID}`}
      className='ui-editable-list__list__item'
    >
      <div
        id={`item-${props.itemID}-content`}
        className='ui-editable-list__list__item__content'
      >
        {props.children}
      </div>
      <div
        id={`item-${props.itemID}-del-button-container`}
        className='ui-editable-list__list__item__del-button-container'
      >
        <DeleteButton
          buttonStyle={{ display: 'inline-block' }}
          id={`item-${props.itemID}-del-button`}
          onClick={() => props.deleteItem(props.itemID)}
        />
      </div>
    </li>
  )
}

/**
 * A React component to render lists with items which
 * can be removed and added.
 * @param {EditableListProps<T>} props Component props.
 * @returns {JSX.Element}
 * @template {BaseItem} T
 */
export default function EditableList (props) {
  return (
    <div
      id={`${props.id}-list-container`}
      className='ui-editable-list'
    >
      <ul
        className='ui-editable-list__list'
      >
        {props.items.map(item => (
          <EditableListItem
            key={item.id}
            itemID={item.id}
            deleteItem={props.itemOps.delete}
          >
            {props.itemOps.render(item)}
          </EditableListItem>
        ))}
      </ul>
      <Button
        className='ui-editable-list__new-item-button'
        onClick={() => props.itemOps.create()}
        small
      >
        New {props.collectiveItemName}
      </Button>
    </div>
  )
}
