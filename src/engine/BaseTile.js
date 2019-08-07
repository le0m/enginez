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
   * @param {String} config.name - Tile name
   * @param {String} config.component - UI component name
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super()

    this.id        = config.id
    this.name      = config.name
    this.component = config.component

    // other
    this.debug     = config.debug || false
  }

  /**
   * Open the tile UI menu.
   *
   * @param {Object} state - Current tile state
   * @param {BaseElement} component - Custom web component DOM element
   * @returns {Boolean} - Success of opening
   */
  open (state, component) {}

  /**
   * Close the tile UI menu.
   *
   * @param {BaseElement} component - Custom web component DOM element
   * @returns {Object|Boolean} - Current Tile state, or `false` on failure
   */
  close (component) {}

  /**
   * Check if tile UI menu is currently open.
   *
   * @returns {Boolean}
   */
  isOpen () {}
}
