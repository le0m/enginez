//
// Camera object
//

function Camera (map, options) {
  this.x = 0
  this.y = 0
  this.width = options.width || 128
  this.height = options.height || 128
  this.maxX = map.cols * map.tileSize - this.width
  this.maxY = map.rows * map.tileSize - this.height
  this.speed = options.speed || 256 // pixels per second
  this.tileSize = map.tileSize
  this.view = {
    startCol: 0,
    endCol: 0,
    startRow: 0,
    endRow: 0,
    offsetX: 0,
    offsetY: 0
  }
}

Camera.prototype.move = function (delta, dirX, dirY) {
  // move camera
  this.x += dirX * this.speed * delta
  this.y += dirY * this.speed * delta

  // clamp values
  this.x = Math.max(0, Math.min(this.x, this.maxX))
  this.y = Math.max(0, Math.min(this.y, this.maxY))

  this._updateView()
}

Camera.prototype._updateView = function () {
  this.view.startCol = Math.floor(this.x / this.tileSize)
  this.view.endCol = this.view.startCol + Math.floor(this.width / this.tileSize)
  this.view.startRow = Math.floor(this.y / this.tileSize)
  this.view.endRow = this.view.startRow + Math.floor(this.height / this.tileSize)
  this.view.offsetX = -this.x + this.view.startCol * this.tileSize
  this.view.offsetY = -this.y + this.view.startRow * this.tileSize
}
