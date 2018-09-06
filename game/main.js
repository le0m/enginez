const map = {
  cols: 8,
  rows: 8,
  tileSize: 64,
  layers: [
    [
      3, 3, 3, 3, 3, 3, 3, 3,
      3, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 1, 1, 2, 1, 3,
      3, 1, 1, 1, 1, 1, 1, 3,
      3, 1, 1, 2, 1, 1, 1, 3,
      3, 1, 1, 1, 2, 1, 1, 3,
      3, 1, 1, 1, 2, 1, 1, 3,
      3, 3, 3, 1, 2, 3, 3, 3
    ], [
      4, 3, 3, 3, 3, 3, 3, 4,
      4, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 5, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 4,
      4, 0, 0, 0, 0, 0, 0, 4,
      4, 4, 4, 0, 5, 4, 4, 4,
      0, 3, 3, 0, 0, 3, 3, 3
    ]
  ],
  getTile: function (layer, col, row) {
    return this.layers[layer][row * this.cols + col]
  }
}

map.LAYER_GROUND = 0
map.LAYER_ABOVE = 1

Game.load = function () {
  return [
    Loader.loadImage('tiles', 'assets/tiles.png')
  ]
}

Game.init = function () {
  this.tileAtlas = Loader.getImage('tiles')
}

Game.update = function (delta) {
  this.delta = delta * 1000 | 0
  this.fps = 1 / delta | 0
}

Game._drawLayer = function (layer) {
  for (let x = 0; x < map.cols; x++) {
    for (let y = 0; y < map.rows; y++) {
      let tile = map.getTile(layer, x, y)

      if (tile !== 0) {
        this.ctx.drawImage(
          this.tileAtlas,             // image
          (tile - 1) * map.tileSize,  // source X
          0,                          // source Y
          map.tileSize,               // source width
          map.tileSize,               // source height
          x * map.tileSize,           // target X
          y * map.tileSize,           // target Y
          map.tileSize,               // target width
          map.tileSize                // target height
        )
      }
    }
  }
}

Game._drawGrid = function () {
  this.ctx.strokeStyle = 'black'

  for (let x = 0; x < map.cols; x++) {
    for (let y = 0; y < map.rows; y++) {
      this.ctx.strokeRect(
        x * map.tileSize,
        y * map.tileSize,
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
