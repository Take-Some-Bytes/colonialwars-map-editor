/* eslint-env browser */
/**
 * @fileoverview File to store functions that load stuff
 * (i.e. functions that load files from a URL, images from an object URL).
 */

/**
 * Fetches a resource from the specified URL. Rejects on failure.
 * @param {string} url The URL to fetch the resource from.
 * @returns {Promise<Response>}
 */
export async function fetchResource (url) {
  const res = await fetch(url, { method: 'GET' })

  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}.`)
  }

  return res
}
/**
 * Loads a resource from an URL as a blob. Rejects on failure.
 * @param {string} url The URL to load the resource from.
 * @returns {Promise<Blob>}
 */
export async function loadAsBlob (url) {
  return await (await fetchResource(url)).blob()
}
/**
 * Loads a resource from an URL as JSON. Rejects on failure.
 * @param {string} url The URL to load the resource from.
 * @returns {Promise<Record<string, any>>}
 */
export async function loadAsJson (url) {
  return await (await fetchResource(url)).json()
}
/**
 * Loads an image from a blob.
 * @param {Blob} blob The blob to load the image from.
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImageFromBlob (blob) {
  return new Promise((resolve, reject) => {
    if (!(blob instanceof Blob)) {
      throw new TypeError('The blob parameter must be a valid blob!')
    }
    const objURL = URL.createObjectURL(blob)
    const img = new Image()
    img.addEventListener('load', () => {
      URL.revokeObjectURL(objURL)
      resolve(img)
    })
    img.addEventListener('error', e => {
      reject(e)
    })
    img.src = objURL
  })
}
