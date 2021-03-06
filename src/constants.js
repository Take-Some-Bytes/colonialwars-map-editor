/* eslint-env browser */
/**
 * @fileoverview Client constants.
 */

/**
  * Deep-freezes an object.
  * @param {O} object The object to deep freeze.
  * @returns {Readonly<O>}
  * @template O
  */
function deepFreeze (object) {
  // Retrieve the property names defined on object.
  const propNames = Object.getOwnPropertyNames(object)
  // Freeze properties before freezing self.
  for (const name of propNames) {
    const value = object[name]
    if (value && typeof value === 'object') {
      deepFreeze(value)
    }
  }
  return Object.freeze(object)
}

/**
 * Client constants.
 */
export default deepFreeze({
  /**
   * TODO: Trim unneeded constants.
   * (06/26/2021) Take-Some-Bytes */
  FALLBACKS: {
    STARTING_MAP_CONFIG: {
      mode: 'teams',
      defaultHeight: 0,
      tileType: 'grass',
      size: { x: 60, y: 60 },
      dataFiles: { unit: 'none', building: 'none', graphics: 'none' }
    }
  },
  GAME_CONSTANTS: {
    PLAYER_SPEED: 1,
    VIEWPORT_STICKINESS: 0.004,
    DRAWING_TILE_SIZE: 100,
    TILES_META_FILE: '/meta/tiles.meta.json'
  },
  DRAWING_CONSTANTS: {
    baseUrl: '/imgs/game-images/',
    tileFrames: {
      grass: [0, 0],
      sand: [1, 0]
    }
  },
  IMAGE_DRAWER_CONFIG: {
    imgDir: '/imgs/game-images',
    imgMetaDir: '/meta/game-images',
    spriteSheetDir: '/imgs/sprite-sheets',
    spriteSheetMetaDir: '/meta/sprite-sheets'
  },
  MAP_CONFIG_LIMITS: {
    MIN_MAP_SIZE: 50,
    MAX_MAP_SIZE: 200,
    MIN_DEFAULT_HEIGHT: 0,
    MAX_DEFAULT_HEIGHT: 2,
    MIN_TEAMS: 2,
    MAX_TEAMS: 8,
    MAX_PLAYERS_ON_TEAM: 20,
    MIN_PLAYERS_ON_TEAM: 1,
    MAX_TEAM_DESC_LEN: 150,
    MAX_MAP_NAME_LEN: 30,
    MAX_MAP_DESC_LEN: 5000
  },
  VALID_TILE_TYPES: ['grass', 'sand', 'rock'],
  VALID_GAME_MODES: ['teams', 'koth', 'siege'],
  EDITOR_STATE: {
    RUNNING: Symbol('EDITOR_STATE_RUNNING'),
    STARTING: Symbol('EDITOR_STATE_STARTING'),
    SUSPENDED: Symbol('EDITOR_STATE_SUSPENDED'),
    HAD_ERROR: Symbol('EDITOR_STATE_HAD_ERROR'),
    NOT_STARTED: Symbol('EDITOR_STATE_NOT_STARTED'),
    DO_NOT_START: Symbol('EDITOR_STATE_DO_NOT_START')
  }
})
