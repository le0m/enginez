import State from '../engine/State.js'
import Viewport from '../engine/Viewport.js'
import Layer from '../engine/Layer.js'
import Keyboard from '../engine/Keyboard.js'
import Tileset from '../engine/Tileset.js'
import UI from '../engine/UI.js'
import { ConsoleExtra } from '../utils.js'
import BaseWorld from '../engine/BaseWorld.js'
import City from './City.js'
import { map, tilesets, keyboard, state, ui, viewport, tiles } from './config.js'

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
      map: layerMap,
      tileset: this.tilesets[index] || this.tilesets[0]
    }))

    const [width, height] = this.layers[0].getSize(true) // use first layer size as world size
    this.viewport   = new Viewport({
      ...viewport,
      worldWidth: width,
      worldHeight: height
    })
    this.ui         = new UI(ui)

    // other
    this.tiles    = tiles
    this.city = new City({
      root: this.ui.element,
      population: 5,
      resources: { food: 100, wood: 100, rock: 100 },
      ui: this.ui,
      debug: true
    })

    // ensure container style
    this.resize(this.viewport.width, this.viewport.height)
  }

  /**
   * @inheritDoc
   */
  load () {
    return this.tilesets.map((tileset) => tileset.load())
  }

  /**
   * @inheritDoc
   */
  init () {
    window.addEventListener('resize', this._handleResize.bind(this))

    this.layers.forEach((layer) => layer.init())
    this.ui.on('ui:click', this._handleUIClick, this)
    this.ui.on('ui:component-opened', this._handleComponentOpen, this)
    this.ui.on('ui:component-closed', this._handleComponentClose, this)
  }

  /**
   * @inheritDoc
   */
  update (delta, timestamp) {
    if (this.input.isMoving()) {
      this.viewport.move(this.input.getDistance(delta))
    }

    this.layers.forEach((layer) => layer.update(delta, timestamp))
    this.city.production(timestamp)
  }

  /**
   * @inheritDoc
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
   * @inheritDoc
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
    // use first tileset for tile size
    const [col, row] = this.viewport.canvasToWorldPosition(x, y, this.tilesets[0].tileSize)
    let tileID = 0, tileInstance = null

    for (let l = this.layers.length - 1; l >= 0; l--) {
      tileID = this.layers[l].getTileID(col, row)

      // skip empty tiles
      if (tileID > 0) {
        tileInstance = this.tiles.get(tileID)

        if (tileInstance) {
          if (this.debug) {
            console.log(`[WORLD] handling component for tile ${tileID}, clicked at ${col} | ${row}`)
          }

          if (this.ui.isMounted()) {
            this.ui.unmountComponent()
          }

          this.ui.mountComponent(tileInstance, this.state.getTileState(l, col, row))
        }

        break
      }
    }
  }

  _handleTileBuild ({ building, state }) {
    if (this.city.build(building)) {
      this.layers[state.layer].setTileID(building.tileID, state.col, state.row)
      this.ui.unmountComponent()
    }
  }

  _handleComponentOpen ({ component }) {
    component.on('tile:build', this._handleTileBuild, this)
  }

  _handleComponentClose ({ state, component }) {
    component.off('tile:build', this._handleTileBuild, this)
    this.state.setTileState(state, state.layer, state.col, state.row)
  }

  _handleResize () {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    this.resize(width, height)
  }
}
