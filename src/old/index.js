import '../css/main.css'

import Camera from './Camera'
import Engine from './Engine.js'
import Keyboard from './Keyboard.js'
import Loader from './Loader.js'
import Queue from './Queue.js'
import State from './State.js'
import Touch from './Touch.js'
import UI from './UI.js'
import { config, getTile, getTileObject } from './config.js'

/* eslint-disable no-multi-spaces, one-var */
class GameEngine extends Engine {
  constructor (context, options, debug) {
    super(context, options, debug)

    this.loader = new Loader()
    this.state = new State(config.map.cols, config.map.rows)
    this.queue = new Queue(getTileObject, this.state)
    this.keyboard = new Keyboard()
    this.touch = new Touch(config.assets.tileSize)
    this.tileAtlas = null
    this.tileAtlasCanvas = null
    this.camera = new Camera({
      cols: config.map.cols,
      rows: config.map.rows,
      width: this.width,
      height: this.height,
      tileSize: config.assets.tileSize,
      speed: config.camera.speed,
      startX: config.camera.startX,
      startY: config.camera.startY
    })
    this.ui = new UI(config.assets.tileSize, this.camera.view, this.queue)
  }

  load () {
    return [
      this.loader.loadImage(config.assets.key, config.assets.src)
    ]
  }

  init () {
    this.state.init()

    this.keyboard.listenForEvents([Keyboard.LEFT, Keyboard.UP, Keyboard.RIGHT, Keyboard.DOWN])
    this.touch.listenForEvents()

    this.tileAtlas = this.loader.getImage(config.assets.key)
    this.tileAtlasCanvas = document.createElement('canvas')
    this.tileAtlasCanvas.width = config.assets.tileSize * config.assets.tileCols
    this.tileAtlasCanvas.height = config.assets.tileSize * config.assets.tileRows
    this.getTileAtlasCanvasContext().drawImage(this.tileAtlas, 0, 0)

    this.ui.init()
  }

  update (delta) {
    // events
    this.queue.dispatch()

    // movement
    let dir = this.keyboard.getDirection() || { x: 0, y: 0 }

    if (this.touch.isMoving) {
      dir = this.touch.getDirection()
    }

    if (dir.x !== 0 || dir.y !== 0 || config.debug) {
      this.camera.move(delta, dir.x, dir.y)
    }
  }

  render () {
    this._drawMap()

    if (config.grid)        { this._drawGrid() }
    if (config.cellNumbers) { this._drawCellNumbers() }
    if (config.debug)       { this._drawDebug() }
  }

  _drawMap () {
    return config.map.layers.map((layer, index) => {
      this._drawLayer(index)
    })
  }

  _drawLayer (layer) {
    let view = this.camera.view
    let x = 0, y = 0, r = 0, srcX = 0, srcY = 0
    let tileSize = config.assets.tileSize
    let tileCols = config.assets.tileCols

    // TODO: "better" margin when changing the rendering engine
    for (let c = view.startCol; c <= view.endCol + this.mapMargin; c++) {
      for (r = view.startRow; r <= view.endRow + this.mapMargin; r++) {
        let tile = getTile(layer, c, r)

        if (tile !== 0) {
          x = (c - view.startCol) * tileSize + view.offsetX
          y = (r - view.startRow) * tileSize + view.offsetY
          srcX = ((tile - 1) % tileCols) * tileSize
          srcY = ((tile - 1) / tileCols | 0) * tileSize

          this.ctx.drawImage(
            this.tileAtlasCanvas, // image
            srcX,                 // source X
            srcY,                 // source Y
            tileSize,             // source width
            tileSize,             // source height
            x | 0,                // target X
            y | 0,                // target Y
            tileSize,             // target width
            tileSize              // target height
          )
        }
      }
    }
  }

  _drawGrid () {
    let view = this.camera.view
    let x = 0, y = 0, r = 0
    this.ctx.strokeStyle = 'black'
    let tileSize = config.assets.tileSize

    // TODO: "better" margin when changing the rendering engine
    for (let c = view.startCol; c <= view.endCol + this.mapMargin; c++) {
      for (r = view.startRow; r <= view.endRow + this.mapMargin; r++) {
        x = (c - view.startCol) * tileSize + view.offsetX
        y = (r - view.startRow) * tileSize + view.offsetY

        this.ctx.strokeRect(
          x | 0,    // target X
          y | 0,    // target Y
          tileSize, // target width
          tileSize  // target height
        )
      }
    }
  }

  _drawCellNumbers () {
    let view = this.camera.view
    let num = 0
    let x = 0, y = 0, c = 0
    this.ctx.fillStyle = 'black'
    this.ctx.font = '16px sans-serif'
    let tileSize = config.assets.tileSize

    // TODO: "better" margin when changing the rendering engine
    for (let r = view.startRow; r <= view.endRow + this.mapMargin; r++) {
      for (c = view.startCol; c <= view.endCol + this.mapMargin; c++) {
        x = (c - view.startCol) * tileSize + view.offsetX + tileSize / 8 // it's a long text
        y = (r - view.startRow) * tileSize + view.offsetY + tileSize / 2
        num = (r * config.map.cols) + (c + 1)

        this.ctx.fillText(
          `[ ${num} (${c + ' | ' + r}) ]`,
          x | 0,
          y | 0,
          tileSize * 3 / 4 // max width, font auto-scale
        )
      }
    }
  }

  _drawDebug () {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(
      10, // x
      10, // y
      80, // width
      40  // height
    )
    this.ctx.fillStyle = 'white'

    // FPS
    this.ctx.fillText(
      `FPS: ${this.fps}`,
      15, // x
      25  // y
    )

    // delta
    this.ctx.fillText(
      `Δ: ${this._delta}ms`,
      15,  // x
      45   // y
    )
  }
}

let context = document.getElementById('canvas').getContext('2d')
const game = new GameEngine(context, config, true) // debug: true
game.run()
