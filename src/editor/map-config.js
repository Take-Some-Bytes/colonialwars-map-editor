/* eslint-env browser */
/**
 * @fileoverview MapConfig class to manage parsing and exporting map configurations.
 */

import Joi from 'joi'
import debugFactory from 'debug'

import constants from '../constants.js'
import Vector2D from './physics/vector2d.js'
import BoundMap from '../helpers/bound-map.js'
import { MapConfigSchema } from './config-schemas.js'

import * as mathUtils from '../helpers/math-utils.js'

const debug = debugFactory('cw-map-editor:map-config')
const { MAP_CONFIG_LIMITS } = constants

/**
 * @typedef {Record<'unit'|'building'|'graphics', string>} CWDataFiles
 * @typedef {Record<'x'|'y'|'w'|'h', number>} StaticImage
 * @typedef {Record<'x'|'y'|'w'|'h'|'frameSize', number>} DynAnimation
 * @typedef {'die'|'idle'|'walk'|'attack'|'reload'|'busy'|
 * 'cast'|'busyDamaged1'|'busyDamaged2'} DynAnimationKeys
 * @typedef {'mainImg'|'damaged1Img'|'damaged2Img'|'constructing1Img'} StaticImgKeys
 * @typedef {Record<'r'|'g'|'b'|'a', number} Rgba
 */
/**
 * @typedef {Object} Team
 * @prop {string} name
 * @prop {number} maxPlayers
 * @prop {string} description
 * @prop {import('./physics/vector2d').default} spawnPosition
 *
 * @typedef {Object} Graphic
 * @prop {string} id
 * @prop {string} name
 * @prop {string} file
 * @prop {number} angles
 * @prop {boolean} hasAnimations
 * @prop {StaticImage} mainImg
 * @prop {StaticImage} damaged1Img
 * @prop {StaticImage} damaged2Img
 * @prop {StaticImage} constructing1Img
 * @prop {Record<DynAnimationKeys, DynAnimation>} animations
 *
 * @typedef {Object} Modification
 * @prop {string} field
 * @prop {number} add
 * @prop {number} multiply
 *
 * @typedef {Object} Aura
 * @prop {string} modifier
 * @prop {number} range
 *
 * @typedef {Object} Modifier
 * @prop {string} id
 * @prop {string} name
 * @prop {string} description
 * @prop {number} duration
 * @prop {number} maxStack
 * @prop {Array<Modification>} modifications
 * @prop {Array<Aura>} auras
 * @prop {boolean} auraHitsSelf
 * @prop {boolean} auraHitsFriendly
 * @prop {boolean} auraHitsAllied
 * @prop {boolean} auraHitsEnemy
 * @prop {Rgba} auraColour
 * @prop {Array<string>} auraTargetFilters
 * @prop {Array<string>} auraTargetFiltersExclude
 * @prop {Array<string>} disableCommands
 * @prop {boolean} changeEntityImg
 * @prop {string} entityImg
 * @prop {boolean} changeAtkEffect
 * @prop {string} atkEffect
 * @prop {Array<string>} effects
 * @prop {string} sound
 * @prop {number} soundVolume
 * @prop {Array<string>} killModifiers
 */

/**
 * FieldMissingError to indicate that a field is missing,
 * whether in JSON or some other data.
 */
export class FieldMissingError extends Error {
  /**
   * Constructor for a FieldMissingError.
   * @param {string} whichField The name of the field that was missing.
   */
  constructor (whichField) {
    super(`Missing field ${whichField}!`)

    this.fieldMissing = whichField
  }
}

/**
 * MapConfig class to manage parsing and exporting map configurations.
 */
export default class MapConfig {
  /**
   * Creates a new MapConfig object. A MapConfig object could parse an
   * existing map configuration, return specific stuff about the map configuration,
   * and allow modifications, which could then be exported in JSON format.
   * @param {string} [config] The map configuration, in JSON format.
   */
  constructor (config) {
    /**
     * Private reference to the map configurations.
     * @private
     */
    this._config = {
      meta: {},
      data: {
        graphicsData: {},
        modifiersData: {}
      }
    }
    /**
     * Whether the map configurations has changed.
     * @private
     */
    this._configChanged = false

    if (config) {
      this._parseConfig(config)
    }

    /**
     * @type {BoundMap<Graphic>}
     */
    this.graphics = new BoundMap(this._config.data.graphicsData)
    /**
     * @type {BoundMap<Modifier>}
     */
    this.modifiers = new BoundMap(this._config.data.modifiersData)
  }

