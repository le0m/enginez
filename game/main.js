const map = {
  cols: 16,
  rows: 16,
  tileSize: 128,
  tileCols: 18,
  tileRows: 7,
  layers: [
    [
      58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58,
      58, 76, 76, 76, 74, 73,  1,  1,  1, 38, 38, 38,  3,  3,  4, 58,
      58, 76, 76, 75, 74,  1,  1,  1,  1, 37, 37, 38,  3,  4,  4, 58,
      58, 76, 75, 74, 73,  1,  1,  1,  1,  1, 37, 37, 38, 38, 37, 58,
      58, 74, 74, 43,  6,  6, 24,  1,  1,  1, 38, 37, 38, 37, 37, 58,
      58, 73,  1,  1,  1,  1,  5,  1,  1,  1, 37, 37, 37, 38, 38, 58,
      58,  1,  1,  1,  1,  1,  5,  1,  1,  1, 37, 38, 38, 37, 37, 58,
      58,  1,  1,  1,  1,  1, 27,  6,  6, 25,  1, 38, 37, 37, 38, 58,
      58,  1,  1,  1,  1,  1,  5,  1,  1,  1,  1,  1, 38, 38, 38, 58,
      58,  1,  1,  1,  1,  1,  5,  1,  1,  1,  1,  1,  1, 37, 37, 58,
      58,  1,  1, 76,  1,  1,  5,  1,  1,  1,  1,  1,  1,  1,  1, 58,
      58,  1,  1,  1,  1,  1, 41,  6,  6,  6,  6, 25,  1,  1,  1, 58,
      58,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 58,
      58, 22, 22,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 58,
      58, 22, 21,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 58,
      58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58
    ],
    [
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0, 35,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0, 62,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0, 15,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0, 33,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0, 54,  0,117,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0, 62,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0, 62,  0, 64, 52,  0,  0,119,  0,114,115,  0,  0,  0,  0,
       0,  0,  0, 63,  0,  0,  0,  0,  0,  0,  0,  0,101, 83,  0,  0,
       0,  0,  0,  0,  0, 81, 51,  0,  0,  0,  0,116,101,101,  0,  0,
       0,  0,  0,  0,  0, 99, 81,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
    ],
    [
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0, 53,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
    ],
    [
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0, 72,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
       0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
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

  // canvas for each layer
  this.layerCanvas = map.layers.map(() => {
    let c = document.createElement('canvas')

    c.width = this.width
    c.height = this.height

    return c
  })

  // initial render
  this._drawMap()
}


Engine.update = function (delta) {
  this.hasScrolled = false

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

  if (dirX !== 0 || dirY !== 0) {
    this.camera.move(delta, dirX, dirY)
    this.hasScrolled = true
  }
}


Engine.render = function () {
  // re-draw map if scrolled
  if (this.hasScrolled) {
    this._drawMap()
  }

  // draw all layers to game context
  map.layers.forEach((layer, index) => {
    this.ctx.drawImage(this.layerCanvas[index], 0, 0)
  })

  // extra layers
  //this._drawGrid()
  this._drawDebug()
}

Engine._drawMap = function () {
  map.layers.forEach((layer, index) => {
    this._drawLayer(index)
  })
}

Engine._drawLayer = function (layer) {
  let context = this.getLayerContext(layer)
  let view = this.camera.view
  let x = 0, y = 0, r = 0, srcX = 0, srcY = 0

  // clear layer context
  context.clearRect(0, 0, this.width, this.height)

  // add a margin (TODO: better way?)
  view.endRow += this.mapMargin
  view.endCol += this.mapMargin

  for (let c = view.startCol; c <= view.endCol; c++) {
    for (r = view.startRow; r <= view.endRow; r++) {
      let tile = map.getTile(layer, c, r)
      x = (c - view.startCol) * map.tileSize + view.offsetX
      y = (r - view.startRow) * map.tileSize + view.offsetY
      srcX = ((tile - 1) % map.tileCols) * map.tileSize
      srcY = ((tile - 1) / map.tileCols | 0) * map.tileSize

      if (tile !== 0) {
        context.drawImage(
          this.tileAtlas,   // image
          srcX,             // source X
          srcY,             // source Y
          map.tileSize,     // source width
          map.tileSize,     // source height
          Math.round(x),    // target X
          Math.round(y),    // target Y
          map.tileSize,     // target width
          map.tileSize      // target height
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

  Engine.run(context, {
    width: 1280,
    height: 720,
    cameraSpeed: 512,
    mapMargin: 1
  })
}
