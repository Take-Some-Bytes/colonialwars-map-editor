/* eslint-env browser */
/**
 * @fileoverview Drawing class to draw all the things that need to be
 * drawn for the map editor.
 */

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
      viewport
    } = options

    this.context = context
    this.viewport = viewport
    this.imgDrawer = imgDrawer
    this.drawingData = drawingData

    this.width = context.canvas.width
    this.height = context.canvas.height
  }

  /**
   * Clears the canvas.
   */
  clear () {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  /**
   * Draws the background tiles to the canvas.
   */
  async drawTiles () {
    const start = this.viewport.toCanvas({ x: 0, y: 0 })
    const end = this.viewport.toCanvas({
      x: this.drawingData.worldSize.x,
      y: this.drawingData.worldSize.y
    })

    for (
      let x = start.x, endX = end.x; x < endX;
      x += Constants.GAME_CONSTANTS.DRAWING_TILE_SIZE
    ) {
      for (
        let y = start.y, endY = end.y; y < endY;
        y += Constants.GAME_CONSTANTS.DRAWING_TILE_SIZE
      ) {
        await this.imgDrawer.drawImage(
          this.drawingData.images.tile,
          { position: { x, y }, context: this.context }
        )
        // this.imgDrawer.drawImage(
        //   this.drawingData.images.tile,
        //   { position: { x, y }, context: this.context }
        // )
      }
    }
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

    return new Drawing({
      context: context,
      viewport: viewport,
      imgDrawer: new ImageDrawer({
        ...Constants.IMAGE_DRAWER_CONFIG,
        context
      }),
      drawingData: {
        worldSize: mapConfig.meta.worldLimits,
        images: {
          tile: imgsMeta.tileLocations[mapConfig.meta.tileType]
        }
      }
    })
  }
}
