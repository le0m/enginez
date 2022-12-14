import { ConsoleExtra } from '../utils.js'

const console = ConsoleExtra(window.console)

/**
 * This component handles viewport movement and drawing.
 *
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
    this.debug        = config.debug || false

    // ensure canvas style (`World` will trigger a resize)
    this.canvas.style.zIndex = '0'

    // clamp start
    this.offsetX = Math.min(this.offsetX, this.worldWidth - this.width)
    this.offsetY = Math.min(this.offsetY, this.worldHeight - this.height)

    if (this.debug && (config.startX !== this.offsetX || config.startY !== this.offsetY)) {
      console.log(`[VIEWPORT] clamping starting position: ${this.offsetX} | ${this.offsetY}`)
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
   * @param {Number|Boolean} [tileSize=false] - `false` for pixels, or the size of a single tile for cols/rows
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

    // first and last visible columns and rows (-1 is because pixels are 1-indexed, but coords are 0-indexed)
    const startCol  = this.offsetX / tileSize | 0
    const endCol    = (this.width + this.offsetX - 1) / tileSize | 0
    const startRow  = this.offsetY / tileSize | 0
    const endRow    = (this.height + this.offsetY - 1) / tileSize | 0

    return [startCol, endCol, startRow, endRow]
  }

  /**
   * Convert viewport-relative coordinates to world-relative.
   *
   * @param {Number} x - Position on the X axis (int, px)
   * @param {Number} y - Position on the Y axis (int, px)
   * @param {Number|Boolean} [tileSize=false] - `false` for pixels, or the size of a single tile for cols/rows
   * @returns {Number[]} - Coordinates relative to world; column/row if `tileSize` is given
   */
  canvasToWorldPosition (x, y, tileSize = false) {
    const offsetX = x + this.offsetX
    const offsetY = y + this.offsetY

    if (!tileSize) {
      return [offsetX, offsetY]
    }

    const col = offsetX / tileSize | 0
    const row = offsetY / tileSize | 0

    return [col, row]
  }

  /**
   * Convert world-relative coordinates to viewport-relative.
   *
   * @param {Number} x - Position on the X axis (int, px)
   * @param {Number} y - Position on the Y axis (int, px)
   * @param {Number|Boolean} [tileSize=false] - `false` for pixels, or the size of a single tile for cols/rows
   * @returns {Number[]} - Coordinates relative to viewport; column/row if `tileSize` is given
   */
  worldToCanvasPosition (x, y, tileSize = false) {
    const offsetX = x - this.offsetX
    const offsetY = y - this.offsetY

    if (!tileSize) {
      return [offsetX, offsetY]
    }

    const col = offsetX / tileSize | 0
    const row = offsetY / tileSize | 0

    return [col, row]
  }

  /**
   * Resize the canvas.
   *
   * @param {Number} width - New width (int, px)
   * @param {Number} height - New height (int, px)
   */
  resize (width, height) {
    if (this.debug) {
      console.throttle(1000).log(`[VIEWPORT] setting size: ${width} x ${height} px`)
    }

    this.width = width
    this.height = height
    this.canvas.width = width
    this.canvas.height = height

    // clamp position
    this.offsetX = Math.min(this.offsetX, this.worldWidth - this.width)
    this.offsetY = Math.min(this.offsetY, this.worldHeight - this.height)
  }
}
