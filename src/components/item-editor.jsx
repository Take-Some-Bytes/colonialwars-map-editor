/* eslint-env react */
/**
 * @fileoverview An ItemEditor modal gives a reusable API to create modals
 * that have a list of items, a button for creating new items, and an interface
 * to edit those items.
 */

import React from 'react'

import Button from './button.jsx'
import RadioList from './radio-list.jsx'
import CustomModal from './custom-modal.jsx'
import TwoColTable, { Row } from './two-col-table.jsx'

/**
 * @callback RenderItem
 * @param {T} currentItem
 * @returns {JSX.Element}
 * @template {BaseItem} T
 */
/**
 * @typedef {Object} BaseItem
 * @prop {string} id
 * @prop {string} name
 *
 * @typedef {import('./custom-modal').Dimensions} Dimensions
 * @typedef {import('./custom-modal').Position} Position
 */
/**
 * @typedef {Object} ItemEditorProps
 * @prop {(name: string) => void} deleteItem
 * @prop {RenderItem<T>} renderItem
 * @prop {React.Dispatch<any>} setError
 * @prop {React.CSSProperties} listItemStyle
 * @prop {Dimensions} listItemDimensions
 * @prop {VoidFunction} closeModal
 * @prop {Dimensions} dimensions
 * @prop {string} headerContent
 * @prop {VoidFunction} newItem
 * @prop {string} itemName
 * @prop {Position} position
 * @prop {Array<T>} items
 * @prop {number} maxItems
 * @prop {number} minItems
 * @prop {boolean} isOpen
 * @prop {string} id
 * @template {BaseItem} T
 */
/**
 * @typedef {Object} ItemsListProps
 * @prop {(itemName: string) => void} setSelectedItem
 * @prop {(msg: string) => void} showError
 * @prop {React.CSSProperties} itemStyle
 * @prop {Dimensions} itemDimensions
 * @prop {Array<T>} items
 * @prop {VoidFunction} newItem
 * @prop {string} itemName A collective name to refer to an item
 * @prop {number} maxItems
 * @prop {string} id
 * @template {BaseItem} T
 */
/**
 * @typedef {Object} ItemDisplayProps
 * @prop {RenderItem<T>} renderItem
 * @prop {boolean} itemSelected
 * @prop {string} itemName
 * @prop {(msg: string) => void} showError
 * @prop {(name: string) => void} deleteItem
 * @prop {T} item
 * @prop {number} numItems
 * @prop {number} minItems
 * @template {BaseItem} T
 */
/**
 * @typedef {Object} DeleteItemButtonProps
 * @prop {() => void} deleteCurrentItem
 * @prop {(msg: string) => void} showError
 * @prop {number} numItems
 * @prop {number} minItems
 * @prop {string} itemName A collective name to refer to an item
*/
/**
 * @typedef {Object} ItemDisplayRowProps
 * @prop {string} name
 * @prop {React.ReactNode} children
 */

/**
 * Renders a button which deletes the selected item.
 * @param {DeleteItemButtonProps} props Component props.
 * @returns {JSX.Element}
 */
function DeleteItemButton (props) {
  /**
   * Handles the click of the delete button.
   * @param {React.MouseEvent<HTMLButtonElement>} e The event.
   */
  function handleClick (e) {
    e.preventDefault()
    e.stopPropagation()

    if (props.numItems - 1 < props.minItems) {
      props.showError(
        `Minimum ${props.minItems} ${props.itemName.toLowerCase()}s per map.`
      )
      return
    }

    props.deleteCurrentItem()
  }

  return (
    <Button
      onClick={handleClick}
      className='float-right'
      style={{
        width: '10rem',
        height: '2.25rem',
        marginBottom: '0.5rem',
        boxSizing: 'border-box'
      }}
      small
    >
      Delete {props.itemName}
    </Button>
  )
}

/**
 * Displays a single item, and allows the user to edit it.
 * @param {ItemDisplayProps<T>} props Component props.
 * @returns {JSX.Element}
 * @template {BaseItem} T
 */
