import Observable from './Observable'

/**
 * This is a base class for tiles.
 *
 * @interface
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseTile extends Observable {
  /* eslint-disable no-multi-spaces */

  /**
   * @param {Object} config - BaseInput component config
   * @param {Number} config.id - Tile ID (int)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super()

    this.id     = config.id

    // other
    this.debug  = config.debug || false
  }

  /**
   * Calculate new tile state.
   *
   * Override this method to handle tile
   * status updates.
   *
   * @param {Number} delta - Time since last update (int, ms)
   * @param {Object} prevState - Previous tile state
   * @returns {Object} - New tile state
   */
  update (delta, prevState) {}
}
