/* eslint-env browser */
/**
 * @fileoverview Utilities for displaying stuff on the browser screen.
 */

import EventEmitter from '../event-emitter.js'

/**
 * ViewportDimensions class to store the current viewport dimensions.
 * @extends EventEmitter
 */
export class ViewportDimensions extends EventEmitter {
  /**
   * Constructor for a ViewportDimensions class.
   */
  constructor () {
    super()
    this.width = 0
    this.height = 0

    // Get initial viewport dimensions.
    this.update()
  }

  /**
   * Updates the stored viewport dimensions.
   */
  update () {
    if (window.innerWidth !== undefined) {
      this.width = window.innerWidth
    } else {
      this.width = document.documentElement.clientWidth
    }

    if (window.innerHeight !== undefined) {
      this.height = window.innerHeight
    }
    this.height = document.documentElement.clientHeight

    this.emit('update')
  }
}

/**
 * Return the X/Y coordinates that will center an element with the specified
 * dimensions if placed using the top left corner.
 * @param {import('../components/custom-modal').Dimensions} elemDimensions
 * The element to calculate with.
 * @param {ViewportDimensions} vwDimensions
 * The current viewport dimensions.
 * @returns {import('colonialwars-lib/math').Vector2DLike}
 */
export function centerPos (elemDimensions, vwDimensions) {
  return {
    x: Math.round(
      vwDimensions.width / 2
    ) - elemDimensions.width / 2,
    y: Math.round(
      vwDimensions.height / 2
    ) - elemDimensions.height / 2
  }
}
