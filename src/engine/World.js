import State from './State.js'
import Viewport from './Viewport.js'
import Layer from './Layer.js'
import Keyboard from './Keyboard.js'
import Tileset from './Tileset.js'
import UI from './UI.js'
import EventQueue from './EventQueue.js'
import { ConsoleExtra } from '../utils.js'

const console = ConsoleExtra(window.console)

/**
 * This component manages everything concerning the game world.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class World {
  /* eslint-disable no-multi-spaces, one-var, key-spacing */

  /**
   * @param {Object} config - World component config
   * @param {Number[][][]} config.map - World map represented as a 3-dimensional array of tile IDs (int)
   * @param {Object[]} config.tilesets - Tileset component config, up to one per layer (see {@link Tileset#constructor})
   * @param {Map<BaseTile>} config.objects - A `Map` containing game objects divided by category
   * @param {Object} config.viewport - Viewport component config (see {@link Viewport#constructor})
   * @param {HTMLElement} config.container - Top hierarchy container element
   * @param {Object} config.ui - UI component config (see {@link UI#constructor})
   * @param {Object} config.keyboard - Keyboard component config (see {@link Keyboard#constructor})
   * @param {Object} config.state - State component config (see {@link State#constructor})
   * @param {Loader} config.loader - {@link Loader} component instance, to pre-render tileset images
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // components related
    this.loader     = config.loader
    this.map        = config.map
    this.tilesets   = config.tilesets.map((tileset) => new Tileset({
      ...tileset,
      loader: this.loader
    }))
    this.input      = new Keyboard(config.keyboard)
    this.state      = new State({
      ...config.state,
      layers: this.map.length,
      rows: this.map[0].length,
      cols: this.map[0][0].length
    })
    this.layers     = this.map.map((layerMap, index) => new Layer({
      debug: this.debug,
      level: index,
      state: this.state,
      map: layerMap,
      tileset: this.tilesets[index] || this.tilesets[0]
    }))

    let [width, height] = this.layers[0].getSize(true) // use first layer size as world size
    this.viewport   = new Viewport({
      ...config.viewport,
      worldWidth: width,
      worldHeight: height
    })
    this.ui         = new UI(config.ui)

    // other
    this.queue      = new EventQueue()
    this.objects    = config.objects
    this.container  = config.container
    this.debug      = config.debug || false

    // ensure container style
    this.resize(this.viewport.width, this.viewport.height)
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
    window.addEventListener('resize', this._handleResize.bind(this))

    this.layers.forEach((layer) => layer.init())
    this.ui.on('click', this._handleUIClick, this)
  }

  /**
   * Update the world state.
   *
   * @param {Number} delta - Time elapsed (int, ms)
   */
  update (delta) {
    if (this.input.isMoving()) {
      this.viewport.move(this.input.getDistance(delta))
    }

    this.layers.forEach((layer) => layer.update(delta))
  }

  /**
   * Draw visible parts to viewport.
   */
  draw () {
    // clear frame
    this.viewport.clear()

    for (let l = 0; l < this.layers.length; l++) {
      this.layers[l].draw() // draws only if changed
      this.viewport.draw(this.layers[l].canvas)
    }
  }

  /**
   * Resize the HTML container.
   * Trigger resizing of `Viewport`.
   *
   * @param {Number} width - New width (int, px)
   * @param {Number} height - New height (int, px)
   */
  resize (width, height) {
    if (this.debug) {
      console.throttle(1000).log(`[WORLD] setting size: ${width} x ${height} px`)
    }

    this.container.style.width = `${width}px`
    this.container.style.height = `${height}px`
    this.viewport.resize(width, height)
  }

  _handleUIClick ([x, y]) {
    let [col, row] = this.viewport.canvasToWorldPosition(x, y, this.tilesets[0].tileSize) // use first tileset for tile size
    let tileID = 0, tileInstance = null, tileState = {}, newState = {}

    for (let l = this.layers.length - 1; l >= 0; l--) {
      tileID = this.layers[l].getTileID(col, row)

      // skip empty tiles
      if (tileID > 0) {
        tileInstance = this.objects.get('tiles').get(tileID)

        if (tileInstance) {
          if (this.debug) {
            console.log(`[WORLD] handling component for tile ${tileID}, clicked at ${col} | ${row}`)
          }

          // pass tile component to UI for handling menu
          tileState = this.state.getTileState(l, col, row)
          newState = this.ui.handleComponent(tileInstance.component, tileState)

          if (newState !== null) {
            this.state.setTileState(newState, l, col, row)
          }
        }
      }
    }
  }

  _handleResize (event) {
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    this.resize(width, height)
  }
}
