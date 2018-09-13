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
   */
  constructor (context, options) {
    /* eslint-disable no-multi-spaces */
    this._previousElapsed   = 0
    this._tileCanvasContext = null
    this._layerContext      = {}

    this.ctx                = context
    this.width              = options.width || 512
    this.height             = options.height || 512
    this.mapMargin          = options.mapMargin || 0
    this.state              = options.state || {}
    this.offCanvas          = options.offCanvas || false
    this.tileAtlas          = null
    this.tileAtlasCanvas    = null
    this.fps                = 0
    this.delta              = 0
    this.camera             = null
    this.layerCanvas        = []
  }

  getLayerContext (layer) {
    if (!(layer in this._layerContext)) {
      this._layerContext = this.layerCanvas[layer].getContext('2d')
    }

    return this._layerContext
  }

  getTileCanvasContext () {
    if (this._tileCanvasContext === null) {
      this._tileCanvasContext = this.tileCanvas.getContext('2d')
    }

    return this._tileCanvasContext
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
        window.requestAnimationFrame(this.tick)
      })
  }

  /**
   * Executes a tick of the game:
   * 1. clear frame
   * 2. calculate delta
   * 3. update
   * 4. render
   *
   * @param {number} elapsed
   */
  tick (elapsed) {
    window.requestAnimationFrame(this.tick)

    // clear previous frame
    this.ctx.clearRect(0, 0, this.width, this.height)

    // round to 3 decimals (fast)
    elapsed = (elapsed * 1000 | 0) / 1000

    // compute delta
    let delta = (elapsed - this._previousElapsed) / 1000
    delta = Math.min(0.250, delta) // cap delta for a more consistent behavior
    this._previousElapsed = elapsed

    this.update(delta)
    this.render()
  }

  load ()         { throw Error('Method not implemented: load()') }
  init ()         { throw Error('Method not implemented: init()') }
  update (delta)  { throw Error('Method not implemented: update()') }
  render ()       { throw Error('Method not implemented: render()') }
}
