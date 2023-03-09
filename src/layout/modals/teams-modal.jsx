/* eslint-env react */
/**
 * @fileoverview React component for the ``Map Teams`` modal.
 */

import React from 'react'

import { bound } from 'colonialwars-lib/math'
import { Validate } from 'colonialwars-lib/mapconfig'

import ItemEditor, { ItemDisplayRow } from '../../components/item-editor.jsx'

import constants from '../../constants.js'
import { centerPos } from '../../helpers/display-utils.js'

const ITEM_DIMENSIONS = Object.freeze({
  width: constants.ROOT_FONT_SIZE * 10.5,
  height: constants.ROOT_FONT_SIZE * 2.25
})
const MAX_TEAMS = Validate.LIMITS.MAX_TEAMS
const MIN_TEAMS = Validate.LIMITS.MIN_TEAMS

/**
 * @typedef {import('colonialwars-lib/mapconfig').MutableMapConfig['updateTeam']} UpdateTeam
 * @typedef {import('colonialwars-lib/mapconfig').Team} Team
 * @typedef {import('colonialwars-lib/math').Vector2D} Vector2D
 */
/**
 * @typedef {Object} TeamsModalProps
 * @prop {boolean} isOpen
 * @prop {Array<Team>} teams
 * @prop {Vector2D} mapLimits
 * @prop {() => void} closeModal
 * @prop {() => void} openNewTeamModal
 * @prop {UpdateTeam} updateTeam
 * @prop {(name: string) => void} deleteTeam
 * @prop {React.Dispatch<any>} setError
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 */

/**
 * Returns a function that renders a specific team.
 * @param {Vector2D} mapLimits The current limits of the map.
 * @param {UpdateTeam} updateTeam Update a team.
 * @returns {(team: Team) => JSX.Element}
 */
function createTeamRenderer (mapLimits, updateTeam) {
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
            min={Validate.LIMITS.MIN_PLAYERS_ON_TEAM}
            onChange={e => {
              updateTeam(team.name, {
                maxPlayers: Number(e.target.value)
              })
            }}
            onBlur={e => {
              const boundVal = bound(
                Number(e.target.value), 1,
                Validate.LIMITS.MAX_PLAYERS_ON_TEAM
              )
              updateTeam(team.name, {
                maxPlayers: boundVal
              })
            }}
          />
        </ItemDisplayRow>
        <ItemDisplayRow name='Description'>
          <input
            type='text'
            name='description'
            value={team.description}
            onChange={e => {
              updateTeam(team.name, {
                description: String(e.target.value).slice(
                  0, Validate.LIMITS.MAX_TEAM_DESC_LEN
                )
              })
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
              updateTeam(team.name, {
                spawnPosition: newPos
              })
            }}
            onBlur={e => {
              // Bind the value.
              const newPos = {
                x: Math.round(bound(Number(e.target.value) * 100, 0, mapLimits.x)),
                y: team.spawnPosition.y
              }
              updateTeam(team.name, {
                spawnPosition: newPos
              })
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
              updateTeam(team.name, {
                spawnPosition: newPos
              })
            }}
            onBlur={e => {
              // Bind the value
              const newPos = {
                x: team.spawnPosition.x,
                y: Math.round(bound(Number(e.target.value) * 100, 0, mapLimits.y))
              }
              updateTeam(team.name, {
                spawnPosition: newPos
              })
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
  const renderTeam = createTeamRenderer(props.mapLimits, props.updateTeam)
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

        return true
      }}
    />
  )
}
