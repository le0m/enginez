import EventQueue from './EventQueue.js'

/**
 * This component handles a single layer of
 * the game map, from rendering to events.
 *
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
   * @param {Tileset} config.tileset - {@link Tileset} component instance, source for draws
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.level    = config.level
    this.tileMap  = config.map
    this.tileset  = config.tileset
    this.state    = config.state

    // other
    this.canvas   = null
    this.context  = null
    this.queue    = new EventQueue()
    this._dirty   = true
    this.debug    = config.debug || false // debug mode
  }

  /**
   * Initialize Layer.
   * Create an off-canvas to draw the layer on.
   */
  init () {
    // initialize layer canvas
    let [width, height] = this.getSize(true)

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.context = this.canvas.getContext('2d')

    this.draw() // initial render

    // save tile IDs in tile states (do this better)
    let c = 0
    for (let r = 0; r < this.tileMap.length; r++) {
      for (c = 0; c < this.tileMap[r].length; c++) {
        this.state.stateMap[this.level][r][c].tileID = this.tileMap[r][c]
      }
    }
  }

  /**
   * Draw the current layer map to off-canvas.
   * Does nothing if the map has not changed.
   */
  draw () {
    // re-draw if changed
    if (this._dirty) {
      if (this.debug) {
        console.log(`[LAYER] [${this.level}] drawing (${this.getSize(true).join(' x ')} px, ${this.getSize().join(' x ')} cells)`)
      }

      let [cols, rows] = this.getSize()
      let [tileSetCols] = this.tileset.getSize()
      let tileSize = this.tileset.tileSize
      let c = 0, tileID = 0, x = 0, y = 0, srcX = 0, srcY = 0
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

      for (let r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
          tileID = this.getTileID(c, r)

          if (tileID > 0) {
            x = c * tileSize
            y = r * tileSize
            srcX = ((tileID - 1) % tileSetCols) * tileSize
            srcY = ((tileID - 1) / tileSetCols | 0) * tileSize

            this.context.drawImage(
              this.tileset.canvas,  // source
              srcX,                 // source X
              srcY,                 // source Y
              tileSize,             // source width
              tileSize,             // source height
              x,                    // target X
              y,                    // target Y
              tileSize,             // target width
              tileSize              // target height
            )
          }
        }
      }

      this._dirty = false
    }
  }

  /**
   * Update the layer state.
   *
   * @param {Number} delta - Time elapsed (int, ms)
   */
  update (delta) {}

  /**
   * Get the layer size.
   *
   * @param {Boolean} pixel - Whether you want size in tiles or pixels
   * @returns {Number[]} - Width and height of the layer
   */
  getSize (pixel = false) {
    return [
      this.tileMap[0].length * (pixel ? this.tileset.tileSize : 1),
      this.tileMap.length * (pixel ? this.tileset.tileSize : 1)
    ]
  }

  /**
   * Get the current ID of a tile.
   *
   * @param {Number} col - 0-indexed tile column (int)
   * @param {Number} row - 0-indexed tile row (int)
   * @returns {Number} - ID of the tile in the required position
   */
  getTileID (col, row) {
    return this.tileMap[row][col]
  }

  /**
   * Set the current ID of a tile.
   *
   * @param {Number} tileID - New tile ID
   * @param {Number} col - 0-indexed tile col (int)
   * @param {Number} row - 0-indexed tile row (int)
   */
  setTileID (tileID, col, row) {
    this.tileMap[row][col] = tileID
    this._dirty = true
  }
}
