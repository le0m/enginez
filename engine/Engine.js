'use strict'

//
// Engine object
//
// if need collision detection or camera follow: https://github.com/mozdevs/gamedev-js-tiles/blob/gh-pages/square/logic-grid.js
//

const Engine = {
  _previousElapsed: 0,
  ctx: null,
  tileAtlas: null,
  fps: 0,
  delta: 0,
  camera: null,
  width: 0,
  height: 0,
  mapMargin: 0,
  grid: false,
  _layerContext: {},
  layerCanvas: [],
  getLayerContext: function (layer) {
    if (!(layer in this._layerContext)) {
      this._layerContext = this.layerCanvas[layer].getContext('2d')
    }

    return this._layerContext
  }
}

/**
 * Start the game engine loop:
 * 1. load
 * 2. init
 * 3. tick (internal)
 * 4. update
 * 5. render
 * 6. go to (3)
 *
 * Recognised options are:
 * - `width` canvas and camera width
 * - `height` canvas and camera height
 * - `mapMargin` tiles of margin to render outside camera view
 * - `grid` whether to show a grid above the map or not
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} options
 * @returns {Promise<>}
 */
Engine.run = function (context, options) {
  this.ctx        = context
  this.width      = options.width || 512
  this.height     = options.height || 512
  this.mapMargin  = options.mapMargin || 0
  this.grid       = options.grid || false

  return Promise.all(this.load())
  .then(function (loaded) {
    this.init()
    window.requestAnimationFrame(this.tick)
  }.bind(this))
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
Engine.tick = function (elapsed) {
  window.requestAnimationFrame(this.tick)

  // clear previous frame
  this.ctx.clearRect(0, 0, this.width, this.height)

  // compute delta
  let delta = (elapsed - this._previousElapsed) / 1000.0
  delta = Math.min(0.25, delta) // cap delta for a more consistent behavior
  this._previousElapsed = elapsed

  this.update(delta)
  this.render()
}.bind(Engine) // WTF: why this method needs this??

Engine.load   = function () {}
Engine.init   = function () {}
Engine.update = function (delta) {}
Engine.render = function () {}