  /**
   * Parses and validates a Colonial Wars Map Configuration.
   * @param {string} rawConfig THe map configuration, in JSON format.
   * @private
   */
  _parseConfig (rawConfig) {
    const config = JSON.parse(rawConfig)

    Joi.assert(config, MapConfigSchema)

    // Welp, the config passed validation.
    this._config = config
  }

  /**
   * Sets map configurations that are going to stay constant throughout the whole
   * map editing process.
   * @param {Vector2D} worldLimits The limits of this map world.
   * @param {'grass'|'sand'|'rock'} tileType The type of tile of the map.
   * @param {number} defaultHeight The default height of this map world.
   * @param {'teams'|'koth'|'siege'} mode The game mode.
   * @private
   */
  _setConstantConfig (worldLimits, tileType, defaultHeight, mode) {
    if (!this._config.meta || typeof this._config.meta !== 'object') {
      this._config.meta = {}
    }

    mode = mode.toLowerCase()
    tileType = tileType.toLowerCase()
    worldLimits = { x: worldLimits.x, y: worldLimits.y }
    defaultHeight = mathUtils.bound(defaultHeight, 0, 2)

    if (!constants.VALID_GAME_MODES.includes(mode)) {
      throw new TypeError('Invalid game mode!')
    } else if (!constants.VALID_TILE_TYPES.includes(tileType)) {
      throw new TypeError('Invalid tile type!')
    }

    this._config.meta.mode = mode
    this._config.meta.tileType = tileType
    this._config.meta.worldLimits = worldLimits
    this._config.meta.defaultHeight = defaultHeight
  }

  /**
   * Sets this map configuration's data files.
   * @param {CWDataFiles} dataFiles The data files to use.
   * @private
   */
  _setDataFiles (dataFiles) {
    if (!this._config.meta || typeof this._config.meta !== 'object') {
      this._config.meta = {}
    }

    Object.keys(dataFiles).forEach(key => {
      this._config.meta[`${key}DataExtends`] = dataFiles[key]
    })
  }

  /**
   * Creates a new MapConfig object with the specified parameters. The difference
   * between this method and manually creating a MapConfig object is that this method
   * produces configurations that are valid by default; manually creating a new MapConfig
   * object DOESN'T produce a valid configuration.
   * @param {Vector2D} worldLimits A Vector2D specifying the world's limits.
   * @param {'grass'|'sand'|'rock'} tileType The tile to use for the map.
   * @param {number} defaultHeight The default height of the world.
   * @param {'teams'|'koth'|'siege'} mode The game mode.
   * @param {CWDataFiles} dataFiles Any existing data files to use.
   * @returns {MapConfig}
   */
  static newConfig (worldLimits, tileType, defaultHeight, mode, dataFiles) {
    const config = new MapConfig()
    config.mapName = 'unnamed'
    config.maxPlayers = 2
    config.description = ''
    config._setDataFiles(dataFiles)
    config._setConstantConfig(worldLimits, tileType, defaultHeight, mode)
    config.setTeam('Red', Vector2D.zero(), 1, 'Team Red')
    config.setTeam('Blue', Vector2D.fromObject(worldLimits), 1, 'Team Blue')

    config._configChanged = false

    return config
  }

  /**
   * The game mode of the map, in lowercase.
   * @returns {string|null}
   * @readonly
   */
  get mode () {
    return typeof this._config.meta?.mode === 'string'
      ? this._config.meta.mode.toLowerCase()
      : null
  }

  /**
   * The tile type of the map.
   * @returns {string|null}
   * @readonly
   */
  get tileType () {
    return typeof this._config.meta?.tileType === 'string'
      ? this._config.meta.tileType.toLowerCase()
      : null
  }

  /**
   * The default height of this map.
   * @returns {number|null}
   * @readonly
   */
  get defaultHeight () {
    return typeof this._config.meta?.defaultHeight === 'number'
      ? this._config.meta.defaultHeight
      : null
  }

  /**
   * The x and y limits of the map.
   * @returns {Vector2D|null}
   * @readonly
   */
  get worldLimits () {
    return this._config.meta?.worldLimits?.x && this._config.meta?.worldLimits?.y
      ? Vector2D.fromObject(this._config.meta.worldLimits)
      : null
  }

  /**
   * The name of the map.
   * @returns {string|null}
   */
  get mapName () {
    return typeof this._config.meta?.name === 'string'
      ? this._config.meta.name
      : null
  }

