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

import debugFactory from 'debug'

const debug = debugFactory('cw:editor:editor-class')

/**
 * @typedef {Object} WorldLimits
 * @prop {number} x
 * @prop {number} y
 *
 * @typedef {Object} KeyBindings
 * @prop {import('./input/input-manager').DirectionBindings} direction
 *
 * @typedef {Object} MapConfig
 * @prop {'game-config'} configType
 * @prop {Object} meta
 * @prop {Object} meta.worldLimits
 * @prop {number} meta.worldLimits.x
 * @prop {number} meta.worldLimits.y
 * @prop {string} meta.tileType
 *
 * @typedef {Object} EditorOptions
 * @prop {import('./map-config').default} mapConfig
 * @prop {InputManager} inputManager
 * @prop {number} playerSpeed
 * @prop {Viewport} viewport
 * @prop {Drawing} drawing
 * @prop {import('../components/custom-modal').Dimensions} viewportDimensions
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
      viewport, inputManager, drawing,
      viewportDimensions
    } = options
    this.mapConfig = mapConfig

    this.viewportDimensions = viewportDimensions
    this.inputManager = inputManager
    this.playerSpeed = playerSpeed
    this.viewport = viewport
    this.drawing = drawing

    this.self = null
    this.hasUnsavedChanges = true
    this.paused = false
    this.lastUpdateTime = 0
    this.deltaTime = 0

    this.worldBounds = Object.freeze({
      x: { MIN: 0, MAX: this.mapConfig.worldLimits.x * 100 },
      y: { MIN: 0, MAX: this.mapConfig.worldLimits.y * 100 }
    })

    this._animationFrameID = null
  }

  /**
   * Initializes this editor instance.
   */
  async init () {
    this.self = Player.create(
      new Vector2D(this.worldBounds.x.MAX / 2, this.worldBounds.y.MAX / 2),
      this.playerSpeed, this.worldBounds
    )
    this.lastUpdateTime = Date.now()

    this.inputManager.on('input', state => {
      // this.self.addInputToQueue(state)
      this.self.updateOnInput(state)
    })

    await this.drawing.init()
  }

  /**
   * Draws the entities onto the client's screen.
   */
  draw () {
    if (this.self) {
      this.drawing.clear()
      this.drawing.drawTiles(this.self.position, this.viewportDimensions)
    }
  }

  /**
   * Handles the orchestration of a single editor loop iteration.
   *
   * @param {number} currentTime The current time.
   */
  update (currentTime) {
    if (this.paused) {
      // Editor is paused! Do nothing.
      return
    }

    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    if (this.self) {
      this.self.update()
      this.viewport.updateTrackingPosition(this.self)
      this.viewport.update(this.deltaTime)
    }

    this.draw()
  }

  /**
   * Pauses this Editor, making it stop taking input and stop updating.
   */
  pause () {
    this.inputManager.stopTracking(document, this.drawing.context.canvas)
    this.paused = true
  }

  /**
   * Unpauses this Editor, making it start taking input and updating again.
   */
  unpause () {
    this.inputManager.startTracking(document, this.drawing.context.canvas)
    this.paused = false
  }

  /**
   * Starts the editor render and update loop.
   */
  start () {
    const _update = () => {
      this.update(Date.now())

      this._animationFrameID = window.requestAnimationFrame(_update.bind(this))
    }

    _update()
  }

  /**
   * Stops the editor render and update loop.
   */
  stop () {
    window.cancelAnimationFrame(this._animationFrameID)
  }

  /**
   * Factory method for creating a new Editor.
   * @param {import('./map-config').default} mapConfig The map configuration.
   * @param {KeyBindings} keyBindings The editor's key bindings.
   * @param {CanvasRenderingContext2D} context The canvas context to draw on.
   * @param {import('../components/custom-modal').Dimensions} viewportDimensions
   * The client's current viewport dimensions.
   * @returns {Promise<Editor>}
   */
  static async create (mapConfig, keyBindings, context, viewportDimensions) {
    const viewport = Viewport.create(context.canvas)
    const inputManager = InputManager.create(
      keyBindings, document, context.canvas
    )
    const drawing = await Drawing.create(
      context, viewport, mapConfig
    )

    const editor = new Editor({
      mapConfig: mapConfig,
      playerSpeed: Constants.GAME_CONSTANTS.PLAYER_SPEED,
      inputManager: inputManager,
      viewport: viewport,
      drawing: drawing,
      viewportDimensions: viewportDimensions
    })
    await editor.init()
    return editor
  }
}
