/* eslint-env react */
/**
 * @fileoverview React component for the ``Map Teams`` modal.
 */

import React from 'react'

import ItemEditor, { ItemDisplayRow } from '../../components/item-editor.jsx'

import constants from '../../constants.js'
import { bound, centerPos } from '../../helpers/math-utils.js'

const ITEM_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 10.5,
  height: constants.ROOT_FONT_SIZE * 2.25
})
const MAX_TEAMS = constants.MAP_CONFIG_LIMITS.MAX_TEAMS
const MIN_TEAMS = constants.MAP_CONFIG_LIMITS.MIN_TEAMS

/**
 * @callback SetTeam
 * @param {string} [name]
 * @param {import('../../editor/physics/vector2d').default} [spawnPosition]
 * @param {number} [maxPlayers]
 * @param {string} [desc]
 * @returns {void}
 */
/**
 * @typedef {import('../../editor/physics/vector2d').default} Vector2D
 * @typedef {import('../../editor/map-config').Team} Team
 */
/**
 * @typedef {Object} TeamsModalProps
 * @prop {React.Dispatch<any>} setError
 * @prop {Array<Team>} teams
 * @prop {(name: string) => void} deleteTeam
 * @prop {boolean} isOpen
 * @prop {() => void} closeModal
 * @prop {SetTeam} setTeam
 * @prop {() => void} openNewTeamModal
 * @prop {Vector2D} mapLimits
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 */

/**
 * Returns a function that renders a specific team.
 * @param {Vector2D} mapLimits The current limits of the map.
 * @param {SetTeam} setTeam Set a team.
 * @returns {(team: Team) => JSX.Element}
 */
function createTeamRenderer (mapLimits, setTeam) {
  return team => {
    // We do this to avoid changing the below inputs from
    // uncontrolled to controlled inputs.
    // Why? ``team`` MAY be undefined or null.
    team ??= {
      name: 'Nope',
      maxPlayers: 1,
      description: 'This is not a real team.',
      spawnPosition: { x: 0, y: 0 }
    }

    return (
      <>
        <ItemDisplayRow name='Name'>
          {team.name}
        </ItemDisplayRow>
        <ItemDisplayRow name='Max Players'>
          <input
            type='number'
            name='maxPlayers'
            value={team.maxPlayers}
            min={constants.MAP_CONFIG_LIMITS.MIN_PLAYERS_ON_TEAM}
            onChange={e => {
              setTeam(
                team.name, null, Number(e.target.value), null
              )
            }}
            onBlur={e => {
              const boundVal = bound(
                Number(e.target.value), 1,
                constants.MAP_CONFIG_LIMITS.MAX_PLAYERS_ON_TEAM
              )
              setTeam(
                team.name, null, boundVal, null
              )
            }}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Description'>
          <input
            type='text'
            name='description'
            value={team.description}
            onChange={e => {
              setTeam(
                team.name, null, null,
                String(e.target.value).slice(
                  0, constants.MAP_CONFIG_LIMITS.MAX_TEAM_DESC_LEN
                )
              )
            }}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Spawn Position'>
          x:&nbsp;
          <input
            type='number'
            name='teamSpawnPoint.x'
            min={0}
            max={mapLimits.x / 100}
            value={team.spawnPosition.x / 100}
            style={{ width: '80px' }}
            onChange={e => {
              const newPos = {
                x: Number(e.target.value) * 100,
                y: team.spawnPosition.y
              }
              setTeam(team.name, newPos, null, null)
            }}
            onBlur={e => {
              // Bind the value.
              const newPos = {
                x: Math.round(bound(Number(e.target.value) * 100, 0, mapLimits.x)),
                y: team.spawnPosition.y
              }
              setTeam(team.name, newPos, null, null)
            }}
            step={0.01}
          /><br />
          y:&nbsp;
          <input
            type='number'
            name='teamSpawnPoint.y'
            min={0}
            max={mapLimits.y / 100}
            value={team.spawnPosition.y / 100}
            style={{ width: '80px' }}
            onChange={e => {
              const newPos = {
                x: team.spawnPosition.x,
                y: Number(e.target.value) * 100
              }
              setTeam(team.name, newPos, null, null)
            }}
            onBlur={e => {
              // Bind the value
              const newPos = {
                x: team.spawnPosition.x,
                y: Math.round(bound(Number(e.target.value) * 100, 0, mapLimits.y))
              }
              setTeam(team.name, newPos, null, null)
            }}
            step={0.01}
          />
        </ItemDisplayRow>
      </>
    )
  }
}

/**
 * The React component representing the ``Map Teams`` modal, which gives the
 * user a way to modify the teams of a specific map.
 * @param {TeamsModalProps} props Component props.
 */
export default function TeamsModal (props) {
  const dimensions = {
    width: constants.ROOT_FONT_SIZE * 40,
    height: constants.ROOT_FONT_SIZE * 27.5
  }
  const position = centerPos(dimensions, props.vwDimensions)
  const renderTeam = createTeamRenderer(props.mapLimits, props.setTeam)
  const teams = props.teams.map(team => ({
    ...team,
    id: team.name
  }))

  return (
    <ItemEditor
      id='teams'
      isOpen={props.isOpen}
      position={position}
      dimensions={dimensions}
      itemName='Team'
      headerContent='Map Teams'
      closeModal={props.closeModal}
      listItemStyle={{
        fontSize: '0.85rem',
        paddingTop: '0.6rem',
        paddingBottom: '0.6rem'
      }}
      listItemDimensions={ITEM_DIMENSIONS}
      items={teams}
      renderItem={renderTeam}
      newItem={() => {
        if (teams.length + 1 > MAX_TEAMS) {
          props.setError(new Error(`Maximum of ${MAX_TEAMS} teams per map.`))
          return
        }

        props.openNewTeamModal()
      }}
      deleteItem={name => {
        if (teams.length - 1 < MIN_TEAMS) {
          props.setError(new Error(`Minimum of ${MIN_TEAMS} teams per map.`))
          return
        }

        props.deleteTeam(name)
      }}
    />
  )
}
