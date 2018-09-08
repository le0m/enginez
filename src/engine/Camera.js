'use strict'

//
// Camera object
//

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
 *
 * @param {Object} options
 * @constructor
 */
function Camera (options) {
  this.x        = options.startX || 0
  this.y        = options.startY || 0
  this.width    = options.width || 512
  this.height   = options.height || 512
  this.maxX     = options.cols * assets.tileSize - this.width
  this.maxY     = options.rows * assets.tileSize - this.height
  this.speed    = options.speed || 256 // pixels per second
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
Camera.prototype.move = function (delta, dirX, dirY) {
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
Camera.prototype._updateView = function () {
  this.view.startCol  = this.x / assets.tileSize | 0
  this.view.endCol    = this.view.startCol + (this.width / assets.tileSize | 0)
  this.view.startRow  = this.y / assets.tileSize | 0
  this.view.endRow    = this.view.startRow + (this.height / assets.tileSize | 0)
  this.view.offsetX   = -this.x + this.view.startCol * assets.tileSize
  this.view.offsetY   = -this.y + this.view.startRow * assets.tileSize
}
