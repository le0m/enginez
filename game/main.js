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
  Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN])
  this.tileAtlas = Loader.getImage(assets.key)

  this.camera = new Camera({
    cols: map.cols,
    rows: map.rows,
    width: this.width,
    height: this.height,
    speed: config.camera.speed,
    startX: config.camera.startX,
    startY: config.camera.startY
  })
}

// Update

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

  if (dirX !== 0 || dirY !== 0) {
    this.camera.move(delta, dirX, dirY)
  }
}

// Render

Engine.render = function () {
  this._drawMap()
  //this._drawGrid()
  this._drawDebug()
}

Engine._drawMap = function () {
  map.layers.forEach((layer, index) => {
    this._drawLayer(index)
  })
}

Engine._drawLayer = function (layer) {
  let view = this.camera.view
  let x = 0, y = 0, r = 0, srcX = 0, srcY = 0

  // add a margin
  view.endRow += this.mapMargin
  view.endCol += this.mapMargin
  // TODO: use `mapMargin` to draw extra rounds of tiles off-canvas

  for (let c = view.startCol; c <= view.endCol; c++) {
    for (r = view.startRow; r <= view.endRow; r++) {
      let tile = map.getTile(layer, c, r)
      x = (c - view.startCol) * assets.tileSize + view.offsetX
      y = (r - view.startRow) * assets.tileSize + view.offsetY
      srcX = ((tile - 1) % assets.tileCols) * assets.tileSize
      srcY = ((tile - 1) / assets.tileCols | 0) * assets.tileSize

      if (tile !== 0) {
        this.ctx.drawImage(
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
