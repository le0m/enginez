import State from './State.js'
import Viewport from './Viewport.js'
import Layer from './Layer'
import Keyboard from './Keyboard'

/**
 * This component manages everything concerning the game world.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class World {
  /* eslint-disable no-multi-spaces, one-var, key-spacing */

  /**
   * @param {Object} config - World component config
   * @param {Number[][][]} config.map - World map represented as a 3-dimensional array of tile IDs (int)
   * @param {Tileset[]} config.tilesets - {@link Tileset} component instances, up to one per layer
   * @param {Object} config.viewport - Viewport component config (see {@link Viewport#constructor})
   * @param {Object} config.keyboard - Keyboard component config (see {@link Keyboard#constructor})
   * @param {Object} config.state - State component config (see {@link State#constructor})
   * @param {Loader} config.loader - {@link Loader} component instance, to pre-render tileset images
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // components related
    this.map      = config.map
    this.tilesets = config.tilesets
    this.viewport = new Viewport(config.viewport)
    this.input    = new Keyboard(config.keyboard)
    this.state    = new State(config.state)
    this.loader   = config.loader

    // other
    this.layers   = []
    this.debug    = config.debug || false

    this._initLayers()
  }

  /**
   * Initialize map Layers.
   *
   * @private
   */
  _initLayers () {
    for (let l = 0; l < this.map.length; l++) {
      this.layers.push(new Layer({
        level: l,
        state: this.state,
        map: this.map[l],
        tileset: this.tilesets[l] || this.tilesets[0],
        debug: this.debug
      }))
    }
  }

  /**
   * Call tile updates.
   * Move viewport using input.
   *
   * @param {Number} delta - Time elapsed (int, ms)
   */
  update (delta) {
    if (this.input.isMoving()) {
      this.viewport.move(this.input.getDistance(delta))
    }
  }

  /**
   * Draw visible parts from layers to viewport.
   */
  draw () {
    for (let l = 0; l < this.layers.length; l++) {
      this.layers[l].draw() // draws only if changed
      this.viewport.draw(this.layers[l].context)
    }
  }
}
