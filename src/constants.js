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
      size: { x: 60, y: 60 }
    }
  },
  VERSION: 'v0.4.2-PRE-ALPHA',
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
  DEFAULT: {
    KEYBINDINGS: {
      up: ['w', 'W', 'ArrowUp'],
      down: ['s', 'S', 'ArrowDown'],
      left: ['a', 'A', 'ArrowLeft'],
      right: ['d', 'D', 'ArrowRight']
    }
  },
  SELECTABLE: {
    GRAPHIC_FILES: [
      {
        id: 'none_avilable',
        value: '@@_none',
        displayedText: 'None'
      },
      {
        id: 'default_tile',
        value: 'default/tile.png',
        displayedText: 'Default Tile'
      },
      {
        id: 'default_player',
        value: 'default/player.png',
        displayedText: 'Default Player'
      }
    ],
    ANGLES: [
      { id: 'one', value: 1, displayedText: '1' },
      { id: 'two', value: 2, displayedText: '2' },
      { id: 'four', value: 4, displayedText: '4' },
      { id: 'eight', value: 8, displayedText: '8' }
    ]
  },
  ROOT_FONT_SIZE: parseInt(window.getComputedStyle(document.body).fontSize, 10)
})
