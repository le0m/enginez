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
}

Camera.prototype.move = function (delta, dirX, dirY) {
  // move camera
  this.x += dirX * this.speed * delta
  this.y += dirY * this.speed * delta

  // clamp values
  this.x = Math.max(0, Math.min(this.x, this.maxX))
  this.y = Math.max(0, Math.min(this.y, this.maxY))
}
