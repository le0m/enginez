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

Engine.run = function (context, options) {
  this.ctx          = context
  this.width        = options.width
  this.height       = options.height
  this.cameraSpeed  = options.cameraSpeed

  return Promise.all(this.load())
  .then(function (loaded) {
    this.init()
    window.requestAnimationFrame(this.tick)
  }.bind(this))
}

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

