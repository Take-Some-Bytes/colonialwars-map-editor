/* eslint-env react */
/**
 * @fileoverview React component for the ``Map Teams`` modal.
 */

import React from 'react'

import Button from '../../components/button.jsx'
import RadioList from '../../components/radio-list.jsx'
import CustomModal from '../../components/custom-modal.jsx'
import TwoColTable, { Row } from '../../components/two-col-table.jsx'

import constants from '../../constants.js'
import Vector2D from '../../editor/physics/vector2d.js'

import { bound, centerPos } from '../../helpers/math-utils.js'

const ITEM_DIMENSIONS = Object.freeze({
  width: 210,
  height: 45
})

/**
 * @callback SetTeam
 * @param {string} [name]
 * @param {import('../../editor/physics/vector2d').default} [spawnPosition]
 * @param {number} [maxPlayers]
 * @param {string} [desc]
 * @returns {void}
 */

/**
 * @typedef {import('../../editor/map-config').Team} Team
 *
 * @typedef {Object} MapTeamsModalProps
 * @prop {React.Dispatch<any>} setError
 * @prop {Array<Team>} teams
 * @prop {(name: string) => void} deleteTeam
 * @prop {boolean} isOpen
 * @prop {() => void} closeModal
 * @prop {SetTeam} setTeam
 * @prop {() => void} openNewTeamsModal
 * @prop {import('../../editor/physics/vector2d').default} mapLimits
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 *
 * @typedef {Object} TeamsListProps
 * @prop {Array<string>} teams
 * @prop {() => void} newTeam
 * @prop {(msg: string) => void} showError
 * @prop {React.Dispatch<any>} setSelectedTeam
 *
 * @typedef {Object} TeamEditorProps
 * @prop {boolean} teamSelected
 * @prop {string} teamName
 * @prop {number} teamMaxPlayers
 * @prop {string} teamDescription
 * @prop {import('../../editor/physics/vector2d').default} mapLimits
 * @prop {import('../../editor/physics/vector2d').default} teamSpawnPoint
 * @prop {SetTeam} modifyTeam
 * @prop {(msg: string) => void} showError
 * @prop {(name: string) => void} deleteTeam
 * @prop {number} numTeams
 *
 * @typedef {Object} TeamEditorRowProps
 * @prop {string} name
 * @prop {React.ReactNode} children
 *
 * @typedef {Object} DeleteTeamButtonProps
 * @prop {() => void} deleteCurrentTeam
 * @prop {(msg: string) => void} showError
 * @prop {number} numTeams
 */

/**
 * The component that renders a list of all the teams.
 * @param {TeamsListProps} props Component props.
 * @returns {JSX.Element}
 */
function TeamsList (props) {
  return (
    <div
      id='teams-list-container'
      className='teams-modal__teams-list'
    >
      <RadioList
        name='teams'
        items={props.teams.map((team, i) => ({
          id: team,
          value: team,
          checked: false,
          label: String(team)
        }))}
        itemDimensions={ITEM_DIMENSIONS}
        onChange={(_, val, __) => {
          props.setSelectedTeam(val)
        }}
        itemStyle={{
          fontSize: '0.85rem',
          paddingTop: '0.6rem',
          paddingBottom: '0.6rem'
        }}
      />
      <Button
        onClick={() => {
          if (props.teams.length + 1 > constants.MAP_CONFIG_LIMITS.MAX_TEAMS) {
            props.showError(
              `Maximum ${constants.MAP_CONFIG_LIMITS.MAX_TEAMS} teams per map.`
            )
            return
          }
          props.newTeam()
        }}
        style={{
          width: '10.5rem',
          height: '2.25rem',
          marginTop: '0.5rem',
          boxSizing: 'border-box',
          fontSize: '0.85rem'
        }}
        small
      >
        New Team
      </Button>
    </div>
  )
}

/**
 * Renders a button which deletes the selected team.
 * @param {DeleteTeamButtonProps} props Component props.
 * @returns {JSX.Element}
 */
function DeleteTeamButton (props) {
  /**
   * Handles the click of the delete button.
   * @param {React.MouseEvent<HTMLButtonElement>} e The event.
   */
  function handleClick (e) {
    e.preventDefault()
    e.stopPropagation()

    if (props.numTeams - 1 < constants.MAP_CONFIG_LIMITS.MIN_TEAMS) {
      props.showError('Minimum 2 teams on a map.')
      return
    }

    props.deleteCurrentTeam()
  }

  return (
    <Button
      onClick={handleClick}
      style={{
        width: '200px',
        height: '45px',
        marginTop: '10px',
        boxSizing: 'border-box'
      }}
      small
    >
      Delete Team
    </Button>
  )
}

/**
 * Helper component for rendering a row on a two-column table in
 * the team editor panel.
 * @param {TeamEditorRowProps} props Component props.
 */
function TeamEditorRow (props) {
  return (
    <Row
      name={props.name}
      className='teams-modal__team-editor__row'
      itemClassName='teams-modal__team-editor__item'
    >
      {props.children}
    </Row>
  )
}

/**
 * A TeamEditor component that renders a panel where a team could be edited.
 * @param {TeamEditorProps} props Component props.
 * @returns {JSX.Element}
 */
