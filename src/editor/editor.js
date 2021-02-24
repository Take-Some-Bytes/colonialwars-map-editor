/* eslint-env browser */
/**
 * @fileoverview Editor class for logic concerning the actual editor.
 */

import Player from './player.js'
import Viewport from './viewport.js'
import Constants from '../constants.js'
import Drawing from './drawing/drawing.js'
import Vector2D from './physics/vector2d.js'
import InputManager from './input/input-manager.js'

/**
 * @typedef {Object} KeyBindings
 * @prop {import('./input/input-manager').BasicKeyBindings} basic
 *
 * @typedef {Object} MapConfig
 * @prop {'game-config'} configType
 * @prop {Object} meta
 * @prop {Object} meta.worldLimits
 * @prop {number} meta.worldLimits.x
 * @prop {number} meta.worldLimits.y
 *
 * @typedef {Object} EditorOptions
 * @prop {MapConfig} mapConfig
 * @prop {InputManager} inputManager
 * @prop {number} playerSpeed
 * @prop {Viewport} viewport
 * @prop {Drawing} drawing
 */

/**
 * Editor class.
 */
export default class Editor {
  /**
   * Constructor for an Editor class.
   * @param {EditorOptions} options
   */
  constructor (options) {
    const {
      mapConfig, playerSpeed,
      viewport, inputManager, drawing
    } = options
    this.mapConfig = {
      ...mapConfig
    }

    this.inputManager = inputManager
    this.playerSpeed = playerSpeed
    this.viewport = viewport
    this.drawing = drawing

    this.self = null
    this.lastUpdateTime = 0
    this.deltaTime = 0

    this.worldBounds = Object.freeze({
      x: { MIN: 0, MAX: this.mapConfig.meta.worldLimits.x },
      y: { MIN: 0, MAX: this.mapConfig.meta.worldLimits.x }
    })
  }

  /**
   * Initializes this editor instance.
   */
  init () {
    this.self = Player.create(
      new Vector2D(this.worldBounds.x.MAX / 2, this.worldBounds.y.MAX / 2),
      this.playerSpeed, this.worldBounds
    )
    this.lastUpdateTime = Date.now()

    this.inputManager.on('input', state => {
      // this.self.addInputToQueue(state)
      this.self.updateOnInput(state)
    })
  }

  /**
   * Draws the entities onto the client's screen.
   */
  async draw () {
    if (this.self) {
      this.drawing.clear()
      await this.drawing.drawTiles()
      // this.drawing.drawTiles()
    }
  }

  /**
   * Function to call on every iteration of the animation/update loop.
   */
  async run () {
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    if (this.self) {
      this.self.update()
      this.viewport.updateTrackingPosition(this.self)
      this.viewport.update(this.deltaTime)
    }

    await this.draw()
    // this.draw()
  }

  /**
   * Factory method for creating a new Editor.
   * @param {StartingMapConfig} mapConfig The map configuration.
   * @param {KeyBindings} keyBindings The editor's key bindings.
   * @param {CanvasRenderingContext2D} context The canvas context to draw on.
   * @returns {Promise<Editor>}
   */
  static async create (mapConfig, keyBindings, context) {
    const viewport = Viewport.create(context.canvas)
    const inputManager = InputManager.create(
      keyBindings.basic, document, context.canvas
    )
    const drawing = await Drawing.create(
      context, viewport, mapConfig
    )

    const editor = new Editor({
      mapConfig: mapConfig,
      playerSpeed: Constants.GAME_CONSTANTS.PLAYER_SPEED,
      inputManager: inputManager,
      viewport: viewport,
      drawing: drawing
    })
    editor.init()
    return editor
  }
}
