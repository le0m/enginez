import State from '../engine/State.js'
import Viewport from '../engine/Viewport.js'
import Layer from '../engine/Layer.js'
import Keyboard from '../engine/Keyboard.js'
import Tileset from '../engine/Tileset.js'
import UI from '../engine/UI.js'
import { ConsoleExtra } from '../utils.js'
import BaseWorld from '../engine/BaseWorld'
import City from './City'
import { map, tilesets, keyboard, state, ui, viewport, objects } from './config.js'

const console = ConsoleExtra(window.console)

/**
 * World implementation.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class World extends BaseWorld {
  /* eslint-disable no-multi-spaces, one-var, key-spacing */

  /**
   * @param {Object} config - World component config
   * @param {HTMLElement} config.container - Top hierarchy container element
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super(config)

    // components related
    this.map        = map
    this.tilesets   = tilesets.map((tileset) => new Tileset({
      ...tileset,
      loader: this.loader
    }))
    this.input      = new Keyboard(keyboard)
    this.state      = new State({
      ...state,
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
      ...viewport,
      worldWidth: width,
      worldHeight: height
    })
    this.ui         = new UI(ui)

    // other
    this.objects    = objects
    this.city = new City({
      root: this.ui.element,
      population: 5,
      resources: { food: 100, wood: 100, rock: 100 },
      debug: true
    })

    // ensure container style
    this.resize(this.viewport.width, this.viewport.height)
  }

  /**
   * @inheritdoc
   */
  load () {
    return this.tilesets.map((tileset) => tileset.load())
  }

  /**
   * @inheritdoc
   */
  init () {
    window.addEventListener('resize', this._handleResize.bind(this))

    this.layers.forEach((layer) => layer.init())
    this.ui.on('click', this._handleUIClick, this)
  }

  /**
   * @inheritdoc
   */
  update (delta, timestamp) {
    if (this.input.isMoving()) {
      this.viewport.move(this.input.getDistance(delta))
    }

    this.layers.forEach((layer) => layer.update(delta, timestamp))
    this.city.production(timestamp)
  }

  /**
   * @inheritdoc
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
   * @inheritdoc
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

          tileState = this.state.getTileState(l, col, row)

          if (this.ui.component !== null) {
            this.ui.component.off('city.build', this._handleCityEvent, this)
          }

          // pass tile component to UI for handling menu
          newState = this.ui.handleComponent(tileInstance, tileState)
          this.ui.component.on('city.build', this._handleCityEvent, this)

          if (newState !== null) {
            this.state.setTileState(newState, newState.layer, newState.col, newState.row)
          }
        }

        break
      }
    }
  }

  _handleCityEvent ({ tile, building, state }) {
    if (this.city.build(building())) {
      this.layers[state.layer].setTileID(tile, state.col, state.row)
    }
  }

  _handleResize () {
    let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    this.resize(width, height)
  }
}
