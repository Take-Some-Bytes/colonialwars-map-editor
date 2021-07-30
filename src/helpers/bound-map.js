/* eslint-env browser */
/**
 * @fileoverview A class that creates objects with an API like a JS ``Map``,
 * which are bound to an inner object. "Bound" meaning that all storage
 * of values and keys will happen in a specific object.
 */

import debugFactory from 'debug'

const debug = debugFactory('cw-map-editor:bound-map')

/**
 * @typedef {Object} BaseValue
 * @prop {string} id
 */

/**
 * BoundMap class that stores values in the specified object.
 *
 * A BoundMap class provides an API like the built-in JS ``Map`` class,
 * with the exception that keys are always strings, and actual storage
 * of values happens in an object you provide.
 * @template {BaseValue} V
 */
export default class BoundMap {
  /**
   * Create a new BoundMap object.
   *
   * A BoundMap object requires a reference to an existing object, since all of
   * its storing of values must happen in an existing object.
   * @param {Record<string, V>} obj The internal object that actually stores
   * the map configurations.
   */
  constructor (obj) {
    /**
     * A reference to the place we will actually store stuff in.
     * @private
     */
    this._internalStorage = obj
  }

  /**
   * Check if this BoundMap has an item with ``id``.
   * @param {string} id The ID of the item.
   * @returns {boolean}
   */
  has (id) {
    return id in this._internalStorage
  }

  /**
   * Get an item by its ID. Returns null if the item does not exist.
   * @param {string} id The ID of the item.
   */
  get (id) {
    return this._internalStorage[id] ?? null
  }

  /**
   * Modifies the item which is associated with ``id``. If there are no
   * items associated with ``id``, a new one is created.
   * @param {string} id The ID of the item to modify.
   * @param {Omit<V, 'id'>} opts Options for modifying the item.
   */
  set (id, opts) {
    // Just for debugging.
    if (!(id in this._internalStorage)) {
      debug('Adding item with ID "%s"', id)
    }
    // This is literately all we need to do.
    this._internalStorage[id] = {
      ...opts,
      id: id
    }
  }

  /**
   * Deletes the item associated with ``id``. Returns true if the
   * graphic was successfully deleted.
   * @param {string} id The ID of the item.
   * @returns {boolean}
   */
  del (id) {
    return delete this._internalStorage[id]
  }

  /**
   * Get all values stored in this BoundMap.
   * @returns {Array<V>}
   */
  all () {
    return Object.values(this._internalStorage)
  }
}
