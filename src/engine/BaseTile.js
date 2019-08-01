import EventEmitter from './EventEmitter'

/**
 * This is a base class for tiles.
 *
 * @interface
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseTile extends EventEmitter {
  /* eslint-disable no-multi-spaces */

  /**
   * @param {Object} config - BaseTile component config
   * @param {Number} config.id - Tile ID (int)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super()

    this.id = config.id

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

  /**
   * Click the tile.
   *
   * @param {Object} [params={}] - Optional parameters
   * @returns {*|false} - `false` to stop the click event from propagating to other layers
   */
  click (params = {}) {}

  /**
   * Open the tile UI menu.
   *
   * @param {Object} state - Current tile state
   * @returns {this} - For chaining (?)
   */
  open (state) {}

  /**
   * Close the tile UI menu.
   *
   * @returns {Object} - Updated tile state
   */
  close () {}

  /**
   * Check if tile UI menu is currently open.
   *
   * @returns {Boolean}
   */
  isOpen () {}
}
