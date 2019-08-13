import EventEmitter from './EventEmitter'

/**
 * This is a base class for tiles.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseTile extends EventEmitter {
  /* eslint-disable no-multi-spaces */

  /**
   * Tile state.
   *
   * @typedef TileState
   * @property {Number} layer
   * @property {Number} col
   * @property {Number} row
   */

  /**
   * Tile information.
   *
   * @typedef TileInfo
   * @property {Number} id
   * @property {String} name
   * @property {String} component
   */

  /**
   * Static Tile information.
   *
   * @return {TileInfo}
   */
  static info () {}

  /**
   * @param {Object} config - BaseTile component config
   * @param {Number} config.id - Tile ID
   * @param {String} config.name - Tile name
   * @param {String} config.component - UI component name
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super()

    this.id        = config.id
    this.name      = config.name
    this.component = config.component

    // other
    this._state    = {}
    this._closed   = true
    this.debug     = config.debug || false
  }

  /**
   * Get current Tile state.
   *
   * @return {TileState}
   */
  getState () {
    return this._state
  }

  /**
   * Set new Tile state, or part of it.
   *
   * @param {TileState} newState
   */
  setState (newState) {
    Object.assign(this._state, newState)
  }

  /**
   * Open the tile UI menu.
   *
   * @param {BaseElement} component - Custom web component DOM element
   * @param {Object} state - Current tile state
   * @returns {Boolean} - Success of opening
   */
  open (component, state) {
    this.setState(state)
    this._attachHandlers(component)
    component.classList.remove('hide')
    this._closed = false

    return true
  }

  /**
   * Update the tile UI menu.
   *
   * @param {BaseElement} component - Custom web component DOM element
   * @return {Boolean} - Success of updating
   */
  update (component) {
    return true
  }

  /**
   * Close the tile UI menu.
   *
   * @param {BaseElement} component - Custom web component DOM element
   * @returns {Object} - Current Tile state
   */
  close (component) {
    this._detachHandlers(component)
    component.classList.add('hide')
    this._closed = true

    return this.getState()
  }

  /**
   * Check if tile UI menu is currently open.
   *
   * @returns {Boolean}
   */
  isOpen () {
    return !this._closed
  }

  /**
   * Attach event handlers to wrap specific events.
   *
   * @param {BaseElement} component - Custom web component DOM element
   */
  _attachHandlers (component) {}

  /**
   * Detach event handlers of wrapped events.
   *
   * @param {BaseElement} component - Custom web component DOM element
   */
  _detachHandlers (component) {}
}
