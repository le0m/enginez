/**
 * This component handles viewport movement and drawing.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Viewport {
  /* eslint-disable no-multi-spaces */

  /**
   * @param {Object} config - Viewport component config
   * @param {HTMLCanvasElement} config.canvas - HTML canvas element to be used as viewport
   * @param {Number} config.width - Canvas width (int, px)
   * @param {Number} config.height - Canvas height (int, px)
   * @param {Number} config.worldWidth - World width as a boundary, origin at (0,0) is assumed (int, px)
   * @param {Number} config.worldHeight - World height as a boundary, origin at (0,0) is assumed (int, px)
   * @param {Number} [config.startX=0] - Starting X position (int, px)
   * @param {Number} [config.startY=0] - Starting Y position (int, px)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // viewport related
    this.canvas       = config.canvas
    this.context      = config.canvas.getContext('2d')
    this.width        = config.width
    this.height       = config.height
    this.worldWidth   = config.worldWidth
    this.worldHeight  = config.worldHeight
    this.offsetX      = config.startX || 0
    this.offsetY      = config.startY || 0

    // other
    this.debug = config.debug || false

    // ensure canvas style
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.zIndex = '0'

    if (this.debug) {
      console.log(`[VIEWPORT] ready (${this.width} x ${this.height} px)`)
    }
  }

  /**
   * Move the viewport.
   *
   * @param {Number} offsetX - Distance on the X axis (int, px)
   * @param {Number} offsetY - Distance on the Y axis (int, px)
   */
  move ([offsetX, offsetY]) {
    // move viewport
    this.offsetX += offsetX
    this.offsetY += offsetY

    // clamp values
    this.offsetX = Math.max(0, Math.min(this.worldWidth - this.width, this.offsetX))
    this.offsetY = Math.max(0, Math.min(this.worldHeight - this.height, this.offsetY))
  }

  /**
   * Draw visible part of a canvas on the Viewport canvas.
   *
   * @param {HTMLCanvasElement} source - Source canvas for drawing
   */
  draw (source) {
    this.context.drawImage(
      source,       // source context
      this.offsetX, // source X
      this.offsetY, // source Y
      this.width,   // source width
      this.height,  // source height
      0,            // target X
      0,            // target Y
      this.width,   // target width
      this.height   // target height
    )
  }

  /**
   * Clear viewport canvas.
   */
  clear () {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  /**
   * Get current viewport rectangle.
   *
   * @param {Number|Boolean} tileSize - `false` for pixels, or the size of a single tile for cols/rows
   * @returns {Number[]} - Top-left and bottom-right corners coordinates [x1, y1, x2, y2], or visible cols/rows [staCol, endCol, staRow, endRow]
   */
  getRect (tileSize = false) {
    if (!tileSize) {
      return [
        this.offsetX,
        this.offsetY,
        this.offsetX + this.width,
        this.offsetY + this.height
      ]
    }

    // first and last visible columns and rows
    let startCol  = this.offsetX / tileSize | 0
    let endCol    = (this.width + this.offsetX - 1) / tileSize | 0 // -1 is because pixels are 1-indexed, but coords are 0-indexed
    let startRow  = this.offsetY / tileSize | 0
    let endRow    = (this.height + this.offsetY - 1) / tileSize | 0 // -1 is because pixels are 1-indexed, but coords are 0-indexed

    return [
      startCol,
      endCol,
      startRow,
      endRow
    ]
  }

  /**
   * Convert viewport-relative coordinates to world-relative.
   *
   * @param {Number} x - Position on the X axis (int, px)
   * @param {Number} y - Position on the Y axis (int, px)
   * @returns {Number[]} - Coordinates relative to world
   */
  canvasToWorldPosition (x, y) {
    return [
      x + this.offsetX,
      y + this.offsetY
    ]
  }

  /**
   * Convert world-relative coordinates to viewport-relative.
   *
   * @param {Number} x - Position on the X axis (int, px)
   * @param {Number} y - Position on the Y axis (int, px)
   * @returns {Number[]} - Coordinates relative to viewport
   */
  worldToCanvasPosition (x, y) {
    return [
      x - this.offsetX,
      y - this.offsetY
    ]
  }
}
