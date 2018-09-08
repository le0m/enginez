'use strict'

//
// Keyboard handler
//

const Keyboard = {}

Keyboard.LEFT   = 37
Keyboard.UP     = 38
Keyboard.RIGHT  = 39
Keyboard.DOWN   = 40

/**
 * Keep track of current key press status.
 *
 * @type {boolean}
 * @private
 */
Keyboard._keys = {}

/**
 * Attach event listeners for desired key codes.
 *
 * @param {Array<number>} keyCodes
 */
Keyboard.listenForEvents = function (keyCodes) {
  window.addEventListener('keydown', this._onKeyDown.bind(this))
  window.addEventListener('keyup', this._onKeyUp.bind(this))

  keyCodes.forEach((keyCode) => { this._keys[keyCode] = false })
}

/**
 * Handle keydown event.
 *
 * @param {KeyboardEvent} event
 * @private
 */
Keyboard._onKeyDown = function (event) {
  let keyCode = event.keyCode

  if (keyCode in this._keys) {
    event.preventDefault()
    this._keys[keyCode] = true
  }
}

/**
 * Handle keyup event.
 *
 * @param {KeyboardEvent} event
 * @private
 */
Keyboard._onKeyUp = function (event) {
  let keyCode = event.keyCode

  if (keyCode in this._keys) {
    event.preventDefault()
    this._keys[keyCode] = false
  }
}

/**
 * Check whether a specific key is currently pressed.
 *
 * @param {number} keyCode
 * @returns {boolean}
 */
Keyboard.isDown = function (keyCode) {
  if (!keyCode in this._keys) {
    throw new Error('Keycode ' + keyCode + ' is not being listened to')
  }

  return this._keys[keyCode]
}

Keyboard.getDirection = function () {
  let dir = { x: 0, y: 0 }

  if (Keyboard.isDown(Keyboard.LEFT))   { dir.x = -1 }
  if (Keyboard.isDown(Keyboard.RIGHT))  { dir.x = 1 }
  if (Keyboard.isDown(Keyboard.UP))     { dir.y = -1 }
  if (Keyboard.isDown(Keyboard.DOWN))   { dir.y = 1 }

  return dir
}
