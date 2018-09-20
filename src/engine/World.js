import State from './State.js'
import Viewport from './Viewport.js'

/**
 * This component manages everything concerning the game world.
 */
export default class World {
  /* eslint-disable no-multi-spaces, one-var, key-spacing */

  /**
   * @param {Object} config - World component config
   * @param {Number[][][]} config.map - World map represented as a 3-dimensional array of tile IDs (int)
   * @param {Object} config.viewport - Viewport component config (see {@link Viewport#constructor})
   * @param {Object} config.state - State component config (see {@link State#constructor})
   *
   * @param {Boolean} [config.debug=false] - Debug mode
   * @constructor
   */
  constructor (config) {
    // components related
    this.map      = config.map
    this.layers   = [] // used to store `Layer` references
    this.viewport = new Viewport(config.viewport)
    this.state    = new State(config.state)

    // other
    this.debug    = config.debug || false // debug mode

    this._initLayers()
  }

  /**
   * Initialize map Layers.
   * @private
   */
  _initLayers () {}

  /**
   * Call tile updates.
   * Move viewport using input.
   */
  update () {}

  /**
   * Draw visible parts from layers to viewport.
   */
  draw () {}
}
