/**
 * This component handles viewport movement and drawing.
 */
export default class Viewport {
  /* eslint-disable no-multi-spaces */

  /**
   * @param {Object} config - Viewport component config
   * @param {HTMLElement} config.canvas - HTML canvas element to be used as viewport
   * @param {Number} config.width - Canvas width (int, px)
   * @param {Number} config.height - Canvas height (int, px)
   * @param {Number} config.worldWidth - World width as a boundary, origin at (0,0) is assumed (int, px)
   * @param {Number} config.worldHeight - World height as a boundary, origin at (0,0) is assumed (int, px)
   * @param {Number} [config.startX=0] - Starting X position (int, px)
   * @param {Number} [config.startY=0] - Starting Y position (int, px)
   *
   * @param {Boolean} [config.debug=false] - Debug mode
   * @constructor
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
    this.offsetX = Math.max(0, Math.min(this.worldWidth, this.offsetX)) | 0
    this.offsetY = Math.max(0, Math.min(this.worldHeight, this.offsetY))
  }

  /**
   * Draw something on the Viewport canvas.
   */
  draw () {}
}
