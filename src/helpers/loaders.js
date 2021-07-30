/* eslint-env browser */
/**
 * @fileoverview File to store functions that load stuff
 * (i.e. functions that load files from a URL, images from an object URL).
 */

import debugFactory from 'debug'

import MapConfig from '../editor/map-config.js'
import * as fileUtils from './file-utils.js'

const debug = debugFactory('cw-map-editor:loaders')

/**
 * @typedef {Object} ImageLoaderOptions
 * @prop {string} baseURL The URL to load images relative from.
 */

/**
 * Fetches a resource from the specified URL. Rejects on failure.
 * @param {string} url The URL to fetch the resource from.
 * @returns {Promise<Response>}
 */
export async function fetchResource (url) {
  debug('Trying to fetch %s', url)
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

/**
 * Load a map from the user's hard drive. Returns null if no file was selected.
 * @returns {Promise<MapConfig|null>}
 */
export async function loadMap () {
  let fileStats = null
  let config = null

  try {
    const [file] = await fileUtils.openFiles({
      acceptedTypes: 'application/json',
      multiple: false
    })
    // Do not allow files over 25MB
    if (file.size > 25 * 1024 * 1024) {
      throw new RangeError('File too large!')
    }

    /**
     * XXX: The below is an arcane style of array destructuring, in case you didn't know.
     * (07/30/2021) Take-Some-Bytes */
    ;[fileStats] = await fileUtils.readFiles([file])
  } catch (ex) {
    debug(ex.stack)
    if (ex.code !== 'ENOFILE') {
      throw new Error('Failed to open configuration file!')
    }
    // No file was selected.
    return null
  }

  try {
    config = new MapConfig(
      new TextDecoder().decode(new Uint8Array(fileStats.contents))
    )
  } catch (ex) {
    debug(ex.stack)
    throw new Error(
      'Configuration file is invalid!' +
      ' Please do not mess with configuration files manually.'
    )
  }

  return config
}

/**
 * ImageLoader class.
 */
export class ImageLoader {
  /**
   * Constructor for an image loader class. The image loader class loads
   * images, storing them in an internal cache.
   * @param {ImageLoaderOptions} opts Options.
   */
  constructor (opts) {
    const { baseURL } = opts

    this.baseURL = baseURL

    /**
     * The internal cache of images that has been loaded.
     * @type {Map<string, InstanceType<Image>>}
     */
    this._imgCache = new Map()

    /**
     * A map of images that are currently being loaded.
     * @type {Map<string, Promise<HTMLImageElement>>}
     */
    this._loadingImgs = new Map()
  }

  /**
   * Loads an image. Uses a cached image if it exists.
   * @param {string} path The path of the image, relative to this ImageLoader's
   * baseURL property.
   * @param {boolean} [force=false] Whether to force the load. If true, this method
   * will not try to find the image in this ImageLoader's image cache. Default false.
   * @returns {Promise<HTMLImageElement>}
   */
  loadImg (path, force = false) {
    debug('Fetching image from path %s', path)

    if (this._imgCache.has(path) && !force) {
      debug('Image fetched from cache.')
      return Promise.resolve(this._imgCache.get(path))
    } else if (this._loadingImgs.has(path)) {
      debug('Image already loading.')
      return this._loadingImgs.get(path)
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image()
      const imgPath = new URL(path, this.baseURL).pathname
      debug('Absolute image path: %s', imgPath)

      img.src = imgPath

      img.addEventListener('error', e => {
        e.preventDefault()
        reject(new Error(e.error))
      })
      img.addEventListener('load', () => {
        this._imgCache.set(path, img)
        resolve(img)
      })
    })

    // Put the promise in the _loadingImgs map so that if the same
    // image was requested while it was already loading, we won't duplicate
    // our image requests.
    this._loadingImgs.set(path, promise)

    return promise
  }
}
