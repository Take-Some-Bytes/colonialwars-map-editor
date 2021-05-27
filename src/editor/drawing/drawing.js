/* eslint-env browser */
/**
 * @fileoverview Drawing class to draw all the things that need to be
 * drawn for the map editor.
 */

import MapDrawer from './map-drawer.js'
import Constants from '../../constants.js'

import * as loaders from '../../helpers/loaders.js'

/**
 * @typedef {Object} DrawingOptions
 * @prop {CanvasRenderingContext2D} context The canvas context to draw to.
 * @prop {MapDrawer} mapDrawer
 * @prop {import('../viewport').default} viewport The viewport class to work with.
 */

/**
 * Drawing class.
 */
export default class Drawing {
  /**
   * Constructor for a Drawing class.
   * This class handles the higher-level drawing of editor graphics,
   * using the ``ImageDrawer`` class.
   * @param {DrawingOptions} options Options.
   */
  constructor (options) {
    const {
      context, viewport, mapDrawer
    } = options

    this.context = context
    this.viewport = viewport
    this.mapDrawer = mapDrawer

    this.width = context.canvas.width
    this.height = context.canvas.height
  }

  /**
   * Initializes this Drawing class.
   */
  async init () {
    await this.mapDrawer.init()
  }

  /**
   * Clears the canvas.
   */
  clear () {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  /**
   * Draws the background tiles to the canvas.
   * @param {import('../physics/vector2d').default} playerPosition The player's current position.
   * @param {import('../../helpers/display-utils').ViewportDimensions} viewportDimensions
   * The client's viewport dimensions.
   */
  drawTiles (playerPosition, viewportDimensions) {
    this.mapDrawer.drawTiles(playerPosition, viewportDimensions)
  }

  /**
   * Factory method for a Drawing class.
   * @param {CanvasRenderingContext2D} context The canvas context to draw to.
   * @param {import('../viewport').default} viewport The viewport object for
   * coordinate translation.
   * @param {import('../map-config').default} mapConfig A reference to the current map configurations.
   * @returns {Promise<Drawing>}
   */
  static async create (context, viewport, mapConfig) {
    const imgLoader = new loaders.ImageLoader({
      baseURL: `${window.origin}${Constants.DRAWING_CONSTANTS.baseUrl}`
    })
    const mapDrawer = new MapDrawer({
      gameCanvasContext: context,
      imgLoader: imgLoader,
      viewport: viewport,
      mapConfig: {
        // tileType: mapConfig.meta.tileType,
        tileType: mapConfig.tileType,
        staticElems: {},
        // worldLimits: mapConfig.meta.worldLimits
        worldLimits: mapConfig.worldLimits
      }
    })

    return new Drawing({
      context: context,
      viewport: viewport,
      mapDrawer: mapDrawer
    })
  }
}