  /**
   * The name of the map.
   */
  set mapName (name) {
    if (!this._config.meta || typeof this._config.meta !== 'object') {
      this._config.meta = {}
    }
    if (!constants.NAME_REGEXP.test(name)) {
      throw new TypeError('Invalid characters in map name!')
    }

    this._config.meta.name = name
    this._configChanged = true
  }

  /**
   * The description of the map.
   * @returns {string|null}
   */
  get description () {
    return typeof this._config.meta?.description === 'string'
      ? this._config.meta.description
      : null
  }

  /**
   * The description of the map.
   */
  set description (descrp) {
    if (!this._config.meta || typeof this._config.meta !== 'object') {
      this._config.meta = {}
    }
    // Limit map description to 5000 chars.
    if (descrp.length > 5000) {
      throw new RangeError('Map description too long!')
    }

    this._config.meta.description = descrp
    this._configChanged = true
  }

  /**
   * The maximum amount of players allowed on this map.
   * @returns {number|null}
   */
  get maxPlayers () {
    return typeof this._config.meta?.maxPlayers === 'number'
      ? this._config.meta.maxPlayers
      : null
  }

  /**
   * The maximum amount of players allowed on this map.
   */
  set maxPlayers (max) {
    if (!this._config.meta || typeof this._config.meta !== 'object') {
      this._config.meta = {}
    }
    if (max < 2) {
      throw new RangeError('Minimum 2 players per map!')
    }

    this._config.meta.maxPlayers = max
    this._configChanged = true
  }

  /**
   * Get all teams of this map.
   * @returns {Array<Team>}
   */
  getTeams () {
    if (!Array.isArray(this._config.meta.teams)) {
      return []
    }
    return this._config.meta.teams
  }

  /**
   * Sets a team for this map. If an existing team with the same name already exists,
   * this method overrides it.
   * @param {string} name The name of the team.
   * @param {Vector2D} spawnPosition The position where new players of the team spawns.
   * @param {number} maxPlayers The maximum amount of players on the team.
   * @param {string} desc A short description of the team.
   */
  setTeam (name, spawnPosition, maxPlayers, desc) {
    if (!this._config.meta || typeof this._config.meta !== 'object') {
      this._config.meta = {}
    }
    if (!Array.isArray(this._config.meta.teams)) {
      this._config.meta.teams = []
    }
    if (maxPlayers && maxPlayers < MAP_CONFIG_LIMITS.MIN_PLAYERS_ON_TEAM) {
      throw new RangeError('Minimum 1 player on a team!')
    }
    if (desc && desc.length > MAP_CONFIG_LIMITS.MAX_TEAM_DESC_LEN) {
      throw new RangeError('Description is too long!')
    }

    const teamIndex = this._config.meta.teams.findIndex(team => team.name === name)
    if (!~teamIndex) {
      debug('Adding team %s.', name)
      // Team doesn't exist.
      this._config.meta.teams.push({
        name: name,
        description: desc,
        maxPlayers: maxPlayers,
        spawnPosition: Vector2D.fromObject(spawnPosition)
      })
    } else {
      // Team exists. Override it.
      desc && (this._config.meta.teams[teamIndex].description = desc)
      maxPlayers && (this._config.meta.teams[teamIndex].maxPlayers = maxPlayers)
      spawnPosition && (this._config.meta.teams[teamIndex].spawnPosition = Vector2D.fromObject(spawnPosition))
    }

    this._configChanged = true
  }

  /**
   * Deletes the specified team.
   * @param {string} name The name of the team to delete.
   */
  deleteTeam (name) {
    if (!this._config.meta || typeof this._config.meta !== 'object') {
      return
    }
    if (!Array.isArray(this._config.meta.teams)) {
      return
    }
    if ((this._config.meta.teams.length - 1) < 2) {
      throw new RangeError('Minimum of two teams per map!')
    }

    const teamIndex = this._config.meta.teams.findIndex(team => team.name === name)
    if (!~teamIndex) {
      // Team doesn't exist.
      return
    }
    this._config.meta.teams.splice(teamIndex, 1)
  }

  /**
   * Exports the current state of the map configurations in JSON format.
   * @returns {string}
   */
  exportAsJson () {
    if (!isObject(this._config.meta) || !isObject(this._config.data)) {
      throw new Error('Failed to export map config; map meta or data is not an object!')
    }

    return JSON.stringify({
      configType: 'map-config',
      meta: this._config.meta,
      data: this._config.data
    })
  }
}

/**
 * Returns true if val is an object (excluding arrays).
 * @param {any} val The value to check.
 * @returns {boolean}
 */
function isObject (val) {
  return val && !Array.isArray(val) && typeof val === 'object'
}
