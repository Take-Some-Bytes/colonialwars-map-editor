/* eslint-env browser */
/**
 * @fileoverview BoundEntity class to represent any object that is
 * bound to a minimum and maximum.
 */

import * as mathUtils from 'colonialwars-lib/math'

import Vector2D from './vector2d.js'

/**
 * @typedef {Object} Bounds
 * @prop {Object} x
 * @prop {number} x.MIN
 * @prop {number} x.MAX
 * @prop {Object} y
 * @prop {number} y.MIN
 * @prop {number} y.MAX
 */

/**
 * BoundEntity class.
 */
export default class BoundEntity {
  /**
   * Constructor for a BoundEntity class.
   * @param {Vector2D} position The starting position of the
   * BoundEntity instance.
   * @param {Readonly<Bounds>} bounds The minimum and maximum bounds for this BoundEntity.
   */
  constructor (position, bounds) {
    this.position = position || Vector2D.zero()
    this.bounds = bounds
  }

  /**
   * Tests if this BoundEntity is inside its bounds.
   * @returns {boolean}
   */
  inBounds () {
    return (
      mathUtils.inBound(this.position.x, this.bounds.x.MIN, this.bounds.x.MAX) &&
      mathUtils.inBound(this.position.y, this.bounds.y.MIN, this.bounds.y.MAX)
    )
  }

  /**
   * Bounds this BoundEntity's position within the supplied bounds if it is
   * outside of the bounds.
   */
  boundToBounds () {
    this.position.x = mathUtils.bound(
      this.position.x, this.bounds.x.MIN, this.bounds.x.MAX
    )
    this.position.y = mathUtils.bound(
      this.position.y, this.bounds.y.MIN, this.bounds.y.MAX
    )
  }
}
