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
   * @param {String} config.path - Relative path of the tileset, used for loading
   * @param {Loader} config.loader - {@link Loader} component instance, to pre-load and cache images
   * @param {Number[]} config.size - Size of the tileset, in columns and rows (int)
   * @param {Number} config.tileSize - Size of a single tile of the Tileset (int, px)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.key      = config.key
    this.source   = config.path
    this.loader   = config.loader
    this.size     = config.size
    this.tileSize = config.tileSize

    // other
    this.canvas   = null
    this.context  = null
    this.debug    = config.debug || false
  }

  /**
   * Load the tileset image in an off-canvas.
   *
   * @returns {Promise<String>} - Cache key of the loaded image
   */
  load () {
    return this._initImage()
      .then((key) => {
        this._initCanvas()

        return key
      })
  }

  /**
   * Load the image in DOM.
   *
   * @returns {Promise<String>}
   * @private
   */
  _initImage () {
    return this.loader.loadImage(this.key, this.source)
  }

  /**
   * Create the canvas and draw the image on it.
   *
   * @private
   */
  _initCanvas () {
    let [width, height] = this.getSize(true)
    let image = this.loader.getImage(this.key)

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d')
    this.context.drawImage(image, 0, 0)

    if (this.debug) {
      console.log(`[TILESET] [${this.key}] drawn (${this.getSize(true).join(' x ')} px, ${this.getSize().join(' x ')} cells)`)
    }
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
