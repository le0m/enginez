import Observable from './Observable'

/**
 * This is a base class for tiles.
 *
 * @interface
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseTile extends Observable {
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
   * Click the tile, triggering its behavior.
   *
   * Override this method to show UI menu and
   * handle click.
   *
   * @param {Object} [params={}] - Event parameters
   * @returns {*|false} - `false` to stop the click event from propagating to other layers
   */
  click (params = {}) {}
}
