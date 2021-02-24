/* eslint-env browser */
/**
 * @fileoverview Image drawer class to draw images and parts of sprite sheets.
 */

import * as loaders from '../../helpers/loaders.js'

/**
 * @typedef {Object} ImageDrawerOptions
 * @prop {string} imgDir
 * @prop {string} imgMetaDir Metadata for the images that are loaded, in a
 * JSON format (metadata could include aliases for the image-to-draw)
 * @prop {string} spriteSheetDir
 * @prop {string} spriteSheetMetaDir Metadata for the sprite sheets that are loaded,
 * in a JSON format (metadata could include aliases for sections of the sprite sheets).
 * @prop {CanvasRenderingContext2D} context
 *
 * @typedef {Object} LoadImageOptions
 * @prop {string} [imgDir] Overrides the ``imageDrawer.imgDir`` property.
 * @prop {string} [imgMetaDir] Overrides the ``imageDrawer.imgMetaDir`` property.
 * @prop {Array<string>} [aliases] Aliases for drawing the image-to-be-loaded.
 * @prop {boolean} [loadMeta] Whether to try to load a metadata file.
 *
 * @typedef {Object} AliasObject
 * @prop {string} pointer The image path that this alias actually points to.
 * @prop {ImageSection} [section]
 * @prop {boolean} [spriteSheet] Whether this alias is for a sprite sheet.
 *
 * @typedef {Object} ImageSection
 * @prop {import('../physics/vector2d').default} sectionStartPos
 * Starting position of the section.
 * @prop {import('../../components/custom-modal').Dimensions} sectionDimensions
 * The width and height of the image section
 *
 * @typedef {Object} DrawImageOptions
 * @prop {boolean} [centered] Whether to center the image on the canvas.
 * @prop {CanvasRenderingContext2D} [context] Overrides the canvas context
 * that this ImageDrawer was created with.
 * @prop {import('../physics/vector2d').default} [position] The position on the
 * canvas to draw the image.
 *
 * @typedef {Promise<{ img: HTMLImageElement, meta: Record<string, any> }>} PendingImage
 */

/**
 * Image drawer class.
 */
export default class ImageDrawer {
  /**
   * Message for too many aliases.
   * @returns {string}
   * @readonly
   */
  static get TOO_MANY_ALIASES () {
    return 'Too many aliases! Maximum is 3 per singular image, 10 per sprite sheet.'
  }

  /**
   * Constructor for an ImageDrawer class.
   * This class could draw whole images, sections of images, and aliased
   * sections of images.
   * @param {ImageDrawerOptions} options Options.
   */
  constructor (options) {
    const {
      imgDir, imgMetaDir,
      spriteSheetDir, spriteSheetMetaDir,
      context
    } = options

    this.imgDir = imgDir
    this.imgMetaDir = imgMetaDir
    this.spriteSheetDir = spriteSheetDir
    this.spriteSheetMetaDir = spriteSheetMetaDir

    this.ctx = context

    /**
     * Map to store the images loaded by this ImageDrawer.
     * @type {Map<string, HTMLImageElement>}
     */
    this.images = new Map()
    /**
     * Map to store aliases to images and sections of images.
     * @type {Map<string, AliasObject>}
     */
    this.aliases = new Map()

    /**
     * Images that are currently loading.
     * @type {Map<string, PendingImage>}
     */
    this.pendingImgLoads = new Map()
  }

  /**
   * Tries to get the actual image from an alias or path.
   * @param {string} pathOrAlias The path or alias to try.
   * @returns {HTMLImageElement|null}
   */
  _getImage (pathOrAlias) {
    if (this.aliases.has(pathOrAlias)) {
      return this.aliases.get(pathOrAlias)
    } else if (this.images.has(pathOrAlias)) {
      return this.images.get(pathOrAlias)
    }

    return null
  }

