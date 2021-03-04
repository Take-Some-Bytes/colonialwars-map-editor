/* eslint-env browser */
/**
 * @fileoverview Drawing class to draw all the things that need to be
 * drawn for the map editor.
 */

import MapDrawer from './map-drawer.js'
import Constants from '../../constants.js'
import ImageDrawer from './image-drawer.js'

import * as loaders from '../../helpers/loaders.js'

/**
 * @typedef {Object} DrawingData
 * @prop {Object} worldSize
 * @prop {number} worldSize.x
 * @prop {number} worldSize.y
 * @prop {Object} images
 * @prop {string} images.tile
 *
 * @typedef {Object} DrawingOptions
 * @prop {CanvasRenderingContext2D} context The canvas context to draw to.
 * @prop {DrawingData} drawingData Data that is required for this class to
 * draw stuff properly.
 * @prop {ImageDrawer} imgDrawer The ImageDrawer to draw with.
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
      context, drawingData, imgDrawer,
      viewport, mapDrawer
    } = options

    this.context = context
    this.viewport = viewport
    this.imgDrawer = imgDrawer
    this.mapDrawer = mapDrawer
    this.drawingData = drawingData

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
   * @param {import('../../components/custom-modal').Dimensions} viewportDimensions
   * The client's viewport dimensions.
   */
  async drawTiles (playerPosition, viewportDimensions) {
    this.mapDrawer.drawTiles(playerPosition, viewportDimensions)
  }

  /**
   * Factory method for a Drawing class.
   * @param {CanvasRenderingContext2D} context The canvas context to draw to.
   * @param {import('../viewport').default} viewport The viewport object for
   * coordinate translation.
   * @param {{}} mapConfig A reference to the current map configurations.
   * @returns {Promise<Drawing>}
   */
  static async create (context, viewport, mapConfig) {
    const imgsMeta = await loaders.loadAsJson('/meta/images.meta.json')
    const imgDrawer = new ImageDrawer({
      ...Constants.IMAGE_DRAWER_CONFIG,
      context
    })

    // debugger

    return new Drawing({
      context: context,
      viewport: viewport,
      imgDrawer: imgDrawer,
      drawingData: {
        worldSize: mapConfig.meta.worldLimits,
        images: {
          tile: imgsMeta.tileLocations[mapConfig.meta.tileType]
        }
      },
      mapDrawer: new MapDrawer({
        viewport: viewport,
        mapConfig: mapConfig,
        imageMeta: imgsMeta,
        imageDrawer: imgDrawer,
        gameCanvasContext: context
      })
    })
  }
}
