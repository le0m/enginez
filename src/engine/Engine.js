import { ConsoleExtra } from '../utils.js'

const console = ConsoleExtra(window.console)

/**
 * Engine core class, manages all components.
 *
 * To avoid movement and refresh rate problems, the `update()`
 * function is called in fixed steps of time instead that once
 * per frame, which also improves simulation consistency.
 * Time for the `update()` function is accumulated each tick
 * and used once it reaches a threshold. Accumulated time is
 * clamped to a max value, to prevent the "spiral of death".
 * See {@link Engine#constructor} to change these parameters.
 *
 * You need to extend this class and override loop methods.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Engine {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - Engine component configuration
   * @param {Number} [config.updateTimeStep=10] - Single step `update()` time (int, ms)
   * @param {Number} [config.updateTimeMax=50] - Max accumulated `update()` time (int, ms)
   * @param {BaseWorld} config.world - {@link BaseWorld} implementation instance
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // time related
    this._delta             = 0
    this._previousTimestamp = 0
    this._updateTime        = 0
    this._updateTimeStep    = config.updateTimeStep || 10
    this._updateTimeMax     = config.updateTimeMax || 50

    // components related
    this.world              = config.world

    // other
    this.fps                = 0
    this.debug              = config.debug || false
  }

  /**
   * Start the game engine loop:
   * 1. load
   * 2. init
   * 3. start loop
   *
   * @returns {Promise}
   */
  run () {
    return Promise.all(this.load())
      .then((results) => {
        this.init(results)
        window.requestAnimationFrame(this.tick.bind(this))
      })
  }

  /**
   * Executes a tick of the game:
   * 1. clear frame
   * 2. compute delta
   * 3. update by fixed steps
   * 4. render
   *
   * @param {Number} timestamp
   */
  tick (timestamp) {
    // compute delta
    timestamp = timestamp | 0
    this._delta = timestamp - this._previousTimestamp
    this._previousTimestamp = timestamp
    this._updateTime += this._delta

    // avoid spiral of death
    if (this._updateTime > this._updateTimeMax) {
      if (this.debug) {
        console.throttle(1000).warn(`[ENGINE] update time above threshold ${this._updateTime}, clamping to ${this._updateTimeMax}`)
      }

      this._updateTime = this._updateTimeMax
    }

    // stats
    this.fps = 1000 / this._delta | 0

    // update by fixed steps
    while (this._updateTime >= this._updateTimeStep) {
      this.update(this._updateTimeStep, timestamp)
      this._updateTime -= this._updateTimeStep
      timestamp += this._updateTimeStep
    }

    this.render()
    window.requestAnimationFrame(this.tick.bind(this))
  }

  /**
   * Pre-load resources.
   *
   * @returns {Promise<String>[]} - Cache keys of the loaded images, passed down to {@link Engine#init}
   */
  load () {
    return this.world.load()
  }

  /**
   * Initialize Engine and components.
   *
   * @param {Object} params - Results returned from {@link Engine#load}
   */
  init (params) {
    this.world.init()
  }

  /**
   * Update game status.
   *
   * @param {Number} delta - Time since last update (int, ms)
   * @param {Number} timestamp - Time since start (int, ms)
   */
  update (delta, timestamp) {
    this.world.update(delta, timestamp)
  }

  /**
   * Render current world position.
   */
  render () {
    this.world.draw()

    if (this.debug > 2) {
      this._drawCellNumbers()
    }
    if (this.debug > 1) {
      this._drawGrid()
    }
    if (this.debug) {
      this._drawDebug()
    }
  }

  /**
   * Draw a grid on top of the game map.
   * This is a debug function.
   *
   * @private
   */
  _drawGrid () {
    const context = this.world.viewport.context
    const tileSize = this.world.tilesets[0].tileSize
    let x = 0, y = 0, r = 0
    const [startCol, endCol, startRow, endRow] = this.world.viewport.getRect(tileSize)
    context.strokeStyle = 'black'
    const tileOffsetX = startCol * tileSize - this.world.viewport.offsetX
    const tileOffsetY = startRow * tileSize - this.world.viewport.offsetY

    for (let c = startCol; c <= endCol; c++) {
      for (r = startRow; r <= endRow; r++) {
        x = (c - startCol) * tileSize + tileOffsetX
        y = (r - startRow) * tileSize + tileOffsetY

        context.strokeRect(
          x | 0,    // target X
          y | 0,    // target Y
          tileSize, // target width
          tileSize  // target height
        )
      }
    }
  }

  /**
   * Draw cell rows and columns on top of game map.
   * This is a debug function.
   *
   * @private
   */
  _drawCellNumbers () {
    const context = this.world.viewport.context
    const tileSize = this.world.tilesets[0].tileSize
    const mapCols = this.world.layers[0].getSize()[0]
    const [startCol, endCol, startRow, endRow] = this.world.viewport.getRect(tileSize)
    const tileOffsetX = startCol * tileSize - this.world.viewport.offsetX
    const tileOffsetY = startRow * tileSize - this.world.viewport.offsetY
    let x = 0, y = 0, c = 0, num = 0
    context.fillStyle = 'black'
    context.font = '16px sans-serif'

    for (let r = startRow; r <= endRow; r++) {
      for (c = startCol; c <= endCol; c++) {
        x = (c - startCol) * tileSize + tileOffsetX + tileSize / 8 // it's a long text
        y = (r - startRow) * tileSize + tileOffsetY + tileSize / 2
        num = (r * mapCols) + (c + 1)

        context.fillText(
          `[ ${num} (${c + ' | ' + r}) ]`,
          x | 0,
          y | 0,
          tileSize * 3 / 4 // max width, font auto-scale
        )
      }
    }
  }

  /**
   * Draw rendering info.
   * This is a debug function.
   *
   * @private
   */
  _drawDebug () {
    const context = this.world.viewport.context

    context.fillStyle = 'black'
    context.fillRect(
      10, // x
      10, // y
      80, // width
      40  // height
    )
    context.fillStyle = 'white'

    // FPS
    context.fillText(
      `FPS: ${this.fps}`,
      15, // x
      25  // y
    )

    // delta
    context.fillText(
      `??: ${this._delta}ms`,
      15,  // x
      45   // y
    )
  }
}
