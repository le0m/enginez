'use strict'

//
// Engine setup
//

// Load

Engine.load = function () {
  return [
    Loader.loadImage(assets.key, assets.src)
  ]
}

// Init

Engine.init = function () {
  this.tileAtlas = Loader.getImage(assets.key)
  Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN])
  Touch.listenForEvents(assets.tileSize) // MOBILE: tileSize / 4

  this.camera = new Camera({
    cols: map.cols,
    rows: map.rows,
    width: this.width,
    height: this.height,
    speed: config.camera.speed,
    startX: config.camera.startX,
    startY: config.camera.startY
  })

  // create a canvas for each layer
  this.layerCanvas = map.layers.map(() => {
    let c = document.createElement('canvas')
    c.width = this.width
    c.height = this.height

    return c
  })

  // initial draw
  //this.render()
}

// Update

Engine.update = function (delta) {
  // stats
  this.delta = delta * 1000 | 0
  this.fps = 1 / delta | 0

  // movement
  let dir = Keyboard.getDirection() || { x: 0, y: 0 }

  if (Touch.isMoving) {
    dir = Touch.getDirection()
  }

  if (dir.x !== 0 || dir.y !== 0 || config.debug) {
    this.camera.move(delta, dir.x, dir.y)
  }
}

// Render

Engine.render = function () {
  Promise.all(this._drawMap()).then((layers) => {
    if (this.offCanvas) {
      // draw layers to main canvas
      layers.map((layer) => {
        this.ctx.drawImage(this.layerCanvas[layer], 0, 0)
      })
    }

    if (this.grid) { this._drawGrid() }
    if (this.debug) { this._drawDebug() }
  })
}

Engine._drawMap = function () {
  return map.layers.map((layer, index) => {
    return new Promise((resolve) => {
      this._drawLayer(index)
      resolve(index)
    })
  })
}

Engine._drawLayer = function (layer) {
  let context = this.offCanvas ? this.getLayerContext(layer) : this.ctx
  let view = this.camera.view
  let x = 0, y = 0, r = 0, srcX = 0, srcY = 0

  if (this.offCanvas) {
    context.clearRect(0, 0, this.width, this.height)
  }

  // add a margin
  view.endCol += this.mapMargin
  view.endRow += this.mapMargin
  // TODO: use `mapMargin` to draw extra rounds of tiles off-canvas

  for (let c = view.startCol; c <= view.endCol; c++) {
    for (r = view.startRow; r <= view.endRow; r++) {
      let tile = map.getTile(layer, c, r)

      if (tile !== 0) {
        x = (c - view.startCol) * assets.tileSize + view.offsetX
        y = (r - view.startRow) * assets.tileSize + view.offsetY
        srcX = ((tile - 1) % assets.tileCols) * assets.tileSize
        srcY = ((tile - 1) / assets.tileCols | 0) * assets.tileSize

        context.drawImage(
          this.tileAtlas,   // image
          srcX,             // source X
          srcY,             // source Y
          assets.tileSize,  // source width
          assets.tileSize,  // source height
          Math.round(x),    // target X
          Math.round(y),    // target Y
          assets.tileSize,  // target width
          assets.tileSize   // target height
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
      x = (c - view.startCol) * assets.tileSize + view.offsetX
      y = (r - view.startRow) * assets.tileSize + view.offsetY

      this.ctx.strokeRect(
        Math.round(x),    // target X
        Math.round(y),    // target Y
        assets.tileSize,  // target width
        assets.tileSize   // target height
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

  Engine.run(context, config)
}
