/**
 * Camera object to handle scrolling.
 *
 * You can use it's `view` property to keep track
 * of what is in user's view currently:
 * - `startCol` first column in view
 * - `endCol` last column in view
 * - `startRow` first row in view
 * - `endRow` last row in view
 * - `offsetX` starting X for rendering, using camera offset of half-visible tiles
 * - `offsetY` starting Y for rendering, using camera offset of half-visible tiles
 */
export default class Camera {
  /**
   * Accepted options:
   * - `startX`, starting X
   * - `startY`, starting Y
   * - `width`, canvas width
   * - `height`, canvas height
   * - `tileSize`, pixel tile size (square)
   * - `cols`, map number of columns
   * - `rows`, map number of rows
   * - `speed`, movement speed factor (px/s)
   *
   * @param {Object} options
   * @constructor
   */
  constructor (options) {
    /* eslint-disable no-multi-spaces */
    this.x        = options.startX || 0
    this.y        = options.startY || 0
    this.width    = options.width || 512
    this.height   = options.height || 512
    this.tileSize = options.tileSize || 16
    this.maxX     = options.cols * this.tileSize - this.width
    this.maxY     = options.rows * this.tileSize - this.height
    this.speed    = options.speed || 0.256 // pixels per ms
    this.view     = {
      startCol: 0,
      endCol: 0,
      startRow: 0,
      endRow: 0,
      offsetX: 0,
      offsetY: 0
    }

    this._updateView()
  }

  /**
   * Move the camera, updating current `view`.
   *
   * @param {number} delta
   * @param {number} dirX
   * @param {number} dirY
   */
  move (delta, dirX, dirY) {
    // move camera
    this.x += dirX * this.speed * delta
    this.y += dirY * this.speed * delta

    // clamp values
    this.x = Math.max(0, Math.min(this.x, this.maxX)) | 0
    this.y = Math.max(0, Math.min(this.y, this.maxY)) | 0

    this._updateView()
  }

  /**
   * Updates `view` coordinates.
   *
   * @private
   */
  _updateView () {
    /* eslint-disable no-multi-spaces */
    this.view.startCol  = this.x / this.tileSize | 0
    this.view.endCol    = this.view.startCol + (this.width / this.tileSize | 0)
    this.view.startRow  = this.y / this.tileSize | 0
    this.view.endRow    = this.view.startRow + (this.height / this.tileSize | 0)
    this.view.offsetX   = -this.x + this.view.startCol * this.tileSize
    this.view.offsetY   = -this.y + this.view.startRow * this.tileSize
  }
}
