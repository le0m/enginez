const map = {
  cols: 12,
  rows: 12,
  tileSize: 64,
  layers: [
    [
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3,
      3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
      3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3
    ], [
      4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4,
      4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3
    ]
  ],
  getTile: function (layer, col, row) {
    return this.layers[layer][row * this.cols + col]
  }
}

function Camera (map, width, height) {
  this.x = 0
  this.y = 0
  this.width = width
  this.height = height
  this.maxX = map.cols * map.tileSize - width
  this.maxY = map.rows * map.tileSize - height
}

Camera.SPEED = 256 // pixels per second

Camera.prototype.move = function (delta, dirX, dirY) {
  // move camera
  this.x += dirX * Camera.SPEED * delta
  this.y += dirY * Camera.SPEED * delta

  // clamp values
  this.x = Math.max(0, Math.min(this.x, this.maxX))
  this.y = Math.max(0, Math.min(this.y, this.maxY))
}

map.LAYER_GROUND = 0
map.LAYER_ABOVE = 1

Game.load = function () {
  return [
    Loader.loadImage('tiles', 'assets/tiles.png')
  ]
}

Game.init = function () {
  Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN])
  this.tileAtlas = Loader.getImage('tiles')
  this.camera = new Camera(map, 512, 512)
}

Game.update = function (delta) {
  // stats
  this.delta = delta * 1000 | 0
  this.fps = 1 / delta | 0

  // handle camera movement with keyboard
  let dirX = 0
  let dirY = 0

  if (Keyboard.isDown(Keyboard.LEFT))   { dirX = -1 }
  if (Keyboard.isDown(Keyboard.RIGHT))  { dirX = 1 }
  if (Keyboard.isDown(Keyboard.UP))     { dirY = -1 }
  if (Keyboard.isDown(Keyboard.DOWN))   { dirY = 1 }

  console.log('delta:', delta)
  this.camera.move(delta, dirX, dirY)
}

Game._drawLayer = function (layer) {
  let startCol = Math.floor(this.camera.x / map.tileSize)
  let endCol = startCol + Math.floor(this.camera.width / map.tileSize)
  let startRow = Math.floor(this.camera.y / map.tileSize)
  let endRow = startRow + Math.floor(this.camera.height / map.tileSize)
  let offsetX = -this.camera.x + startCol * map.tileSize // ???
  let offsetY = -this.camera.y + startRow * map.tileSize // ???
  let x = 0
  let y = 0
  let r = 0

  for (let c = startCol; c <= endCol; c++) {
    for (r = startRow; r <= endRow; r++) {
      let tile = map.getTile(layer, c, r)
      x = (c - startCol) * map.tileSize + offsetX
      y = (r - startRow) * map.tileSize + offsetY

      if (tile !== 0) {
        this.ctx.drawImage(
          this.tileAtlas,             // image
          (tile - 1) * map.tileSize,  // source X
          0,                          // source Y
          map.tileSize,               // source width
          map.tileSize,               // source height
          Math.round(x),              // target X
          Math.round(y),              // target Y
          map.tileSize,               // target width
          map.tileSize                // target height
        )
      }
    }
  }
}

Game._drawGrid = function () {
  let startCol = Math.floor(this.camera.x / map.tileSize)
  let endCol = startCol + Math.floor(this.camera.width / map.tileSize)
  let startRow = Math.floor(this.camera.y / map.tileSize)
  let endRow = startRow + Math.floor(this.camera.height / map.tileSize)
  let offsetX = -this.camera.x + startCol * map.tileSize // ???
  let offsetY = -this.camera.y + startRow * map.tileSize // ???
  let x = 0
  let y = 0
  let r = 0
  this.ctx.strokeStyle = 'black'

  for (let c = startCol; c <= endCol; c++) {
    for (r = startRow; r <= endRow; r++) {
      x = (c - startCol) * map.tileSize + offsetX
      y = (r - startRow) * map.tileSize + offsetY

      this.ctx.strokeRect(
        Math.round(x),
        Math.round(y),
        map.tileSize,
        map.tileSize
      )
    }
  }
}

Game._drawDebug = function () {
  this.ctx.fillStyle = 'black'
  this.ctx.fillRect(
    10,
    10,
    50,
    40
  )
  this.ctx.fillStyle = 'white'
  // this.ctx.textAlign = 'center'
  // this.ctx.textBaseline = 'middle'

  // FPS
  this.ctx.fillText(
    `FPS: ${ this.fps }`,
    15,
    25,
    45
  )

  // delta
  this.ctx.fillText(
    `Δ: ${ this.delta }ms`,
    15,
    45,
    45
  )
}

Game.render = function () {
  this._drawLayer(map.LAYER_GROUND)
  this._drawLayer(map.LAYER_ABOVE)
  this._drawGrid()
  this._drawDebug()
}
