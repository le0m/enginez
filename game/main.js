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

map.LAYER_GROUND = 0
map.LAYER_ABOVE = 1

Engine.load = function () {
  return [
    Loader.loadImage('tiles', 'assets/tilesheet.png')
  ]
}

Engine.init = function () {
  Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN])
  this.tileAtlas = Loader.getImage('tiles')

  this.camera = new Camera(map, {
    width: this.width,
    height: this.height,
    speed: this.cameraSpeed
  })
}

Engine.update = function (delta) {
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

  this.camera.move(delta, dirX, dirY)
}

Engine.render = function () {
  map.layers.forEach((layer, index) => {
    this._drawLayer(index)
  })
  this._drawGrid()
  this._drawDebug()
}

Engine._drawLayer = function (layer) {
  let view = this.camera.view
  let x = 0, y = 0, r = 0

  for (let c = view.startCol; c <= view.endCol; c++) {
    for (r = view.startRow; r <= view.endRow; r++) {
      let tile = map.getTile(layer, c, r)
      x = (c - view.startCol) * map.tileSize + view.offsetX
      y = (r - view.startRow) * map.tileSize + view.offsetY

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

Engine._drawGrid = function () {
  let view = this.camera.view
  let x = 0, y = 0, r = 0
  this.ctx.strokeStyle = 'black'

  for (let c = view.startCol; c <= view.endCol; c++) {
    for (r = view.startRow; r <= view.endRow; r++) {
      x = (c - view.startCol) * map.tileSize + view.offsetX
      y = (r - view.startRow) * map.tileSize + view.offsetY

      this.ctx.strokeRect(
        Math.round(x),    // target X
        Math.round(y),    // target Y
        map.tileSize,     // target width
        map.tileSize      // target height
      )
    }
  }
}

Engine._drawDebug = function () {
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

//
// Start up function
//

window.onload = function () {
  let context = document.getElementById('canvas').getContext('2d')

  Engine.run(context, { width: 512, height: 512, cameraSpeed: 256 })
}
