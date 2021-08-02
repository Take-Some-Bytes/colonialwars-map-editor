/* eslint-env browser */
/**
 * @fileoverview Player class to handle client-side player logic.
 */

import Vector2D from './physics/vector2d.js'
import BoundEntity from './physics/bound-entity.js'

/**
 * @typedef {import('./input/input-manager').DirectionState} DirectionState
 *
 * @typedef {Object} PlayerOptions
 * @prop {number} speed
 * @prop {import('./physics/vector2d').default} position
 * @prop {Readonly<import('./physics/bound-entity').Bounds>} worldBounds
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
    this.lastUpdateTime = 0
  }

  /**
   * Gets the velocity of this player with the given input.
   * @param {DirectionState} direction The input data.
   * @returns {Vector2D}
   * @private
   */
  _getVelocity (direction) {
    const verticalVelocity = direction.up
      ? new Vector2D(0, -this.speed)
      : direction.down
        ? new Vector2D(0, this.speed)
        : Vector2D.zero()
    const horizontalVelocity = direction.left
      ? new Vector2D(-this.speed, 0)
      : direction.right
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
   * Initializes this Player.
   */
  init () {
    // no-op
  }

  /**
   * Updates the state of this player.
   */
  update () {
    // this.processInputs()
    const currentTime = Date.now()
    const deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime
    this._update(deltaTime)
  }

  /**
   * Updates this player's velocity on input.
   * @param {import('./input/input-manager').InputState} data The current input state.
   */
  updateOnInput (data) {
    this.velocity = this._getVelocity(data.basic.directionData)
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
