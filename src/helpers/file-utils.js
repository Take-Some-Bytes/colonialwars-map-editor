/* eslint-env browser */
/**
 * @fileoverview Functions used to mess around with client files.
 */

import debugFactory from 'debug'

const debug = debugFactory('cw-map-editor:file-utils')

/**
 * @typedef {Object} OpenFileOptions
 * @prop {string} acceptedTypes
 * @prop {boolean} multiple
 *
 * @typedef {Object} FileStats
 * @prop {string} name
 * @prop {string} type
 * @prop {ArrayBuffer} contents
 */

/**
 * Asks the client to open one or more files.
 * @param {OpenFileOptions} options Options.
 * @returns {Promise<Array<File>>}
 */
export function openFiles (options) {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input')

    fileInput.type = 'file'
    fileInput.style.display = 'none'
    fileInput.accept = options.acceptedTypes
    fileInput.multiple = options.multiple
    fileInput.value = null

    fileInput.addEventListener('change', () => {
      let files = Array.from(fileInput.files)
      debug('File input change!')

      if (!options.multiple) {
        files = [files[0]]
      }
      if (files.length < 1) {
        reject(createError('No file picked!', 'ENOFILE'))
      } else {
        resolve(files)
      }
    })
    fileInput.addEventListener('error', e => {
      reject(new Error(e.message))
    })
    window.addEventListener('focus', function checkFilePicked () {
      setTimeout(() => {
        window.removeEventListener('focus', checkFilePicked)
        document.body.removeChild(fileInput)
        debug('Number of files picked: %d', fileInput.files.length)
        if (fileInput.files.length < 1) {
          reject(createError('No file picked!', 'ENOFILE'))
        }
      }, 100)
    })

    document.body.appendChild(fileInput)
    fileInput.click()
  })
}
/**
 * Reads a list of file objects and returns an array of the file's
 * stats and contents.
 * @param {Array<File>} files The files to read.
 * @returns {Promise<Array<FileStats>>}
 */
export function readFiles (files) {
  return Promise.all(files.map(file => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', e => {
        resolve({
          name: file.name,
          type: file.type,
          contents: e.target.result
        })
      })
      fileReader.addEventListener('error', reject)
      fileReader.readAsArrayBuffer(file)
    })
  }))
}

/**
 * Creates an Error object that has a code.
 * @param {string} msg The error message.
 * @param {string} code The error code.
 * @returns {Error & { code: string; }}
 */
function createError (msg, code) {
  /** @type {Error & { code: string; }} */
  const err = new Error(msg)
  err.code = code
  return err
}