  /**
   * Just loads the image and metadata file.
   * @param {string} imgPath The image path.
   * @param {string} metaPath The image metadata path.
   * @param {boolean} loadMeta Whether to load image metadata.
   * @returns {Promise<{ img: HTMLImageElement, meta: Record<string, any> }>}
   * @private
   */
  async _loadImage (imgPath, metaPath, loadMeta) {
    const img = await loaders.loadImageFromBlob(
      await loaders.loadAsBlob(imgPath)
    )
    let meta = null

    if (loadMeta) {
      try {
        meta = await loaders.loadAsJson(metaPath)
      } catch (ex) {
        // Failed to load meta; just warn the user.
        console.warn(`Failed to load meta data for image ${imgPath}.`)
        meta = null
      }
    }
    return { img, meta }
  }

  /**
   * Loads a singular image, with optional metadata.
   * @param {string} path The path of the image, relative to the configured
   * image directory.
   * @param {LoadImageOptions} [options] Options.
   * @returns {Promise<HTMLImageElement>}
   */
  async loadImage (path, options = {}) {
    // if (this.pendingImgLoads.includes(path)) {
    //   // The image is currently being loaded, so don't try to load it
    //   // again.
    //   console.log('here')
    //   return
    // }
    // const loadMeta = options.loadMeta
    // const imgDir = options.imgDir || this.imgDir
    // const imgMetaDir = options.imgMetaDir || this.imgMetaDir
    // const aliases = Array.isArray(options)
    //   ? options.aliases.slice()
    //   : []

    // this.pendingImgLoads.push(path)

    // const img = await loaders.loadImageFromBlob(
    //   await loaders.loadAsBlob(`${imgDir}/${path}`)
    // )
    // let meta = null

    // if (loadMeta) {
    //   try {
    //     meta = await loaders.loadAsJson(`${imgMetaDir}/${path}.meta.json`)
    //   } catch (ex) {
    //     // Failed to load meta; just warn the user.
    //     console.warn(`Failed to load meta data for image ${path}.`)
    //     meta = null
    //   }
    // }

    // this.images.set(path, img)

    // if (meta && Array.isArray(meta.aliases)) {
    //   aliases.push(...meta.aliases)
    // }

    // for (const alias of aliases) {
    //   this.aliases.set(alias, { pointer: path })
    // }

    // return img
    if (this.pendingImgLoads.has(path)) {
      // The image is currently being loaded.
      return (await this.pendingImgLoads.get(path)).img
    } else if (this.images.has(path)) {
      // The image HAS been loaded.
      return this.images.get(path)
    }

    const loadMeta = options.loadMeta
    const imgDir = options.imgDir || this.imgDir
    const imgMetaDir = options.imgMetaDir || this.imgMetaDir
    const aliases = Array.isArray(options)
      ? options.aliases.slice()
      : []

    const pendingPromise = this._loadImage(
      `${imgDir}/${path}`, `${imgMetaDir}/${path}.meta.json`, loadMeta
    )
    this.pendingImgLoads.set(path, pendingPromise)

    const { img, meta } = await pendingPromise
    this.images.set(path, img)

    if (meta && Array.isArray(meta.aliases)) {
      aliases.push(...meta.aliases)
    }

    for (const alias of aliases) {
      this.aliases.set(alias, { pointer: path })
    }

    return img
  }

  /**
   * Draws a singular image onto the supplied context
   * @param {string} pathOrAlias The path to the image or an alias
   * for the image to draw.
   * @param {DrawImageOptions} options Options.
   */
  async drawImage (pathOrAlias, options) {
    const ctx = options.context || this.ctx
    let img = this._getImage(pathOrAlias)

    if (img === null) {
      // We don't have the image handy, so try lazy-loading it.
      try {
        img = await this.loadImage(pathOrAlias)
      } catch (ex) {
        // Notify the caller that the image wasn't found.
        throw new Error('The requested image was not found!')
      }
    }

    if (!(img instanceof HTMLImageElement)) {
      // Not sure how this will happen, but it's better to be safe that sorry.
      throw new TypeError('Failed to get image!')
    }

    const imgX = options.centered
      ? -img.width / 2
      : options.position.x
    const imgY = options.centered
      ? -img.height / 2
      : options.position.y

    ctx.drawImage(img, imgX, imgY)
  }
}
