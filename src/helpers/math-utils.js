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
