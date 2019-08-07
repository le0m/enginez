import BaseTile from '../../engine/BaseTile.js'
import Field from '../buildings/Field.js'

/**
 * Logic for grass tile.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class GrassTile extends BaseTile {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - GrassTile component config
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super(config)

    this._state    = {}
    this._closed   = false

    // init menu items
    /** @type Array<BaseBuilding> */
    this.menuItems = [
      new Field({ // idx: 0
        name: 'field',
        tileID: 112,
        cost: { food: 10, wood: 20 },
        production: { food: 50 },
        time: 10,
        debug: true,
        icon: {
          image: '/static/tileset.png',
          x: -(128 * 3),
          y: -(128 * 6)
        }
      })
    ]
  }

  /**
   * @inheritDoc
   */
  click (params = {}) {
    console.log(`[GRASS TILE] clicked`)
  }

  /**
   * @inheritDoc
   */
  open (state, component) {
    this._state = state
    this._closed = false
    component.update(this.menuItems)
    this._attachHandlers(component)
    component.classList.remove('hide')

    return true
  }

  /**
   * @inheritDoc
   */
  close (component) {
    component.classList.add('hide')
    this._detachHandlers(component)
    this._closed = true

    return this._state
  }

  /**
   * @inheritDoc
   */
  isOpen () {
    return !this._closed
  }

  /**
   * Attach event handlers to wrap specific events.
   *
   * @param {BaseElement} component - Custom web component DOM element
   * @private
   */
  _attachHandlers (component) {
    component.addEventListener('menu:close', this._handleClose.bind(this))
    component.addEventListener('menu:build', this._handleBuild.bind(this))
  }

  /**
   * Detach event handlers of wrapped events.
   *
   * @param {BaseElement} component - Custom web component DOM element
   * @private
   */
  _detachHandlers (component) {
    component.removeEventListener('menu:close', this._handleClose.bind(this))
    component.removeEventListener('menu:build', this._handleBuild.bind(this))
  }

  /**
   * Handle close menu event.
   * Emits a wrapper event with more data.
   *
   * @param {CustomEvent} event
   * @listens BuildingsMenu#event:menu-close
   * @fires GrassTile#tile-close
   * @private
   */
  _handleClose (event) {
    event.stopPropagation()
    /**
     * @event GrassTile#tile-close
     * @type Object
     * @property {Object} state - Current Tile state
     */
    this.emit('tile:close', {
      state: this._state
    })
  }

  /**
   * Handle build button event.
   * Emits a wrapper event with more data.
   *
   * @param {CustomEvent} event
   * @param {BaseBuilding} event.detail
   * @listens BuildingsMenu#event:menu-build
   * @fires GrassTile#tile-build
   * @private
   */
  _handleBuild (event) {
    event.stopPropagation()
    /**
     * @event GrassTile#tile-build
     * @type Object
     * @property {BaseBuilding} building - Clicked building
     * @property {Object} state - Current Tile state
     */
    this.emit('tile:build', {
      building: event.detail,
      state: this._state
    })
  }
}