function TeamEditor (props) {
  const noTeamSelectedDisplay = props.teamSelected
    ? 'none'
    : 'block'
  const teamSelectedDisplay = props.teamSelected
    ? 'block'
    : 'none'

  return (
    <div className='teams-modal__team-editor'>
      <p
        style={{ display: noTeamSelectedDisplay }}
        className='teams-modal__team-editor--no-team-selected'
      >
        No team selected
      </p>
      <div
        style={{ display: teamSelectedDisplay }}
      >
        <TwoColTable className='teams-modal__team-editor__table'>
          <TeamEditorRow name='Name'>
            {props.teamName}
          </TeamEditorRow>
          <TeamEditorRow name='Max Players'>
            <input
              type='number'
              name='maxPlayers'
              value={props.teamMaxPlayers}
              min={constants.MAP_CONFIG_LIMITS.MIN_PLAYERS_ON_TEAM}
              onChange={e => {
                props.modifyTeam(
                  props.teamName, null, Number(e.target.value), null
                )
              }}
              onBlur={e => {
                const boundVal = bound(
                  Number(e.target.value), 1,
                  constants.MAP_CONFIG_LIMITS.MAX_PLAYERS_ON_TEAM
                )
                props.modifyTeam(
                  props.teamName, null, boundVal, null
                )
              }}
            />
          </TeamEditorRow>
          <TeamEditorRow name='Description'>
            <input
              type='text'
              name='description'
              value={props.teamDescription}
              onChange={e => {
                props.modifyTeam(
                  props.teamName, null, null,
                  String(e.target.value).slice(
                    0, constants.MAP_CONFIG_LIMITS.MAX_TEAM_DESC_LEN
                  )
                )
              }}
            />
          </TeamEditorRow>
          <TeamEditorRow name='Spawn Position'>
            x:&nbsp;
            <input
              type='number'
              name='teamSpawnPoint.x'
              min={0}
              max={props.mapLimits.x}
              value={props.teamSpawnPoint.x}
              style={{ width: '80px' }}
              onChange={e => {
                const newPos = {
                  x: Number(e.target.value),
                  y: props.teamSpawnPoint.y
                }
                props.modifyTeam(
                  props.teamName, newPos, null, null)
              }}
              onBlur={e => {
                // Bind the value.
                const newPos = {
                  x: bound(Number(e.target.value), 0, props.mapLimits.x),
                  y: props.teamSpawnPoint.y
                }
                props.modifyTeam(
                  props.teamName, newPos, null, null
                )
              }}
            /><br />
            y:&nbsp;
            <input
              type='number'
              name='teamSpawnPoint.y'
              min={0}
              max={props.mapLimits.y}
              value={props.teamSpawnPoint.y}
              style={{ width: '80px' }}
              onChange={e => {
                const newPos = {
                  x: props.teamSpawnPoint.x,
                  y: Number(e.target.value)
                }
                props.modifyTeam(
                  props.teamName, newPos, null, null
                )
              }}
              onBlur={e => {
                // Bind the value
                const newPos = {
                  x: props.teamSpawnPoint.x,
                  y: bound(Number(e.target.value), 0, props.mapLimits.y)
                }
                props.modifyTeam(
                  props.teamName, newPos, null, null
                )
              }}
            />
          </TeamEditorRow>
        </TwoColTable>
        <DeleteTeamButton
          showError={props.showError}
          deleteCurrentTeam={() => {
            props.deleteTeam(props.teamName)
          }}
          numTeams={props.numTeams}
        />
      </div>
    </div>
  )
}

/**
 * The React component representing the ``Map Teams`` modal, which gives the
 * user a way to modify the teams of a specific map.
 * @param {MapTeamsModalProps} props Component props.
 */
export default function MapTeamsModal (props) {
  const [selectedTeam, setSelectedTeam] = React.useState(null)
  const teamToDisplay = props.teams.filter(
    team => team.name === selectedTeam
  )[0] || {
    name: '',
    maxPlayers: '',
    description: '',
    spawnPosition: Vector2D.zero()
  }
  const dimensions = { width: 800, height: 600 }
  const position = centerPos(dimensions, props.vwDimensions)

  /**
   * Shows an error on the error modal.
   * @param {string} msg The error message.
   */
  function showError (msg) {
    props.setError(new Error(msg))
  }

  return (
    <CustomModal
      id='map-teams-modal'
      isOpen={props.isOpen}
      position={position}
      dimensions={dimensions}
      headerContent='Map Teams'
      onCloseRequest={e => {
        e.stopPropagation()
        e.preventDefault()
        /**
         * XXX: Should we set the selected team to null?
         * We could possibly save the last-selected team...
         * (06/19/2021) Take-Some-Bytes */
        setSelectedTeam(null)
        props.closeModal()
      }}
    >
      <div className='teams-modal'>
        <TeamsList
          teams={props.teams.map(team => team.name)}
          setSelectedTeam={setSelectedTeam}
          showError={showError}
          newTeam={props.openNewTeamsModal}
        />
        <TeamEditor
          teamSelected={!!selectedTeam}
          teamName={teamToDisplay.name}
          teamMaxPlayers={teamToDisplay.maxPlayers}
          teamDescription={teamToDisplay.description}
          teamSpawnPoint={teamToDisplay.spawnPosition}
          mapLimits={props.mapLimits}
          modifyTeam={props.setTeam}
          showError={showError}
          deleteTeam={(...args) => {
            setSelectedTeam(null)
            props.deleteTeam(...args)
          }}
          numTeams={props.teams.length}
        />
      </div>
    </CustomModal>
  )
}
