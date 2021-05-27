/* eslint-env browser */
/**
 * @fileoverview Low-level InputTracker class that tracks what keys are pressed,
 * what mouse buttons are pressed, and the current mouse position.
 */

import EventEmitter from '../../event-emitter.js'

/**
 * @typedef {Object} InputState
 * @prop {Array<string>} keysPressed
 * @prop {Object} mouseData
 * @prop {boolean} mouseData.leftMousePressed
 * @prop {boolean} mouseData.rightMousePressed
 * @prop {Array<number>} mouseData.mouseCoords
 */

/**
 * InputTracker class.
 * @extends EventEmitter
 */
export default class InputTracker extends EventEmitter {
  /**
   * Low-level InputTracker class that tracks what keys are pressed,
   * what mouse buttons are pressed, and the current mouse position.
   */
  constructor () {
    super()

    /**
     * @type {Array<string>}
     */
    this.keysPressed = []
    this.leftMouseDown = false
    this.rightMouseDown = false
    this.mousePosition = [0, 0]

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
  }

  /**
   * Event handler for the `keydown` event.
   * @param {KeyboardEvent} event The event to handle.
   */
  onKeyDown (event) {
    event.preventDefault()
    if (!this.keysPressed.includes(event.key)) {
      this.keysPressed.push(event.key)
    }
    const state = {
      keysPressed: this.keysPressed,
      mouseData: {
        leftMousePressed: this.leftMouseDown,
        rightMousePressed: this.rightMouseDown,
        mouseCoords: this.mousePosition
      }
    }
    this.emit('keyDown', event.key)
    this.emit('input', state)
  }

  /**
   * Event handler for the `keyup` event.
   * @param {KeyboardEvent} event The event to handle.
   */
  onKeyUp (event) {
    event.preventDefault()
    this.keysPressed.splice(this.keysPressed.indexOf(event.key), 1)
    const state = {
      keysPressed: this.keysPressed,
      mouseData: {
        leftMousePressed: this.leftMouseDown,
        rightMousePressed: this.rightMouseDown,
        mouseCoords: this.mousePosition
      }
    }
    this.emit('keyUp', event.key)
    this.emit('input', state)
  }

  /**
   * Handles a `mousedown` event.
   * @param {MouseEvent} event The Mouse event to handle.
   */
  onMouseDown (event) {
    event.preventDefault()
    if (event.button === 0) {
      this.leftMouseDown = true
    }
    if (event.button === 1) {
      this.rightMouseDown = true
    }
    const state = {
      keysPressed: this.keysPressed,
      mouseData: {
        leftMousePressed: this.leftMouseDown,
        rightMousePressed: this.rightMouseDown,
        mouseCoords: this.mousePosition
      }
    }
    this.emit('mouseButtonDown', event.button)
    this.emit('input', state)
  }

  /**
   * Handles a `mouseup` event.
   * @param {MouseEvent} event The Mouse event to handle.
   */
  onMouseUp (event) {
    event.preventDefault()
    if (event.button === 0) {
      this.leftMouseDown = false
    }
    if (event.button === 1) {
      this.rightMouseDown = false
    }
    const state = {
      keysPressed: this.keysPressed,
      mouseData: {
        leftMousePressed: this.leftMouseDown,
        rightMousePressed: this.rightMouseDown,
        mouseCoords: this.mousePosition
      }
    }
    this.emit('mouseButtonUp', event.button)
    this.emit('input', state)
  }

  /**
   * Handles a `mousemove` event.
   * @param {MouseEvent} event The Mouse event to handle.
   */
  onMouseMove (event) {
    event.preventDefault()
    this.mousePosition[0] = event.offsetX
    this.mousePosition[1] = event.offsetY

    const state = {
      keysPressed: this.keysPressed,
      mouseData: {
        leftMousePressed: this.leftMouseDown,
        rightMousePressed: this.rightMouseDown,
        mouseCoords: this.mousePosition
      }
    }
    this.emit('mouseMove', this.mousePosition.slice())
    this.emit('input', state)
  }

  /**
   * Attaches the event handlers to elements in the DOM.
   * @param {Element} keyElement The element to track keypresses on.
   * @param {Element} mouseClickElement The element to track mouse clicks on.
   * @param {Element} mouseMoveElement The element to track mouse movement relative to.
   */
  attachEventHandlers (keyElement, mouseClickElement, mouseMoveElement) {
    keyElement.addEventListener('keydown', this.onKeyDown)
    keyElement.addEventListener('keyup', this.onKeyUp)
    mouseClickElement.addEventListener('mousedown', this.onMouseDown)
    mouseClickElement.addEventListener('mouseup', this.onMouseUp)
    mouseMoveElement.setAttribute('tabindex', 1)
    mouseMoveElement.addEventListener('mousemove', this.onMouseMove)
  }

  /**
   * Detaches the event handlers from elements in the DOM.
   * @param {Element} keyElement The element that we tracked keypresses on.
   * @param {Element} mouseClickElement The element that we tracked mouse clicks on.
   * @param {Element} mouseMoveElement The element that we tracked mouse movement relative to.
   */
  detachEventHandlers (keyElement, mouseClickElement, mouseMoveElement) {
    keyElement.removeEventListener('keydown', this.onKeyDown)
    keyElement.removeEventListener('keyup', this.onKeyUp)
    mouseClickElement.removeEventListener('mousedown', this.onMouseDown)
    mouseClickElement.removeEventListener('mouseup', this.onMouseUp)
    mouseMoveElement.setAttribute('tabindex', 1)
    mouseMoveElement.removeEventListener('mousemove', this.onMouseMove)
  }

  /**
   * Factory method for an InputTracker class.
   * @param {Element} keyElement The element to listen for keypresses
   * and mouse clicks on.
   * @param {Element} mouseMoveElement The element to track mouse
   * coordinates relative to.
   * @returns {InputTracker}
   */
  static create (keyElement, mouseMoveElement) {
    const input = new InputTracker()
    input.attachEventHandlers(keyElement, keyElement, mouseMoveElement)
    return input
  }
}