function ItemDisplay (props) {
  const noItemSelectedDisplay = props.itemSelected
    ? 'none'
    : 'block'
  const itemSelectedDisplay = props.itemSelected
    ? 'block'
    : 'none'
  const item = props.renderItem(props.item)

  // debugger
  return (
    <div className='ui-item-editor__item-display'>
      <p
        style={{ display: noItemSelectedDisplay }}
        className='ui-item-editor__item-display--no-team-selected'
      >
        No {props.itemName} Selected
      </p>
      <div style={{ display: itemSelectedDisplay }}>
        <DeleteItemButton
          deleteCurrentItem={() => {
            props.deleteItem(props.item.id)
          }}
          showError={props.showError}
          numItems={props.numItems}
          minItems={props.minItems}
          itemName={props.itemName}
        />
        <TwoColTable className='ui-item-editor__item-display__table'>
          {item}
        </TwoColTable>
      </div>
    </div>
  )
}

/**
 * ItemsList component to render a list of all items that could be edited.
 * @param {ItemsListProps<T>} props Component props.
 * @returns {JSX.Element}
 * @template {BaseItem} T
 */
function ItemsList (props) {
  return (
    <div
      id={`${props.id}-list-container`}
      className='ui-item-editor__items-list'
    >
      <Button
        onClick={() => {
          if (props.items.length + 1 > props.maxItems) {
            props.showError(
              `Maximum ${props.maxItems} ${props.itemName.toLowerCase()}s per map.`
            )
            return
          }
          props.newItem()
        }}
        style={{
          width: '10.5rem',
          height: '2.25rem',
          marginBottom: '0.5rem',
          boxSizing: 'border-box',
          fontSize: '0.85rem'
        }}
        small
      >
        New {props.itemName}
      </Button>
      <RadioList
        name={props.id}
        items={props.items.map(item => ({
          id: item.id,
          value: item.id,
          checked: false,
          label: String(item.name)
        }))}
        itemDimensions={props.itemDimensions}
        onChange={(_, val, __) => {
          props.setSelectedItem(val)
        }}
        itemStyle={props.itemStyle}
      />
    </div>
  )
}

/**
 * Utility component for displaying standard rows in the table of the
 * ItemDisplayer
 * @param {ItemDisplayRowProps} props Component props.
 */
export function ItemDisplayRow (props) {
  return (
    <Row
      name={props.name}
      className='ui-item-editor__item-display__row'
      itemClassName='ui-item-editor__item-display__item'
      nameClassName='ui-item-editor__item-display__item-name'
    >
      {props.children}
    </Row>
  )
}

/**
 * An ItemEditor modal gives a reusable API to create modals that have a list
 * of items, a button for creating new items, and an interface to edit those items.
 * @param {ItemEditorProps<T>} props Component props.
 * @returns {JSX.Element}
 * @template {BaseItem} T
 */
export default function ItemEditor (props) {
  const [selectedItem, setSelectedItem] = React.useState(null)
  const itemToDisplay = props.items.find(item => item.id === selectedItem) || null

  /**
   * Shows an error on the error modal.
   * @param {string} msg The error message.
   */
  function showError (msg) {
    props.setError(new Error(msg))
  }

  return (
    <CustomModal
      id={`${props.id}-modal`}
      isOpen={props.isOpen}
      position={props.position}
      dimensions={props.dimensions}
      headerContent={props.headerContent}
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        setSelectedItem(null)
        props.closeModal()
      }}
    >
      <div className='ui-item-editor'>
        <ItemsList
          id={props.id}
          itemDimensions={props.listItemDimensions}
          setSelectedItem={itemName => {
            setSelectedItem(itemName)
          }}
          itemStyle={props.listItemStyle}
          showError={showError}
          items={props.items}
          itemName={props.itemName}
          newItem={props.newItem}
          maxItems={props.maxItems}
        />
        <ItemDisplay
          itemSelected={!!selectedItem}
          itemName={props.itemName}
          item={itemToDisplay}
          renderItem={props.renderItem}
          showError={showError}
          minItems={props.minItems}
          numItems={props.items.length}
          deleteItem={(...args) => {
            setSelectedItem(null)
            props.deleteItem(...args)
          }}
        />
      </div>
    </CustomModal>
  )
}