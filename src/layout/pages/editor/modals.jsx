/* eslint-env react, browser */
/**
 * @fileoverview Editor modal manager.
 */

import React from 'react'

import { MutableMapConfig } from 'colonialwars-lib/mapconfig'

import TeamsModal from '../../modals/teams-modal'
import NewTeamModal from '../../modals/new-team-modal'
import SettingsModal from '../../modals/settings-modal'
import GraphicsModal from '../../modals/graphics-modal'
import ModifiersModal from '../../modals/modifiers-modal'
import NewModifierModal from '../../modals/new-modifier-modal'
import PlayerConfigModal from '../../modals/player-config-modal'
import NewGraphicModal from '../../modals/new-graphic-modal'

/**
 * @typedef {(modal: symbol) => boolean} IsModalOpen
 * @typedef {(modal: symbol, open: boolean) => void} SetModalOpen
 */
/**
 * @typedef {Object} EditorModalsProps
 * @prop {IsModalOpen} isModalOpen
 * @prop {SetModalOpen} setModalOpen
 * @prop {VoidFunction} unpauseEditor
 * @prop {React.Dispatch<any>} setError
 * @prop {React.DispatchWithoutAction} forceUpdate
 * @prop {import('colonialwars-lib/mapconfig').MutableMapConfig} mapConfig
 * @prop {import('../../../helpers/display-utils').ViewportDimensions} vwDimensions
 */

/**
 * An object of all the modals and a symbol to represent each of them.
 */
export const Modals = {
  Teams: Symbol('kTeams'),
  Settings: Symbol('kSettings'),
  Graphics: Symbol('kGraphics'),
  Modifiers: Symbol('kModifiers'),
  PlayerConfig: Symbol('kPlayerConfig'),
  NewTeam: Symbol('kNewTeam'),
  NewGraphic: Symbol('kNewGraphic'),
  NewModifier: Symbol('kNewModifier')
}

/**
 * Hook to get the current editor modal state.
 * @returns {[IsModalOpen, SetModalOpen]}
 */
export function useEditorModalState () {
  const [openModals, setOpenModals] = React.useState([])

  return [
    (modal) => openModals.includes(modal),
    (modal, open) => setOpenModals(prev => {
      /**
       * XXX: We MUST copy the openModals array.
       * This is because we NEED to treat the previous state as immutable.
       * It's a requirement of React.
       *
       * And also, ``Object.is``, which is what React uses to compare previous
       * state to new state, doesn't treat arrays as different if it's not a
       * different array.
       * (09/13/2022) Take-Some-Bytes */
      const ret = prev.slice()

      if (open && !prev.includes(modal)) {
        ret.push(modal)
      }
      if (!open) {
        ret.splice(prev.indexOf(modal), 1)
      }

      return ret
    })
  ]
}

/**
 * A ``React.Fragment`` containing the modals required for the map editor.
 * @param {EditorModalsProps} props Component props.
 * @returns {JSX.Element}
 */
