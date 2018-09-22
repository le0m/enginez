/**
 * This component represent a tileset and its properties.
 */
export default class Tileset {
  /* eslint-disable no-multi-spaces */

  /**
   * @param {Object} config - Engine component configuration
   * @param {String} config.key - Key of the tileset, used for cache
   * @param {String} config.source - Relative path of the image file
   * @param {Number[]} config.size - Size of the tileset, in columns and rows (int)
   * @param {Number} config.tileSize - Size of a single tile of the Tileset (int, px)
   * @param {Loader} config.loader - {@link Loader} component instance, to pre-load and cache images
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.key      = config.key
    this.source   = config.source
    this.size     = config.size
    this.tileSize = config.tileSize
    this.loader   = config.loader

    // other
    this.canvas = null
    this.context = null
    this.debug    = config.debug || false
  }

  /**
   * Uses {@link Loader} to load and pre-render
   * the image in a canvas.
   *
   * @return {Promise<String>} - Key of the loaded image
   */
  load () {
    return this.loader.loadImage(this.key, this.source)
      .then((key) => {
        this._initCanvas()

        return key
      })
  }

  /**
   * Create the canvas and draw the image on it.
   *
   * @private
   */
  _initCanvas () {
    let width = this.size[0] * this.tileSize
    let height = this.size[1] * this.tileSize
    let image = this.loader.getImage(this.key)

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d')
    this.context.drawImage(image, 0, 0)
  }
}
