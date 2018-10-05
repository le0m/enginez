/**
 * This is a base class for input devices.
 *
 * @interface
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseInput {
  /**
   * @param {Object} config - BaseInput component config
   * @param {Number} config.speed - Movement speed (float, px per time step)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.speed = config.speed

    // other
    this.debug = config.debug || 0
  }

  /**
   * Get current movement direction.
   *
   * Override this method to return current
   * movement direction with different input
   * devices:
   *
   * ```
   * +-------------------+
   * |  X = -1  |  left  |
   * |  X = +1  |  right |
   * |----------+--------|
   * |  Y = -1  |  up    |
   * |  Y = +1  |  down  |
   * +-------------------+
   * ```
   *
   * @returns {Number[]} - Direction on both axes (int)
   */
  getDirection () {}

  /**
   * Check if the user is moving.
   *
   * @returns {boolean}
   */
  isMoving () {
    let [x, y] = this.getDirection()

    return x !== 0 || y !== 0
  }

  /**
   * Get distance traveled.
   *
   * @param {Number} delta - Time elapsed (int, ms)
   * @returns {Number[]} - Distance traveled on both axes (int, px)
   */
  getDistance (delta) {
    let [x, y] = this.getDirection()

    return [
      x * delta * this.speed | 0,
      y * delta * this.speed | 0
    ]
  }
}
