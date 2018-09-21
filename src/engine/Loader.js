/**
 * Pre-loads images asynchronously.
 *
 * @class
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 */
export default class Loader {
  /**
   *
   * @param {Object} config - Loader component config
   * @param {Boolean} [config.debug=false] - Debug mode
   * @constructor
   */
  constructor (config) {
    this._images = {}

    // other
    this.debug = config.debug || false
  }

  /**
   * Load an image in DOM.
   *
   * @param {String} key - Image key for caching
   * @param {String} src - Image source path/URL
   * @return {Promise<String>} - Key of the loaded image
   */
  loadImage (key, src) {
    let that = this
    let img = new window.Image()
    let p = new Promise((resolve, reject) => {
      img.addEventListener('load', () => {
        if (that.debug) {
          console.log(`[LOADER] loaded image ${src}`)
        }

        that.images[key] = img
        resolve(key)
      })

      img.addEventListener('error', () => {
        reject(new Error(`[LOADER] could not load image ${src}`))
      })
    })

    img.src = src

    return p
  }

  /**
   * Get a loaded image.
   *
   * @param {String} key - Image key in cache
   * @return {Image|null}
   */
  getImage (key) {
    return (key in this._images) ? this.images[key] : null
  }
}
