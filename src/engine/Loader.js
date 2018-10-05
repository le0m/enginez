/**
 * Pre-loads images asynchronously.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Loader {
  /**
   *
   * @param {Object} config - Loader component config
   * @param {Boolean} [config.debug=false] - Debug mode
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
   * @return {Promise<String>} - Cache key of the loaded image
   */
  loadImage (key, src) {
    let that = this
    let img = new window.Image()
    let p = new Promise((resolve, reject) => {
      img.addEventListener('load', () => {
        if (that.debug) {
          console.log(`[LOADER] loaded image ${src}`)
        }

        that._images[key] = img
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
    return (key in this._images) ? this._images[key] : null
  }
}
