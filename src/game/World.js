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
 * @extends BaseWorld
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
    this.ui.on('ui:open', this._handleUIOpen, this)
    this.ui.on('ui:close', this._handleUIClose, this)
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

  /**
   * Handle UI clicks.
   * This retrieves Tile instance and State, before mounting the component
   * on the UI layer.
   *
   * @param {Number[]} event
   * @param {Number} event[0] - X pixel coordinate
   * @param {Number} event[1] - Y pixel coordinate
   * @listens UI#event:ui-click
   * @private
   */
  _handleUIClick ([x, y]) {
    // use first tileset for tile size
    const [col, row] = this.viewport.canvasToWorldPosition(x, y, this.tilesets[0].tileSize)
    let tileID = 0, tileInstance = null

    for (let l = this.layers.length - 1; l >= 0; l--) {
      tileID = this.layers[l].getTileID(col, row)

      // skip empty tiles
      if (tileID > 0) {
        tileInstance = this.city.getBuildingAt(l, col, row) || this.tiles.get(tileID)

        if (tileInstance) {
          if (this.debug) {
            console.log(`[WORLD] handling component for tile ${tileID}, clicked at ${col} | ${row}`)
          }

          if (this.ui.isMounted()) {
            this.ui.close()
          }

          this.ui.open(tileInstance, this.state.getTileState(l, col, row))
        } else {
          console.warn(`[WORLD] no instance defined for tile ID ${tileID}`)
        }

        break
      }
    }
  }

  /**
   * Handle opening of a new component, attaching event listeners.
   *
   * @param {Object} event
   * @param {BaseTile} event.tile - Current Tile instance
   * @listens UI#event:ui-open
   * @private
   */
  _handleUIOpen ({ tile }) {
    const tState = tile.getState()
    this.layers[tState.layer].setSelection(tState.col, tState.row)
    tile.on('tile:build', this._handleTileBuild, this)
    tile.on('building:add-worker', this._handleBuildingAddWorker, this)
    tile.on('building:remove-worker', this._handleBuildingRemoveWorker, this)
    tile.on('building:ability', this._handleBuildingAbility, this)
  }

  /**
   * Handle closing of the current component, detaching event listeners.
   *
   * @param {Object} event
   * @param {BaseTile} event.tile - Current Tile instance
   * @listens UI#event:ui-close
   * @private
   */
  _handleUIClose ({ tile }) {
    const tState = tile.getState()
    this.layers[tState.layer].clearSelection()
    tile.off('tile:build', this._handleTileBuild, this)
    tile.off('building:add-worker', this._handleBuildingAddWorker, this)
    tile.off('building:remove-worker', this._handleBuildingRemoveWorker, this)
    tile.off('building:ability', this._handleBuildingAbility, this)
  }

  /**
   * Handle Tile build request.
   *
   * @param {Object} event
   * @param {BaseBuilding.} event.Building - Building class definition
   * @param {TileState} event.state - Current Tile state
   * @listens GrassTile#event:tile-build
   * @private
   */
  _handleTileBuild ({ Building, state }) {
    const building = this.city.build(Building, [state.layer, state.col, state.row])

    if (building) {
      const bState = building.getState()
      this.state.setTileState(bState, bState.layer, bState.col, bState.row)
      this.layers[state.layer].setTileID(building.id, bState.col, bState.row)
      this.ui.close()
    }
  }

  /**
   * Handle Building request to add a worker.
   *
   * @param {Object} event
   * @param {BaseBuilding} event.building
   * @listens BaseBuilding#event:building-add-worker
   * @private
   */
  _handleBuildingAddWorker ({ building }) {
    if (this.city.assignWorker(building)) {
      if (this.debug) {
        console.log(`[CITY] assigned worker to building: ${building.name}`)
      }

      const bState = building.getState()
      this.state.setTileState(bState, bState.layer, bState.col, bState.row)
      this.ui.update()
    }
  }

  /**
   * Handle Building request to remove worker.
   *
   * @param {Object} event
   * @param {BaseBuilding} event.building
   * @listens BaseBuilding#event:building-remove-worker
   * @private
   */
  _handleBuildingRemoveWorker ({ building }) {
    if (this.city.removeWorker(building)) {
      if (this.debug) {
        console.log(`[CITY] removed worker from building: ${building.name}`)
      }

      const bState = building.getState()
      this.state.setTileState(bState, bState.layer, bState.col, bState.row)
      this.ui.update()
    }
  }

  _handleBuildingAbility () {}

  /**
   * Handle window resizing.
   *
   * @listens window#resize
   * @private
   */
  _handleResize () {
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    this.resize(width, height)
  }
}
