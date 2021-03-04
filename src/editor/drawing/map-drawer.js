/* eslint-env browser */
/**
 * @fileoverview MapDrawer class to handle the drawing of Colonial Wars maps.
 */

import Constants from '../../constants.js'
import Vector2D from '../physics/vector2d.js'
import ChunkSplitter from './chunk-splitter.js'

import * as mathUtils from '../../helpers/math-utils.js'

/**
 * @typedef {Object} ImageMeta
 * @prop {Record<string, string>} tileLocations
 *
 * @typedef {Object} MapDrawerOptions
 * @prop {import('../viewport').default} viewport
 * @prop {import('../editor').MapConfig} mapConfig
 * @prop {import('./image-drawer').default} imageDrawer
 * @prop {ImageMeta} imageMeta Image metadata object.
 * @prop {CanvasRenderingContext2D} gameCanvasContext The actual canvas context
 * to draw the map on.
 */

/**
 * MapDrawer class.
 */
export default class MapDrawer {
  /**
   * Constructor for a MapDrawer class. This class focuses exclusively
   * on the drawing of the map, i.e. tiles, trees, static buildings.
   * @param {MapDrawerOptions} options Options.
   */
  constructor (options) {
    const {
      mapConfig, imageMeta, imageDrawer, viewport,
      gameCanvasContext
    } = options

    this.viewport = viewport
    this.mapConfig = mapConfig
    this.imageMeta = imageMeta
    this.imageDrawer = imageDrawer
    this.gameCtx = gameCanvasContext

    this.tileChunkSplitter = null
    this.initialized = false

    this.workCanvas = document.createElement('canvas')
    this.workCtx = this.workCanvas.getContext('2d')
  }

  /**
   * Draws tiles onto a canvas, which then should be split into chunks.
   * @param {string} tileType The tile to draw.
   * @param {CanvasRenderingContext2D} ctx The context to draw on.
   * @param {Vector2D} start Where to start drawing the tiles.
   * @param {Vector2D} end Where to stop drawing the tiles.
   * @private
   */
  async _drawTiles (tileType, ctx, start, end) {
    for (
      let x = start.x, endX = end.x; x < endX;
      x += Constants.GAME_CONSTANTS.DRAWING_TILE_SIZE
    ) {
      for (
        let y = start.y, endY = end.y; y < endY;
        y += Constants.GAME_CONSTANTS.DRAWING_TILE_SIZE
      ) {
        await this.imageDrawer.drawImage(
          this.imageMeta.tileLocations[tileType],
          { position: { x, y }, context: ctx }
        )
      }
    }
  }

  /**
   * Initializes this MapDrawer.
   */
  async init () {
    if (this.initialized) { return }

    const worldLimits = this.mapConfig.meta.worldLimits
    const end = Vector2D.zero()
    const halvedWorldLimits = Vector2D.sub(
      worldLimits, Vector2D.fromArray([worldLimits.x / 2, worldLimits.y / 2])
    )
    let needsHalving = false

    this.workCanvas.width = worldLimits.x
    this.workCanvas.height = worldLimits.y
    console.debug(worldLimits)

    // If the map size is greater than 16000 pixels, split it to make
    // sure we don't go over the canvas limits each browser imposes.
    if (worldLimits.x > 16000 || worldLimits.y > 16000) {
      // The map is too large, we gotta halve it and draw it that way.
      end.add(halvedWorldLimits)
      console.debug('halved')
      needsHalving = true
      this.workCanvas.width = halvedWorldLimits.x
      this.workCanvas.height = halvedWorldLimits.y
    } else {
      // Otherwise, just draw it the "normal" way.
      end.add(worldLimits)
      console.debug('drawn normally')
    }

    await this._drawTiles(
      this.mapConfig.meta.tileType, this.workCtx,
      { x: 0, y: 0 }, end
    )

    this.tileChunkSplitter = new ChunkSplitter({
      prefersBigChunks: true,
      map: this.workCanvas,
      chunkSize: 'calculated'
    })
    await this.tileChunkSplitter.finishLoadingChunks()
    if (needsHalving) {
      console.debug('drawing second half')
      // The map was halved, so finish drawing it.
      this.workCtx.clearRect(0, 0, this.workCanvas.width, this.workCanvas.height)
      await this._drawTiles(
        this.mapConfig.meta.tileType, this.workCtx,
        { x: 0, y: 0 }, end
      )
      this.tileChunkSplitter.addChunks(this.workCanvas)
    }

    await this.tileChunkSplitter.finishLoadingChunks()
    console.debug(this.tileChunkSplitter.chunks)
    console.debug(this.tileChunkSplitter.chunkSize)

    this.initialized = true
  }

  /**
   * Draws all the map tiles onto the canvas.
   * @param {Vector2D} playerPosition The player's current position.
   * @param {import('../../components/custom-modal').Dimensions} viewportDimensions
   * The client's viewport dimensions.
   */
  drawTiles (playerPosition, viewportDimensions) {
    const visibleStart = Vector2D.floorAxes(this.viewport.toCanvas(
      Vector2D.sub(playerPosition, {
        x: viewportDimensions.width / 2 + this.tileChunkSplitter.chunkSize.x * 2,
        y: viewportDimensions.height / 2 + this.tileChunkSplitter.chunkSize.y * 2
      })
    ))
    // const visibleStart = this.viewport.toCanvas(playerPosition.copy())
    const visibleEnd = Vector2D.floorAxes(this.viewport.toCanvas(
      Vector2D.add(playerPosition, {
        x: viewportDimensions.width, // / 2 + this.tileChunkSplitter.chunkSize.x * 3,
        y: viewportDimensions.height // / 2 + this.tileChunkSplitter.chunkSize.y * 3
      })
    ))
    const start = Vector2D.floorAxes(this.viewport.toCanvas({ x: 0, y: 0 }))
    const end = Vector2D.floorAxes(this.viewport.toCanvas({
      x: this.mapConfig.meta.worldLimits.x,
      y: this.mapConfig.meta.worldLimits.y
    }))
    let chunkID = -1
    // let i = 0

    for (
      let x = start.x, endX = end.x; x < endX;
      x += this.tileChunkSplitter.chunkSize.x
    ) {
      chunkID++
      for (
        let y = start.y, endY = end.y; y < endY;
        y += this.tileChunkSplitter.chunkSize.y
      ) {
        if (!(this.tileChunkSplitter.chunks[chunkID] instanceof HTMLImageElement)) {
          // I'm actually unsure why this happens, but we need to handle it anyways.
          /**
           * TODO: Investigate how the chunkID variable could be
           * greater than the actual number of chunks.
           * (02/27/2021) Take-Some-Bytes */
          // debugger
          continue
        }
        if (
          mathUtils.inBound(x, visibleStart.x, visibleEnd.x) &&
          mathUtils.inBound(y, visibleStart.y, visibleEnd.y)
        ) {
          this.gameCtx.drawImage(
            this.tileChunkSplitter.chunks[chunkID], x, y
          )
        }
        // i++
      }
    }

    // console.debug('Loop Y iterations', i)
    // debugger
  }
}
