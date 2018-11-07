import Loader from './Loader'

/**
 * This component manages everything concerning the game world.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseWorld {
  /* eslint-disable no-multi-spaces, one-var, key-spacing */

  /**
   * @param {Object} config - BaseWorld component config
   * @param {HTMLElement} config.container - Top hierarchy container element
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.container  = config.container

    // other
    this.debug      = config.debug || false
    this.loader = new Loader({ debug: this.debug })
  }

  /**
   * Pre-load tiles in promises.
   *
   * @returns {Promise<String>[]}
   */
  load () {}

  /**
   * Initialize components.
   */
  init () {}

  /**
   * Update the world state.
   *
   * @param {Number} delta - Time since last update (int, ms)
   * @param {Number} timestamp - Time since start (int, ms)
   */
  update (delta, timestamp) {}

  /**
   * Draw visible parts to viewport.
   */
  draw () {}

  /**
   * Resize the HTML container.
   * Trigger resizing of `Viewport`.
   *
   * @param {Number} width - New width (int, px)
   * @param {Number} height - New height (int, px)
   */
  resize (width, height) {}
}
