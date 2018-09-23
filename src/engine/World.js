import State from './State.js'
import Viewport from './Viewport.js'
import Layer from './Layer'
import Keyboard from './Keyboard'
import Tileset from './Tileset'

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
   * @param {Object[]} config.tilesets - Tileset component config, up to one per layer (see {@link Tileset#constructor})
   * @param {Object} config.viewport - Viewport component config (see {@link Viewport#constructor})
   * @param {Object} config.keyboard - Keyboard component config (see {@link Keyboard#constructor})
   * @param {Object} config.state - State component config (see {@link State#constructor})
   * @param {Loader} config.loader - {@link Loader} component instance, to pre-render tileset images
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // components related
    this.loader   = config.loader
    this.map      = config.map
    this.tilesets = config.tilesets.map((tileset) => new Tileset({
      ...tileset,
      loader: this.loader
    }))
    this.input    = new Keyboard(config.keyboard)
    this.state    = new State({
      ...config.state,
      layers: this.map.length,
      rows: this.map[0].length,
      cols: this.map[0][0].length
    })
    this.viewport = config.viewport // save config temporary...
    this.layers   = []

    // other
    this.debug    = config.debug || false
  }

  /**
   * Pre-load all tilesets.
   *
   * @returns {Promise<String>[]}
   */
  load () {
    return this.tilesets.map((tileset) => tileset.load())
  }

  /**
   * Initialize components.
   */
  init () {
    if (this.debug) {
      console.log(`[WORLD] initializing...`)
    }

    for (let l = 0; l < this.map.length; l++) {
      this.layers.push(new Layer({
        debug: this.debug,
        level: l,
        state: this.state,
        map: this.map[l],
        tileset: this.tilesets[l] || this.tilesets[0]
      }))
    }

    // use first layer size as world size
    let [width, height] = this.layers[0].getSize(true)

    this.viewport = new Viewport({
      ...this.viewport, // ...and replace config with instance
      worldWidth: width,
      worldHeight: height
    })
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
      this.viewport.draw(this.layers[l].canvas)
    }
  }
}
