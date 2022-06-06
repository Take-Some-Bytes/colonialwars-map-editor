/* eslint-env react */
/**
 * @fileoverview React component that returns all the modals of
 * this application.
 */

import React from 'react'
import debugFactory from 'debug'

import ErrorModal from './error-modal.jsx'
import NewMapModal from './new-map-modal.jsx'
import TeamsModal from './teams-modal.jsx'
import NewTeamModal from './new-team-modal.jsx'
import SettingsModal from './settings-modal.jsx'
import GraphicsModal from './graphics-modal.jsx'
import NewGraphicModal from './new-graphic-modal.jsx'

import MapConfig from '../../editor/map-config.js'
import ModifiersModal from './modifiers-modal.jsx'
import NewModifierModal from './new-modifier-modal.jsx'
import PlayerConfigModal from './player-config-modal.jsx'

const debug = debugFactory('cw-map-editor:modals')

/**
 * @typedef {Object} OpenClosable
 * @prop {boolean} open
 * @prop {React.Dispatch<React.SetStateAction<boolean>>} setOpen
 *
 * @typedef {Object} ModalsProps
 * @prop {Object} errorModalOpts
 * @prop {Error|null} errorModalOpts.error
 * @prop {React.Dispatch<any>} errorModalOpts.setError
 * @prop {OpenClosable} newMapModal
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 *
 * @typedef {Object} EditorModalsProps
 * @prop {OpenClosable} teamsModal
 * @prop {OpenClosable} settingsModal
 * @prop {OpenClosable} graphicsModal
 * @prop {OpenClosable} modifiersModal
 * @prop {OpenClosable} playerConfigModal
 * @prop {() => void} unsuspendEditor
 * @prop {React.Dispatch<any>} setError
 * @prop {React.DispatchWithoutAction} forceUpdate
 * @prop {import('../../editor/map-config').default} mapConfig
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 */

/**
 * A ``React.Fragment`` containing the modals required for the map editor.
 * @param {EditorModalsProps} props Component props.
 * @returns {JSX.Element}
 */
