/**
 * This component represent a tileset and its properties.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Tileset {
  /* eslint-disable no-multi-spaces */

  /**
   * @param {Object} config - Engine component configuration
   * @param {String} config.key - Key of the tileset, used for cache
   * @param {Image} config.image - HTML source image
   * @param {Number[]} config.size - Size of the tileset, in columns and rows (int)
   * @param {Number} config.tileSize - Size of a single tile of the Tileset (int, px)
   * @param {Loader} config.loader - {@link Loader} component instance, to pre-load and cache images
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.key      = config.key
    this.image   = config.image
    this.size     = config.size
    this.tileSize = config.tileSize

    // other
    this.canvas = null
    this.context = null
    this.debug    = config.debug || false

    this._initCanvas()
  }

  /**
   * Create the canvas and draw the image on it.
   *
   * @private
   */
  _initCanvas () {
    let [width, height] = this.getSize(true)

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d')
    this.context.drawImage(this.image, 0, 0)
  }

  /**
   * Get the tileset size.
   *
   * @param {Boolean} pixel - Whether you want size in tiles or pixels
   * @returns {Number[]} - Width and height of the tileset
   */
  getSize (pixel = false) {
    return [
      this.size[0] * (pixel ? this.tileSize : 1),
      this.size[1] * (pixel ? this.tileSize : 1)
    ]
  }
}
