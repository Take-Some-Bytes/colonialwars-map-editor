/* eslint-env browser */
/**
 * @fileoverview Functions used to mess around with client files.
 */

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
export function openFile (options) {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.style.display = 'none'
    fileInput.accept = options.acceptedTypes
    fileInput.multiple = options.multiple
    fileInput.addEventListener('change', () => {
      let files = Array.from(fileInput.files)
      document.body.removeChild(fileInput)
      if (!options.multiple) {
        files = [files[0]]
      }
      if (files.length < 1) {
        reject(new Error('No file picked!'))
      } else {
        resolve(files)
      }
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
  return new Promise((resolve, reject) => {
    const readers = files.map(file => {
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
    })

    Promise.all(readers)
      .then(resolve)
      .catch(reject)
  })
}
