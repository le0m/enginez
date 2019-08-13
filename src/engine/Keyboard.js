import BaseInput from './BaseInput.js'

/**
 * This component implements {@link BaseInput} for keyboard devices.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Keyboard extends BaseInput {
  /* eslint-disable no-multi-spaces, one-var */

  /** @static */
  static get LEFT ()  { return 37 }

  /** @static */
  static get UP ()    { return 38 }

  /** @static */
  static get RIGHT () { return 39 }

  /** @static */
  static get DOWN ()  { return 40 }

  /**
   * @param {Object} config - Keyboard component config
   */
  constructor (config) {
    super(config)

    const listeners = [
      Keyboard.LEFT,
      Keyboard.RIGHT,
      Keyboard.UP,
      Keyboard.DOWN
    ]
    this._keys = {}
    this._initListeners(listeners)

    if (this.debug) {
      console.log(`[KEYBOARD] listeners attached (${listeners.join(' ')}, keydown and keyup)`)
    }
  }

  /**
   * Initialize event listeners.
   *
   * @param {Number[]} keyCodes - Array of key codes to keep track of
   * @private
   */
  _initListeners (keyCodes) {
    window.addEventListener('keydown', this._onKeyDown.bind(this))
    window.addEventListener('keyup', this._onKeyUp.bind(this))

    keyCodes.forEach((keyCode) => { this._keys[keyCode] = false })
  }

  /**
   * Press a key.
   *
   * @param {KeyboardEvent} event
   * @listens Document#keydown
   * @private
   */
  _onKeyDown (event) {
    const keyCode = event.keyCode

    if (keyCode in this._keys) {
      event.preventDefault()
      this._keys[keyCode] = true
    }
  }

  /**
   * Release a key.
   *
   * @param {KeyboardEvent} event
   * @listens Document#keyup
   * @private
   */
  _onKeyUp (event) {
    const keyCode = event.keyCode

    if (keyCode in this._keys) {
      event.preventDefault()
      this._keys[keyCode] = false
    }
  }

  /**
   * Check if a specific key is currently pressed.
   *
   * @param {Number} keyCode - Key code to check for
   * @returns {Boolean}
   * @private
   */
  _isDown (keyCode) {
    if (keyCode in this._keys) {
      return this._keys[keyCode]
    }

    if (this.debug) {
      console.warn(`[KEYBOARD] requested status of keycode ${keyCode}, which we're not listening to`)
    }

    return false
  }

  /**
   * @inheritDoc
   */
  getDirection () {
    let x = 0, y = 0

    if (this._isDown(Keyboard.LEFT))  { x = -1 }
    if (this._isDown(Keyboard.RIGHT)) { x = 1 }
    if (this._isDown(Keyboard.UP))    { y = -1 }
    if (this._isDown(Keyboard.DOWN))  { y = 1 }

    return [x, y]
  }
}
