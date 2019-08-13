import BaseTile from '../../engine/BaseTile.js'
import FieldTile from './FieldTile.js'

/**
 * Logic for grass tile.
 *
 * @extends BaseTile
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class GrassTile extends BaseTile {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @inheritDoc
   */
  static info () {
    return {
      id: 1,
      name: 'Grass',
      component: 'buildings-menu'
    }
  }

  /**
   * @param {Object} config - GrassTile component config
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    // deep-clone info to prevent changing the default from
    // an instance by reference (child objects)
    const info = JSON.parse(JSON.stringify(GrassTile.info()))
    super(Object.assign(info, config))

    // init menu items
    /** @type Array<BaseBuilding.> */
    this.menuItems = [
      FieldTile // idx: 0
    ]
  }

  /**
   * @inheritDoc
   */
  open (component, state) {
    component.update(this.menuItems)
    return super.open(component, state)
  }

  /**
   * @inheritDoc
   */
  _attachHandlers (component) {
    component.addEventListener('menu:close', this._handleClose.bind(this))
    component.addEventListener('menu:build', this._handleBuild.bind(this))
  }

  /**
   * @inheritDoc
   */
  _detachHandlers (component) {
    component.removeEventListener('menu:close', this._handleClose.bind(this))
    component.removeEventListener('menu:build', this._handleBuild.bind(this))
  }

  /**
   * Handle close menu event.
   *
   * @param {CustomEvent} event
   * @listens BuildingsMenu#event:menu-close
   * @fires BaseTile#tile-close
   * @private
   */
  _handleClose (event) {
    event.stopPropagation()

    /**
     * @event BaseTile#tile-close
     * @type Object
     * @property {TileState} state - Current Tile state
     */
    this.emit('tile:close', {
      state: this.getState()
    })
  }

  /**
   * Handle build button event.
   *
   * @param {CustomEvent} event
   * @param {BaseBuilding.} event.detail - Building class definition
   * @listens BuildingsMenu#event:menu-build
   * @fires GrassTile#tile-build
   * @private
   */
  _handleBuild (event) {
    event.stopPropagation()

    /**
     * @event GrassTile#tile-build
     * @type Object
     * @property {BaseBuilding.} building - Class definition of clicked building
     * @property {TileState} state - Current Tile state
     */
    this.emit('tile:build', {
      Building: event.detail,
      state: this.getState()
    })
  }
}
