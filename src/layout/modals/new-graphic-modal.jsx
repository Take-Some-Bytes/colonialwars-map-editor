/* eslint-env react */
/**
 * @fileoverview ``NewGraphicModal`` component that handles the rendering of a
 * modal to create a new graphic.
 */

import React from 'react'

import Button from '../../components/button.jsx'
import Selectmenu from '../../components/selectmenu.jsx'
import CustomModal from '../../components/custom-modal.jsx'

import constants from '../../constants.js'
import { centerPos } from '../../helpers/display-utils.js'

const SELECTMENU_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 12.5,
  height: constants.ROOT_FONT_SIZE * 2.25
})

/**
 * @callback NewGraphic
 * @param {string} id
 * @param {NewGraphicOptions} opts
 * @returns {void}
 */

/**
 * @typedef {import('../../helpers/display-utils').ViewportDimensions} ViewportDimensions
 *
 * @typedef {Object} NewGraphicOptions
 * @prop {string} name
 * @prop {string} file
 * @prop {Record<'x'|'y', number>} position
 * @prop {Record<'width'|'height', number} dimensions
 *
 * @typedef {Object} NewGraphicModalProps
 * @prop {boolean} isOpen
 * @prop {NewGraphic} newGraphic
 * @prop {VoidFunction} closeModal
 * @prop {React.Dispatch<any>} setError
 * @prop {ViewportDimensions} vwDimensions
 */

/**
 * A component to render a modal where the user could configure a new
 * graphic for the current map.
 * @param {NewGraphicModalProps} props Component props.
 */
export default function NewGraphicModal (props) {
  const [graphicConfig, setGraphicConfig] = React.useState({
    id: 'new_graphic',
    name: 'New Graphic',
    file: constants.SELECTABLE.GRAPHIC_FILES[0].value
  })
  const dimensions = {
    width: constants.ROOT_FONT_SIZE * 25,
    height: constants.ROOT_FONT_SIZE * 25
  }
  const position = centerPos(dimensions, props.vwDimensions)

  /**
   * Handler for the when a modal input changes.
   * @param {React.ChangeEvent<HTMLInputElement>} e The DOM event.
   */
  function onChange (e) {
    e.stopPropagation()
    e.preventDefault()

    setGraphicConfig(prevConf => ({
      ...prevConf,
      [e.target.name]: String(e.target.value)
    }))
  }
  /**
   * Handler for when the OK button is clicked.
   * @param {React.MouseEvent<HTMLButtonElement>} e The DOM event.
   */
  function onOkButtonClick (e) {
    e.stopPropagation()
    e.preventDefault()

    if (graphicConfig.id.length > 52 || graphicConfig.id.length < 1) {
      props.setError(new Error('Graphic ID must be between 1 and 52 characters long.'))
    } else if (!constants.ID_REGEXP.test(graphicConfig.id)) {
      props.setError(new Error([
        'Invalid characters in graphic ID. ',
        'Only lowercase letters, numbers, and underscores are allowed.'
      ].join('')))
    } else if (!constants.NAME_REGEXP.test(graphicConfig.name)) {
      props.setError(new Error([
        'Invalid characters in graphic name, or graphic name is too long.. ',
        'Maximum 30 characters in graphic name, and only alphanumeric ',
        'characters and spaces are allowed.'
      ].join('')))
    } else {
      props.newGraphic(graphicConfig.id, {
        ...constants.DEFAULT.GRAPHIC_CONFIG,
        id: graphicConfig.id,
        name: graphicConfig.name,
        file: graphicConfig.file
      })
      props.closeModal()
    }
  }

  return (
    <CustomModal
      id='new-graphic-modal'
      isOpen={props.isOpen}
      headerContent='New Graphic'
      position={position}
      dimensions={dimensions}
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        props.closeModal()
      }}
      footerContent={(
        <div className='float-right'>
          <Button onClick={onOkButtonClick} style={{ margin: '0.6rem' }} small>
            OK
          </Button>
        </div>
      )}
    >
      Graphic ID:&nbsp;
      <input
        type='text'
        name='id'
        value={graphicConfig.id}
        onChange={onChange}
      /><br />
      Graphic Name:&nbsp;
      <input
        type='text'
        name='name'
        value={graphicConfig.name}
        onChange={onChange}
      /><br />
      Graphic File:&nbsp;
      <Selectmenu
        id='graphic-path-select'
        name='file'
        arrowSrc='/imgs/drop-down-arrow.png'
        dimensions={SELECTMENU_DIMENSIONS}
        value={graphicConfig.file}
        options={constants.SELECTABLE.GRAPHIC_FILES}
        onChange={onChange}
      />
    </CustomModal>
  )
}
