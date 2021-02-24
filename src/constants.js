/* eslint-env browser */
/**
 * @fileoverview Client constants.
 */

/**
 * Client constants.
 */
export default Object.freeze({
  FALLBACKS: {
    STARTING_MAP_CONFIG: {
      size: {
        x: 60,
        y: 60
      },
      tileType: 'grass',
      defaultHeight: 0
    }
  },
  GAME_CONSTANTS: {
    PLAYER_SPEED: 1,
    VIEWPORT_STICKINESS: 0.004,
    DRAWING_TILE_SIZE: 100,
    TILES_META_FILE: '/meta/tiles.meta.json'
  },
  IMAGE_DRAWER_CONFIG: {
    imgDir: '/imgs/game-images',
    imgMetaDir: '/meta/game-images',
    spriteSheetDir: '/imgs/sprite-sheets',
    spriteSheetMetaDir: '/meta/sprite-sheets'
  }
})
