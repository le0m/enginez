import EventQueue from './EventQueue.js'

/**
 * This component handles a single layer of
 * the game map, from rendering to events.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Layer {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - World component config
   * @param {Number} config.level - Level of this layer in the map, 0-indexed (int)
   * @param {State} config.state - {@link State} component instance, to update states when updating tiles
   * @param {Number[][]} config.map - Layer map represented as a 2-dimensional array of tile IDs (int)
   * @param {Number} config.tileSize - Size of a single tile of the tileset, to calculate map measures (int, px)
   * @param {CanvasRenderingContext2D|Image} config.tileSet - Reference to a pre-loaded tileset to use as source image
   * @param {Number[]} config.tileSetSize - Size of the tileset, in columns and rows (int)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.level        = config.level
    this.map          = config.map
    this.tileSize     = config.tileSize
    this.tileSet      = config.tileSet
    this.tileSetSize  = config.tileSetSize
    this.state        = config.state

    // other
    this.canvas       = null
    this.context      = null
    this.queue        = new EventQueue({})
    this._dirty       = false
    this.debug        = config.debug || false // debug mode

    this._initCanvas()
    this.draw() // initial render
  }

  /**
   * Create an off-canvas to draw the layer on.
   * @private
   */
  _initCanvas () {
    let width = this.map[0].length * this.tileSize
    let height = this.map.length * this.tileSize

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d')
  }

  /**
   * Draw the current layer map to off-canvas.
   * Does nothing if the map has not changed.
   */
  draw () {
    // re-draw if changed
    if (this._dirty) {
      let [cols, rows] = this.getMapSize()
      let tileSetCols = this.tileSetSize[0]
      let c = 0, tileID = 0, x = 0, y = 0, srcX = 0, srcY = 0

      for (let r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
          tileID = this.map[r][c]

          if (tileID > 0) {
            x = c * this.tileSize
            y = r * this.tileSize
            srcX = ((tileID - 1) % tileSetCols) * this.tileSize
            srcY = ((tileID - 1) / tileSetCols | 0) * this.tileSize

            this.context.drawImage(
              this.tileSet,   // source
              srcX,           // source X
              srcY,           // source Y
              this.tileSize,  // source width
              this.tileSize,  // source height
              x,              // target X
              y,              // target Y
              this.tileSize,  // target width
              this.tileSize   // target height
            )
          }
        }
      }

      this._dirty = false
    }
  }

  /**
   * Get the map size.
   *
   * @param {Boolean} pixel - Whether you want size in tiles or pixels
   * @returns {Number[]} - Width and height of the map
   */
  getMapSize (pixel = false) {
    return [
      this.map[0].length * (pixel ? this.tileSize : 1),
      this.map.length * (pixel ? this.tileSize : 1)
    ]
  }
}
