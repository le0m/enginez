/**
 * Handles movement with a keyboard.
 */
export default class Keyboard {
  /* eslint-disable no-multi-spaces */
  static get LEFT ()  { return 37 }
  static get UP ()    { return 38 }
  static get RIGHT () { return 39 }
  static get DOWN ()  { return 40 }

  /**
   * `_keys` is used internally to keep track of current
   * key press statuses.
   */
  constructor () {
    this._keys = {}
  }

  /**
   * Attach event listeners for desired key codes.
   *
   * @param {Array<number>} keyCodes
   */
  listenForEvents (keyCodes) {
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
  _onKeyDown (event) {
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
  _onKeyUp (event) {
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
  isDown (keyCode) {
    if (!(keyCode in this._keys)) {
      throw new Error('Keycode ' + keyCode + ' is not being listened to')
    }

    return this._keys[keyCode]
  }

  /**
   * Get a vector of movement.
   *
   * - `x === -1`, left
   * - `x === +1`, right
   * - `x === -1`, up
   * - `x === +1`, down
   *
   * @return {{x: number, y: number}}
   */
  getDirection () {
    let dir = { x: 0, y: 0 }

    if (this.isDown(Keyboard.LEFT))   { dir.x = -1 }
    if (this.isDown(Keyboard.RIGHT))  { dir.x = 1 }
    if (this.isDown(Keyboard.UP))     { dir.y = -1 }
    if (this.isDown(Keyboard.DOWN))   { dir.y = 1 }

    return dir
  }
}
