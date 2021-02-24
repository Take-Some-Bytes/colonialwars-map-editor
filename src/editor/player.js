/* eslint-env browser */
/**
 * @fileoverview Player class to handle client-side player logic.
 */

import Vector2D from './physics/vector2d.js'
import BoundEntity from './physics/bound-entity.js'

/**
 * @typedef {Object} PlayerOptions
 * @prop {number} speed
 * @prop {import('./physics/vector2d').default} position
 * @prop {Readonly<import('./physics/bound-entity').Bounds>} worldBounds
 *
 * @typedef {Object} PlayerInput
 * @prop {number} timestamp
 * @prop {Object} directionData
 * @prop {boolean} directionData.up
 * @prop {boolean} directionData.down
 * @prop {boolean} directionData.left
 * @prop {boolean} directionData.right
 */

/**
 * Player class.
 * @extends BoundEntity
 */
export default class Player extends BoundEntity {
  /**
   * Constructor for a Player class. This handles client-side prediction only,
   * and has no effect on the actual authoritarian state of the game (if there
   * is an authoritarian state).
   * @param {PlayerOptions} options Options.
   */
  constructor (options) {
    const {
      speed, position, worldBounds
    } = options

    super(position, worldBounds)

    this.speed = speed
    this.velocity = Vector2D.zero()
    this.lastInputProcessTime = 0

    /**
     * @type {Array<PlayerInput>}
     */
    this.inputQueue = []

    this.onInputProcess = () => {}
  }

  /**
   * Gets the velocity of this player with the given input.
   * @param {PlayerInput} data The input data.
   * @returns {Vector2D}
   * @private
   */
  _getVelocity (data) {
    const directionData = data.directionData
    const verticalVelocity = directionData.up
      ? new Vector2D(0, -this.speed)
      : directionData.down
        ? new Vector2D(0, this.speed)
        : Vector2D.zero()
    const horizontalVelocity = directionData.left
      ? new Vector2D(-this.speed, 0)
      : directionData.right
        ? new Vector2D(this.speed, 0)
        : Vector2D.zero()

    return Vector2D.zero().add(verticalVelocity).add(horizontalVelocity)
  }

  /**
   * Performs a physics update for this Player object. Not to be called
   * by the end user.
   * @param {number} deltaTime The time since the last update.
   * @private
   */
  _update (deltaTime) {
    this.position.add(Vector2D.scale(this.velocity, deltaTime))
    this.boundToBounds()
  }

  /**
   * Adds an input object to this Player's input queue.
   * @param {import('./input/input-manager').InputState} data An object storing
   * the input data.
   */
  addInputToQueue (data) {
    const timestamp = Date.now()
    const directionData = Object.fromEntries(Object.entries(
      data.directionData
    ).map(entry => [entry[0], Boolean(entry[1])]))

    this.inputQueue.push({
      timestamp,
      directionData
    })
  }

  /**
   * Initializes this Player object.
   */
  init () {
    this.lastInputProcessTime = Date.now()
  }

  /**
   * Processes all the queued inputs.
   */
  processInputs () {
    const inputs = this.inputQueue.splice(0)
    let nextInput = null
    while ((nextInput = inputs.shift())) {
      const input = nextInput
      let deltaTime = 0

      this.velocity = this._getVelocity(input)
      deltaTime = input.timestamp - this.lastInputProcessTime
      this.lastInputProcessTime = input.timestamp

      this._update(deltaTime)
    }
  }

  /**
   * Updates the state of this player.
   */
  update () {
    // this.processInputs()
    const currentTime = Date.now()
    const deltaTime = currentTime - this.lastInputProcessTime
    this.lastInputProcessTime = currentTime
    this._update(deltaTime)
  }

  /**
   * Updates this player's velocity on input.
   * @param {import('./input/input-manager').InputState} data The current input state.
   */
  updateOnInput (data) {
    this.velocity = this._getVelocity(data)
  }

  /**
   * Factory method for a Player class.
   * @param {Vector2D} position The starting position of this player.
   * @param {number} speed The speed of this player.
   * @param {Readonly<import('./physics/bound-entity').Bounds>} worldBounds The
   * world bounds for this player.
   * @returns {Player}
   */
  static create (position, speed, worldBounds) {
    const player = new Player({
      position,
      speed,
      worldBounds
    })
    player.init()
    return player
  }
}