export function EditorModals (props) {
  const [newTeamModalOpen, setNewTeamModalOpen] = React.useState(false)
  const [newGraphicModalOpen, setNewGraphicModalOpen] = React.useState(false)
  const [newModifierModalOpen, setNewModifierModalOpen] = React.useState(false)
  const { mapConfig, forceUpdate } = props
  const { open: teamsModalOpen, setOpen: setTeamsModalOpen } = props.teamsModal
  const { open: settingsModalOpen, setOpen: setSettingsModalOpen } = props.settingsModal
  const { open: graphicsModalOpen, setOpen: setGraphicsModalOpen } = props.graphicsModal
  const { open: modifiersModalOpen, setOpen: setModifiersModalOpen } = props.modifiersModal
  const { open: playerConfigModalOpen, setOpen: setPlayerConfigModalOpen } = props.playerConfigModal

  /**
   * Safely call ``func`` and force update this component.
   * @param {() => void} func The function to call.
   * @returns {(...args: any[]) => void}
   */
  function safeCall (func) {
    return (...args) => {
      if (!(mapConfig instanceof MapConfig)) {
        // Do nothing.
        return
      }
      func(...args)
      /**
       * CONSIDER: Should we find a way to not have to force re-render?
       * Force updates go against React's philosophy (I think).
       * (06/20/2021) Take-Some-Bytes */
      // Force update here so modals would re-render and
      // show the updated map configurations.
      forceUpdate()
    }
  }
  /**
   * Show an error.
   * @param {string} msg The error message to show.
   */
  function showError (msg) {
    props.setError(new Error(msg))
  }

  const setTeam = safeCall(mapConfig?.setTeam?.bind?.(mapConfig))
  const deleteTeam = safeCall(mapConfig?.deleteTeam?.bind?.(mapConfig))
  const setGraphic = safeCall(mapConfig?.graphics?.set?.bind?.(mapConfig?.graphics))
  const deleteGraphic = safeCall(mapConfig?.graphics?.del?.bind?.(mapConfig?.graphics))
  const setModifier = safeCall(mapConfig?.modifiers?.set?.bind?.(mapConfig?.modifiers))
  const deleteModifier = safeCall(mapConfig?.modifiers?.del?.bind?.(mapConfig?.modifiers))

  return (
    <>
      <TeamsModal
        teams={(() => {
          if (
            !(mapConfig instanceof MapConfig) ||
            !Array.isArray(mapConfig.getTeams())
          ) {
            return []
          }
          return mapConfig.getTeams()
        })()}
        isOpen={teamsModalOpen}
        closeModal={() => {
          // Unsuspend the editor.
          props.unsuspendEditor()
          setTeamsModalOpen(false)
        }}
        vwDimensions={props.vwDimensions}
        setTeam={setTeam}
        deleteTeam={deleteTeam}
        mapLimits={mapConfig?.worldLimits}
        openNewTeamModal={() => {
          setNewTeamModalOpen(true)
        }}
        setError={props.setError}
      />
      <NewTeamModal
        isOpen={newTeamModalOpen}
        closeModal={() => {
          // No need to unsuspend the editor, as that is going to be
          // take care of by the "Map Teams" modal.
          setNewTeamModalOpen(false)
        }}
        vwDimensions={props.vwDimensions}
        mapLimits={mapConfig?.worldLimits}
        newTeam={setTeam}
      />
      <GraphicsModal
        isOpen={graphicsModalOpen}
        closeModal={() => {
          props.unsuspendEditor()
          setGraphicsModalOpen(false)
        }}
        graphics={mapConfig?.graphics?.all?.() || []}
        openNewGraphicModal={() => { setNewGraphicModalOpen(true) }}
        deleteGraphic={deleteGraphic}
        setGraphic={setGraphic}
        vwDimensions={props.vwDimensions}
        setError={props.setError}
      />
      <NewGraphicModal
        isOpen={newGraphicModalOpen}
        newGraphic={(id, opts) => {
          if (!(mapConfig instanceof MapConfig)) {
            // Do nothing.
            return
          }
          if (mapConfig.graphics.has(id)) {
            showError('Graphic already exists.')
            return
          }

          setGraphic(id, opts)
        }}
        closeModal={() => { setNewGraphicModalOpen(false) }}
        vwDimensions={props.vwDimensions}
        showError={showError}
      />
      <ModifiersModal
        setError={props.setError}
        isOpen={modifiersModalOpen}
        vwDimensions={props.vwDimensions}
        closeModal={() => {
          props.unsuspendEditor()
          setModifiersModalOpen(false)
        }}
        setModifier={setModifier}
        modifiers={mapConfig?.modifiers?.all?.() || []}
        openNewModifierModal={() => {
          setNewModifierModalOpen(true)
          debug('New modifier modal opened')
        }}
        deleteModifier={(name) => {
          debug('Modifier %s deleted', name)
          deleteModifier(name)
        }}
      />
      <NewModifierModal
        isOpen={newModifierModalOpen}
        vwDimensions={props.vwDimensions}
        closeModal={() => { setNewModifierModalOpen(false) }}
        showError={showError}
        newModifier={(id, opts) => {
          if (!(mapConfig instanceof MapConfig)) {
            // Do nothing.
            return
          }
          if (mapConfig.modifiers.has(id)) {
            showError('Modifier already exists.')
            return
          }

          setModifier(id, opts)
          debug('New modifier with ID %s created', id)
        }}
      />
      <SettingsModal
        isOpen={settingsModalOpen}
        closeModal={() => {
          props.unsuspendEditor()
          setSettingsModalOpen(false)
        }}
        vwDimensions={props.vwDimensions}
        mapConfig={mapConfig}
        forceUpdate={forceUpdate}
      />
      <PlayerConfigModal
        isOpen={playerConfigModalOpen}
        closeModal={() => {
          props.unsuspendEditor()
          setPlayerConfigModalOpen(false)
        }}
        vwDimensions={props.vwDimensions}
        mapConfig={mapConfig}
        forceUpdate={forceUpdate}
      />
    </>
  )
}

/**
 * A ``React.Fragment`` of most of the modals in this application.
 * @param {ModalsProps} props Component props.
 * @returns {JSX.Element}
 */
export default function Modals (props) {
  const { error, setError } = props.errorModalOpts
  const { open: mapModalOpen, setOpen: setMapModalOpen, ...mapRest } = props.newMapModal

  return (
    <>
      <ErrorModal
        isOpen={error instanceof Error}
        closeModal={() => { setError(null) }}
        vwDimensions={props.vwDimensions}
        error={error || {}}
      />
      <NewMapModal
        isOpen={mapModalOpen}
        vwDimensions={props.vwDimensions}
        closeModal={() => setMapModalOpen(false)}
        {...mapRest}
      />
    </>
  )
}