export default function EditorModals (props) {
  const {
    mapConfig, vwDimensions,
    isModalOpen, setModalOpen, forceUpdate, unpauseEditor
  } = props

  /**
   * Call the specified component and force update the editor.
   * @param {(args: any[]) => any} fn The function to call.
   * @returns {(args: any[]) => any}
   */
  function callAndUpdate (fn) {
    return (...args) => {
      if (!(mapConfig instanceof MutableMapConfig)) {
        return
      }

      fn(...args)

      /**
       * CONSIDER: Should we find a way to not have to force re-render?
       * Force updates go against React's philosophy (I think).
       * (06/20/2021) Take-Some-Bytes */
      forceUpdate()
    }
  }

  const addTeam = callAndUpdate(mapConfig?.addTeam?.bind?.(mapConfig))
  const updateTeam = callAndUpdate(mapConfig?.updateTeam?.bind?.(mapConfig))
  const deleteTeam = callAndUpdate(mapConfig?.deleteTeam?.bind?.(mapConfig))
  const setGraphic = callAndUpdate(mapConfig?.graphics?.set?.bind?.(mapConfig?.graphics))
  const deleteGraphic = callAndUpdate(mapConfig?.graphics?.del?.bind?.(mapConfig?.graphics))
  const setModifier = callAndUpdate(mapConfig?.modifiers?.set?.bind?.(mapConfig?.modifiers))
  const deleteModifier = callAndUpdate(mapConfig?.modifiers?.del?.bind?.(mapConfig?.modifiers))

  return (
    <>
      <PlayerConfigModal
        isOpen={isModalOpen(Modals.PlayerConfig)}
        mapConfig={mapConfig}
        vwDimensions={props.vwDimensions}
        forceUpdate={forceUpdate}
        closeModal={() => {
          unpauseEditor()
          setModalOpen(Modals.PlayerConfig, false)
        }}
      />
      <SettingsModal
        isOpen={isModalOpen(Modals.Settings)}
        mapConfig={mapConfig}
        vwDimensions={props.vwDimensions}
        forceUpdate={forceUpdate}
        closeModal={() => {
          unpauseEditor()
          setModalOpen(Modals.Settings, false)
        }}
      />
      <TeamsModal
        isOpen={isModalOpen(Modals.Teams)}
        mapLimits={mapConfig?.worldLimits}
        teams={mapConfig?.allTeams?.() || []}
        vwDimensions={vwDimensions}
        setError={props.setError}
        updateTeam={updateTeam}
        deleteTeam={deleteTeam}
        openNewTeamModal={() => setModalOpen(Modals.NewTeam, true)}
        closeModal={() => {
          unpauseEditor()
          setModalOpen(Modals.Teams, false)
        }}
      />
      <NewTeamModal
        isOpen={isModalOpen(Modals.NewTeam)}
        mapLimits={mapConfig?.worldLimits}
        vwDimensions={props.vwDimensions}
        addTeam={addTeam}
        closeModal={() => setModalOpen(Modals.NewTeam, false)}
      />
      <GraphicsModal
        isOpen={isModalOpen(Modals.Graphics)}
        vwDimensions={props.vwDimensions}
        setError={props.setError}
        setGraphic={setGraphic}
        deleteGraphic={deleteGraphic}
        graphics={Array.from(mapConfig?.graphics?.values?.())}
        openNewGraphicModal={() => { setModalOpen(Modals.NewGraphic, true) }}
        closeModal={() => {
          unpauseEditor()
          setModalOpen(Modals.Graphics, false)
        }}
      />
      <NewGraphicModal
        isOpen={isModalOpen(Modals.NewGraphic)}
        vwDimensions={props.vwDimensions}
        setError={props.setError}
        closeModal={() => setModalOpen(Modals.NewGraphic, false)}
        newGraphic={(id, opts) => {
          if (mapConfig.graphics.has(id)) {
            props.setError(new Error('Graphic already exists.'))
            return
          }

          setGraphic(id, opts)
        }}
      />
      <ModifiersModal
        isOpen={isModalOpen(Modals.Modifiers)}
        vwDimensions={props.vwDimensions}
        setError={props.setError}
        setModifier={setModifier}
        deleteModifier={deleteModifier}
        modifiers={Array.from(mapConfig?.modifiers?.values?.())}
        openNewModifierModal={() => setModalOpen(Modals.NewModifier, true)}
        closeModal={() => {
          unpauseEditor()
          setModalOpen(Modals.Modifiers, false)
        }}
      />
      <NewModifierModal
        isOpen={isModalOpen(Modals.NewModifier)}
        vwDimensions={props.vwDimensions}
        setError={props.setError}
        closeModal={() => setModalOpen(Modals.NewModifier, false)}
        newModifier={(id, opts) => {
          if (mapConfig.modifiers.has(id)) {
            props.setError(new Error('Modifier already exists.'))
            return
          }

          setModifier(id, opts)
        }}
      />
    </>
  )
}
