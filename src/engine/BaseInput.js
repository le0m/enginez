/**
 * This is a base class for input devices.
 */
export default class BaseInput {
  /**
   * @param {Object} config - BaseInput component config
   * @param {Number} config.speed - Movement speed (float, px per time step)
   *
   * @param {Boolean} [config.debug=false] - Debug mode
   * @constructor
   */
  constructor (config) {
    this.speed = config.speed

    // other
    this.debug = config.debug || 0

    this._initListeners()
  }

  /**
   * Initialize event listeners.
   * @private
   */
  _initListeners () {}

  /**
   * Get current movement direction.
   *
   * Override this method to return current
   * movement direction with different input
   * devices:
   *
   * +-------------------+
   * |  X = -1  |  left  |
   * |  X = +1  |  right |
   * |----------+--------|
   * |  Y = -1  |  up    |
   * |  Y = +1  |  down  |
   * +-------------------+
   *
   * @returns {Number[]} - Direction on both axes (int)
   */
  getDirection () {}

  /**
   * Get distance traveled.
   *
   * @param {Number} delta - Time elapsed (int, ms)
   *
   * @return {Number[]} - Distance traveled on both axes (int, px)
   */
  getDistance (delta) {
    let [x, y] = this.getDirection()

    return [
      x * delta * this.speed,
      y * delta * this.speed
    ]
  }
}
