/* eslint-env browser */
/**
 * @fileoverview Custom React hooks.
 */

import React from 'react'

/**
 * Get a function that force updates a React component and all its children.
 * @returns {() => void}
 */
export function useForceUpdate () {
  const setState = React.useState(0)[1]

  return () => setState(prev => prev + 1)
}
