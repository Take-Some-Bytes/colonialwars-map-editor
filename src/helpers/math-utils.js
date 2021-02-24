/* eslint-env browser */
/**
 * @fileoverview Functions used to mess around with numbers and math.
 */

/**
 * Bounds a number to a minimum and maximum. This function
 * will still work if min and max are switched (i.e. min is larger than max).
 * @param {number} val The value to bound.
 * @param {number} min The minimum bound.
 * @param {number} max The maximum bound.
 * @returns {number}
 */
export function bound (val, min, max) {
  if (min > max) return Math.min(min, Math.max(max, val))
  return Math.min(max, Math.max(min, val))
}
/**
 * Returns a boolean representing whether the given value is between the minimum
 * and maximum, inclusive of both bounds. This function will still work if
 * ``min`` and ``max`` are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum bound.
 * @param {number} max The maximum bound.
 */
export function inBound (val, min, max) {
  if (min > max) { return val >= max && val <= min }
  return val >= min && val <= max
}
