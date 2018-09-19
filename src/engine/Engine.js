/**
 * Engine core class.
 * Keeps the whole thing glued together, so give it a thanks.
 *
 * if need collision detection or camera follow: https://github.com/mozdevs/gamedev-js-tiles/blob/gh-pages/square/logic-grid.js
 */
export default class Engine {
  /**
   *
   * Recognised options:
   * - `width` canvas and camera width
   * - `height` canvas and camera height
   * - `mapMargin` tiles of margin to render outside camera view
   * - `grid` whether to show a grid above the map or not
   *
   * @param {CanvasRenderingContext2D} context
   * @param {Object} options
   * @param {boolean} debug additional messages to console
   */
  constructor (context, options, debug) {
    /* eslint-disable no-multi-spaces */
    this._previousTimestamp         = 0
    this._tileAtlasCanvasContext  = null
    this._layerContext            = {}

    this.ctx                      = context
    this.width                    = options.width || 512
    this.height                   = options.height || 512
    this.mapMargin                = options.mapMargin || 0
    this.state                    = options.state || {}
    this.offCanvas                = options.offCanvas || false
    this.tileAtlas                = null
    this.tileAtlasCanvas          = null
    this.fps                      = 0
    this._delta                   = 0
    this._updateStep              = 10 // ms
    this._updateAccumulator       = 0 // accumulated ms
    this._updateClamp             = 50 // max update accumulation (avoid spiral of death)
    this.camera                   = null
    this.layerCanvas              = []
    this.debug                    = debug || false
  }

  getLayerContext (layer) {
    if (!(layer in this._layerContext)) {
      this._layerContext = this.layerCanvas[layer].getContext('2d')
    }

    return this._layerContext
  }

  getTileAtlasCanvasContext () {
    if (this._tileAtlasCanvasContext === null) {
      this._tileAtlasCanvasContext = this.tileAtlasCanvas.getContext('2d')
    }

    return this._tileAtlasCanvasContext
  }

  /**
   * Start the game engine loop:
   * 1. load
   * 2. init
   * 3. start loop
   *
   * @returns {Promise<>}
   */
  run () {
    return Promise.all(this.load())
      .then(() => {
        this.init()
        window.requestAnimationFrame(this.tick.bind(this))
      })
  }

  /**
   * Executes a tick of the game:
   * 1. clear frame
   * 2. calculate delta
   * 3. update
   * 4. render
   *
   * @param {number} timestamp
   */
  tick (timestamp) {
    window.requestAnimationFrame(this.tick.bind(this))

    // clear previous frame
    this.ctx.clearRect(0, 0, this.width, this.height)

    // compute delta
    timestamp = timestamp | 0
    this._delta = timestamp - this._previousTimestamp // delta is in fraction of seconds
    this._previousTimestamp = timestamp
    this._updateAccumulator += this._delta

    // avoid spiral of death
    if (this._updateAccumulator > this._updateClamp) {
      if (this.debug) {
        console.warn(`Update time accumulator above threshold: ${this._updateAccumulator} (clamping to ${this._updateClamp})`)
      }

      this._updateAccumulator = this._updateClamp
    }

    // stats
    this.fps = 1000 / this._delta | 0

    // update with fixed timestep
    while (this._updateAccumulator >= this._updateStep) {
      this.update(this._updateStep)
      this._updateAccumulator -= this._updateStep
    }

    this.render()
  }

  load ()         { throw Error('Method not implemented: load()') }
  init ()         { throw Error('Method not implemented: init()') }
  update (delta)  { throw Error('Method not implemented: update()') }
  render ()       { throw Error('Method not implemented: render()') }
}
