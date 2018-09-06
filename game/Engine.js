//
// Engine object
//
// check if need collision detection or camera follow: https://github.com/mozdevs/gamedev-js-tiles/blob/gh-pages/square/logic-grid.js
//

const Engine = {
  ctx: null,
  previousElapsed: 0,
  tileAtlas: null,
  fps: 0,
  delta: 0,
  camera: null,
  cameraSpeed: 0,
  width: 0,
  height: 0
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
 * - width, canvas and camera width
 * - height, canvas and camera height
 * - cameraSpeed, camera scrolling speed
 * - mapMargin, tiles of margin to render off-canvas
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} options
 * @returns {Promise<>}
 */
Engine.run = function (context, options) {
  this.ctx          = context
  this.width        = options.width
  this.height       = options.height
  this.cameraSpeed  = options.cameraSpeed
  this.mapMargin    = options.mapMargin || 0

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
  let delta = (elapsed - this.previousElapsed) / 1000.0
  delta = Math.min(0.25, delta) // cap delta for a more consistent behavior
  this.previousElapsed = elapsed

  this.update(delta)
  this.render()
}.bind(Engine) // WTF: why this method needs this??

Engine.load   = function () {}
Engine.init   = function () {}
Engine.update = function (delta) {}
Engine.render = function () {}

