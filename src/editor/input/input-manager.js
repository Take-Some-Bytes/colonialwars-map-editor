/* eslint-env browser */
/**
 * @fileoverview Input manager for the editor.
 */

import Vector2D from '../physics/vector2d.js'
import InputTracker from './input-tracker.js'
import EventEmitter from '../../event-emitter.js'

/**
 * @typedef {Object} InputState
 * @prop {Object} directionData
 * @prop {boolean} directionData.up
 * @prop {boolean} directionData.down
 * @prop {boolean} directionData.left
 * @prop {boolean} directionData.right
 * @prop {Object} mouseData
 * @prop {boolean} mouseData.leftMousePressed
 * @prop {boolean} mouseData.rightMousePressed
 * @prop {Vector2D} mouseData.mouseCoords
 *
 * @typedef {Object} BasicKeyBindings
 * @prop {DirectionBindings} directionBindings
 *
 * @typedef {Object} DirectionBindings
 * @prop {Array<string>|string} up
 * @prop {Array<string>|string} down
 * @prop {Array<string>|string} left
 * @prop {Array<string>|string} right
 *
 * @typedef {Object} InputManagerOptions
 * @prop {InputTracker} inputTracker
 * @prop {BasicKeyBindings} basicKeyBindings
 */

/**
 * InputManager class.
 * @extends EventEmitter
 */
export default class InputManager extends EventEmitter {
  /**
   * Constructor for an InputManager class.
   * @param {InputManagerOptions} options Options.
   */
  constructor (options) {
    const {
      inputTracker,
      basicKeyBindings
    } = options

    super()

    this.inputTracker = inputTracker
    this.basicKeyBindings = basicKeyBindings

    this.inputState = {
      directionData: {
        up: false,
        down: false,
        left: false,
        right: false
      },
      mouseData: {
        leftMousePressed: false,
        rightMousePressed: false,
        mouseCoords: Vector2D.zero()
      }
    }

    this.inputTracker.on('input', this._onInput.bind(this))
  }

  /**
   * Called when this class's ``.inputTracker`` object emits an ``input`` event.
   * @param {import('./input-tracker').InputState} state The current state of the input.
   * @private
   */
  _onInput (state) {
    const { keysPressed, mouseData } = state
    const directionBindings = Object.entries(this.basicKeyBindings.directionBindings)
    for (let i = 0, l = directionBindings.length; i < l; i++) {
      const binding = directionBindings[i]
      if (Array.isArray(binding[1])) {
        for (let j = 0, l2 = binding[1].length; j < l2; j++) {
          const keyBinding = binding[1][j]
          if (keysPressed.includes(keyBinding)) {
            this.inputState.directionData[binding[0]] = true
            break
          } else {
            this.inputState.directionData[binding[0]] = false
          }
        }
      } else {
        // If the keys pressed include one that is in our basic direction bindings,
        // set the direction input to be true. If not, set the direction input to
        // be false.
        if (keysPressed.includes(binding[1])) {
          this.inputState.directionData[binding[0]] = true
        } else {
          this.inputState.directionData[binding[0]] = false
        }
      }
    }

    // The mouse data needs no additional modification other than converting the
    // mouse coordinates to a Vector2D.
    this.inputState.mouseData = {
      ...mouseData,
      mouseCoords: Vector2D.fromArray(mouseData.mouseCoords)
    }

    this.emit('input', this.inputState)
  }

  /**
   * Start tracking input.
   * @param {Element} keyElement The element to track key presses on.
   * @param {Element} mouseElement The element to track mouse input on.
   */
  startTracking (keyElement, mouseElement) {
    this.inputTracker.attachEventHandlers(keyElement, keyElement, mouseElement)
  }

  /**
   * Stop tracking input.
   * @param {Element} keyElement The element that we tracked key presses on.
   * @param {Element} mouseElement The element that we tracked mouse input on.
   */
  stopTracking (keyElement, mouseElement) {
    this.inputTracker.detachEventHandlers(keyElement, keyElement, mouseElement)
  }

  /**
   * Factory method for a InputManager class.
   * @param {BasicKeyBindings} basicKeyBindings The basic key bindings for this client.
   * @param {Element} keyElement The element to track key presses on.
   * @param {Element} mouseElement The element to track mouse input on.
   * @returns {InputManager}
   */
  static create (basicKeyBindings, keyElement, mouseElement) {
    return new InputManager({
      inputTracker: InputTracker.create(keyElement, mouseElement),
      basicKeyBindings: basicKeyBindings
    })
  }
}
