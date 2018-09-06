//
// Asset loader
//

const Loader = {
  images: {}
}

/**
 * Pre-load image in DOM.
 * Returns a promise that will resolve to an `Image` object.
 *
 * @param {string} key
 * @param {string} src
 * @returns {Promise<Image>}
 */
Loader.loadImage = function (key, src) {
  let img = new Image()

  let d = new Promise(function (resolve, reject) {
    img.onload = function () {
      this.images[key] = img
      resolve(img)
    }.bind(this)

    img.onerror = function (err) {
      reject('Could not load image: ' + src)
    }
  }.bind(this))

  img.src = src

  return d
}

/**
 * Get a pre-loaded `Image` object.
 *
 * @param {string} key
 * @returns {(Image|null)}
 */
Loader.getImage = function (key) {
  return (key in this.images) ? this.images[key] : null
}

//
// Keyboard handler
//

const Keyboard = {}

Keyboard.LEFT   = 37
Keyboard.RIGHT  = 38
Keyboard.UP     = 39
Keyboard.DOWN   = 40

// key codes status
Keyboard._keys = {}

Keyboard.listenForEvents = function (keyCodes) {
  window.addEventListener('keydown', this._onKeyDown.bind(this))
  window.addEventListener('keyup', this._onKeyUp.bind(this))

  keyCodes.forEach((keyCode) => {
    this._keys[keyCode] = false
  })
}

Keyboard._onKeyDown = function (event) {
  let keyCode = event.keyCode

  if (keyCode in this._keys) { // TODO: check how many times this fires
    event.preventDefault()
    this._keys[keyCode] = true
  }
}

Keyboard._onKeyUp = function () {
  let keyCode = event.keyCode

  if (keyCode in this._keys) { // TODO: check how many times this fires
    event.preventDefault()
    this._keys[keyCode] = false
  }
}

Keyboard.isDown = function (keyCode) {
  if (!keyCode in this._keys) {
    throw new Error('Keycode ' + keyCode + ' is not being listened to')
  }

  return this._keys[keyCode]
}

//
// Game object
//

const Game = {
  ctx: null,
  _previousElapsed: 0,
  tileAtlas: null,
  fps: 0,
  delta: 0
}

Game.load =   function () {}
Game.init =   function () {}
Game.update = function (delta) {}
Game.render = function () {}

Game.run = function (context) {
  this.ctx = context

  return Promise.all(this.load())
  .then(function (loaded) {
    this.init()
    window.requestAnimationFrame(this.tick)
  }.bind(this))
}

Game.tick = function (elapsed) {
  window.requestAnimationFrame(this.tick)

  // clear previous frame
  this.ctx.clearRect(0, 0, 512, 512)

  // compute delta
  let delta = (elapsed - this._previousElapsed) / 1000.0
  delta = Math.min(0.25, delta) // cap delta for a more consistent behavior
  this._previousElapsed = elapsed

  this.update(delta)
  this.render()
}.bind(Game) // WTF: why this method needs this??

//
// Start up function
//

window.onload = function () {
  let context = document.getElementById('canvas').getContext('2d')

  Game.run(context)
}
