import State from './State.js'
import Viewport from './Viewport.js'
import Layer from './Layer'

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
   * @param {Object} config.viewport - Viewport component config (see {@link Viewport#constructor})
   * @param {Object} config.state - State component config (see {@link State#constructor})
   * @param {Loader} config.loader - Loader component instance, to pre-render tileset images
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // components related
    this.map      = config.map
    this.viewport = new Viewport(config.viewport)
    this.state    = new State(config.state)
    this.loader   = config.loader

    // other
    this.layers   = [] // used to store `Layer` references
    this.debug    = config.debug || false // debug mode

    this._initLayers()
  }

  /**
   * Initialize map Layers.
   *
   * @private
   */
  _initLayers () {
    let tileSet = {}, source = null

    for (let l = 0; l < this.map.length; l++) {
      tileSet = this.tileSets[l] || this.tileSets[0]
      source = this.loader.getImage(tileSet.key)

      this.layers.push(new Layer({
        level: l,
        map: this.map[l],
        tileSize: tileSet.tileSize,
        tileSet: source,
        tileSetSize: tileSet.size,
        debug: true
      }))
    }
  }

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
