/* eslint-env browser */
/**
 * @fileoverview Custom React hooks.
 */

import React from 'react'

/**
 * @typedef {{
 * '2d': CanvasRenderingContext2D,
 * bitmaprenderer: ImageBitmapRenderingContext,
 * webgl: WebGLRenderingContext,
 * webgl2: WebGL2RenderingContext
 * }} Contextes
 *
 * @typedef {Object} UseCanvasOptions
 * @prop {import('../components/custom-modal').Dimensions} dimensions
 */
/**
 * @callback DrawFunction
 * @param {Contextes[T]} ctx
 * @returns {void}
 * @template T
 */

/**
 * React hook for using a canvas. Will not do anything if the ref that is returned
 * is not attached to a HTML ``canvas`` element.
 * @param {DrawFunction<K>} draw Called with the canvas context, and is passed
 * to ``window.requestAnimationFrame``.
 * @param {K extends keyof Contextes ? K : any} canvasContext The context of the canvas.
 * @param {UseCanvasOptions} options Options.
 * @template K
 */
export function useCanvas (draw, canvasContext, options) {
  const canvasRef = React.useRef(null)
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (canvas instanceof HTMLCanvasElement) {
      canvas.height = options.dimensions.height
      canvas.width = options.dimensions.width

      const context = canvas.getContext(canvasContext)
      let animationFrameId = null

      function render () {
        draw(context)
        animationFrameId = window.requestAnimationFrame(render)
      }
      render()
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [draw])
  return canvasRef
}
