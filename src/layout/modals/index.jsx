/* eslint-env react */
/**
 * @fileoverview React component that returns all the modals of
 * this application.
 */

import React from 'react'

import ErrorModal from './error-modal.jsx'
import NewMapModal from './new-map-modal.jsx'
import MapTeamsModal from './teams-modal.jsx'
import NewTeamModal from './new-team-modal.jsx'
import MapSettingsModal from './settings-modal.jsx'

import MapConfig from '../../editor/map-config.js'

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
 * @prop {OpenClosable} mapTeamsModal
 * @prop {import('../../helpers/display-utils').ViewportDimensions} vwDimensions
 *
 * @typedef {Object} EditorModalsProps
 * @prop {OpenClosable} teamsModal
 * @prop {OpenClosable} mapSettingsModal
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
  const { mapConfig, forceUpdate } = props
  const { open: teamsModalOpen, setOpen: setTeamsModalOpen } = props.teamsModal
  const { open: settingsModalOpen, setOpen: setSettingsModalOpen } = props.mapSettingsModal

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
      // Force update here so teams modal would re-render and show
      // the updated map team configurations.
      forceUpdate()
    }
  }
  const setTeam = safeCall(mapConfig?.setTeam?.bind?.(mapConfig))
  const deleteTeam = safeCall(mapConfig?.deleteTeam?.bind?.(mapConfig))

  return (
    <>
      <MapTeamsModal
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
        openNewTeamsModal={() => {
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
      <MapSettingsModal
        isOpen={settingsModalOpen}
        closeModal={() => {
          props.unsuspendEditor()
          setSettingsModalOpen(false)
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
  const modalPosition = {
    x: Math.round(props.vwDimensions.width / 2) - 550 / 2,
    y: Math.round(props.vwDimensions.height / 2) - 550 / 2
  }
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
        position={modalPosition}
        closeModal={() => setMapModalOpen(false)}
        {...mapRest}
      />
    </>
  )
}
