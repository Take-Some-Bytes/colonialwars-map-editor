/* eslint-env react */
/**
 * @fileoverview ``NewTeamModal`` component that renders a modal for the user
 * to configure a new team with.
 */

import React from 'react'

import Button from '../../components/button.jsx'
import CustomModal from '../../components/custom-modal.jsx'

import constants from '../../constants.js'
import Vector2D from '../../editor/physics/vector2d.js'

import { bound, centerPos } from '../../helpers/math-utils.js'

/**
 * @callback NewTeam
 * @param {string} name
 * @param {Vector2D} spawnPosition
 * @param {number} maxPlayers
 * @param {string} desc
 * @returns {void}
 */

/**
 * @typedef {import('../../helpers/display-utils').ViewportDimensions} ViewportDimensions
 *
 * @typedef {Object} NewTeamModalProps
 * @prop {ViewportDimensions} vwDimensions
 * @prop {() => void} closeModal
 * @prop {Vector2D} mapLimits
 * @prop {NewTeam} newTeam
 * @prop {boolean} isOpen
 */

/**
 * A component to render a modal where the user could configure
 * a new team for the current map.
 * @param {NewTeamModalProps} props Component props.
 * @returns {JSX.Element}
 */
export default function NewTeamModal (props) {
  const [teamConfig, setTeamConfig] = React.useState({
    name: 'New Team',
    maxPlayers: 1,
    description: 'New Team',
    spawnPosition: Vector2D.zero()
  })
  const dimensions = {
    width: constants.ROOT_FONT_SIZE * 20,
    height: constants.ROOT_FONT_SIZE * 20
  }
  const position = centerPos(dimensions, props.vwDimensions)

  /**
   * Update event handler.
   * @param {React.ChangeEvent<HTMLInputElement>} e The event.
   */
  function onUpdate (e) {
    if (e.target.name.startsWith('spawnPosition')) {
      setTeamConfig(prevConf => ({
        ...prevConf,
        spawnPosition: Vector2D.fromObject({
          ...prevConf.spawnPosition.asObject(),
          [e.target.name.slice(14)]: Number(e.target.value)
        })
      }))
    } else {
      setTeamConfig(prevConf => ({
        ...prevConf,
        [e.target.name]: e.target.name === 'maxPlayers'
          // If we're setting maxPlayers, we need a number.
          // Otherwise, a string would do fine.
          ? Number(e.target.value)
          : String(e.target.value).slice(
            0, constants.MAP_CONFIG_LIMITS.MAX_TEAM_DESC_LEN
          )
      }))
    }
  }
  /**
   * Blur event handler. This method is mainly for binding some values
   * to their respective minimums and maximums.
   * @param {React.FocusEvent<HTMLInputElement>} e The event.
   */
  function onBlur (e) {
    if (e.target.name.startsWith('spawnPosition')) {
      const axis = e.target.name.slice(14)
      // Spawn position of team must be within map limits.
      setTeamConfig(prevConf => ({
        ...prevConf,
        spawnPosition: Vector2D.fromObject({
          ...prevConf.spawnPosition.asObject(),
          [axis]: bound(
            Number(e.target.value), 0, props.mapLimits[axis]
          )
        })
      }))
    } else if (e.target.name === 'maxPlayers') {
      // Number of players on the team must be within its
      // respective constants.
      setTeamConfig(prevConf => ({
        ...prevConf,
        maxPlayers: bound(
          Number(e.target.value),
          constants.MAP_CONFIG_LIMITS.MIN_PLAYERS_ON_TEAM,
          constants.MAP_CONFIG_LIMITS.MAX_PLAYERS_ON_TEAM
        )
      }))
    } else if (e.target.name === 'name') {
      let teamName = e.target.value
      if (teamName.length < 1) {
        teamName = 'New Team'
      }

      setTeamConfig(prevConf => ({
        ...prevConf,
        name: teamName
      }))
    }
    // Do nothing otherwise.
  }
  /**
   * Handler for when the OK button is clicked.
   * @param {React.MouseEvent<HTMLButtonElement>} e The event.
   */
  function onOkButtonClick (e) {
    const {
      name, spawnPosition, maxPlayers, description
    } = teamConfig
    e.stopPropagation()
    e.preventDefault()

    props.newTeam(name, spawnPosition, maxPlayers, description)
    props.closeModal()
  }

  return (
    <CustomModal
      id='new-team-modal'
      isOpen={props.isOpen}
      headerContent='New Team'
      dimensions={dimensions}
      position={position}
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
      Team name:&nbsp;
      <input
        type='text'
        name='name'
        value={teamConfig.name}
        onChange={onUpdate}
        onBlur={onBlur}
      /><br />
      Max Players:&nbsp;
      <input
        type='number'
        name='maxPlayers'
        min={1}
        max={constants.MAP_CONFIG_LIMITS.MAX_PLAYERS_ON_TEAM}
        value={teamConfig.maxPlayers}
        onChange={onUpdate}
        onBlur={onBlur}
      /><br /><br />
      Description:&nbsp;
      <input
        type='text'
        name='description'
        value={teamConfig.description}
        onChange={onUpdate}
        onBlur={onBlur}
      /><br />
      Spawn Position:<br />
      &nbsp;&nbsp;&nbsp;&nbsp;X:&nbsp;
      <input
        type='number'
        name='spawnPosition.x'
        min={0}
        max={props.mapLimits?.x}
        value={teamConfig.spawnPosition.x}
        onChange={onUpdate}
        onBlur={onBlur}
        step={0.01}
      />
      &nbsp;&nbsp;&nbsp;&nbsp;Y:&nbsp;
      <input
        type='number'
        name='spawnPosition.y'
        min={0}
        max={props.mapLimits?.y}
        value={teamConfig.spawnPosition.y}
        onChange={onUpdate}
        onBlur={onBlur}
        step={0.01}
      />
    </CustomModal>
  )
}
