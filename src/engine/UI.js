import EventEmitter from './EventEmitter.js'

/**
 * This component handles DOM-based game UI.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class UI extends EventEmitter {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - UI component configuration
   * @param {HTMLElement} config.element - HTML UI element
   * @param {Map<String,BaseElement>} config.components - All games HTML UI custom elements
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super()

    this.element          = config.element
    this.components       = config.components
    for (const component of this.components.values()) {
      component.classList.add('hide')
      this.element.appendChild(component)
    }

    // other
    /** @type {BaseTile|null} */
    this.currentTile      = null // current tile UI component
    this.currentComponent = null // current custom component
    this.debug            = config.debug || false

    // ensure z-index
    this.element.style.zIndex = '1'
    this.element.addEventListener('click', this._onClick.bind(this), false)
  }

  /**
   * Handle UI root element clicks, emitting an event with coordinates.
   *
   * @param {MouseEvent} event
   * @listens Element#click
   * @fires UI#ui-click
   * @private
   */
  _onClick (event) {
    event.preventDefault()
    event.stopPropagation()
    /**
     * @event UI#ui-click
     * @type Array
     * @property {Number} 0 - X position
     * @property {Number} 1 - Y position
     */
    this.emit('ui:click', [event.layerX, event.layerY])
  }

  /**
   * Check if a component is mounted.
   *
   * @return {Boolean}
   */
  isMounted () {
    return this.currentTile && this.currentComponent
  }

  /**
   * Open an UI component.
   * Only one component can be open at a time.
   *
   * @param {BaseTile} tile - Tile implementing UI logic
   * @param {Object} [state={}] - Current Tile state
   * @return {Boolean} - Success of opening
   * @fires UI#ui-open
   */
  open (tile, state = {}) {
    if (this.isMounted()) {
      return false
    }

    if (!this.components.has(tile.component)) {
      console.warn(`[UI] component '${tile.component}' not found`)
      return false
    }

    if (this.debug) {
      console.log(`[UI] mounting component:`, tile.name)
    }

    this.currentComponent = this.components.get(tile.component)
    this.currentTile = tile
    this.currentTile.on('tile:close', this._handleComponentClose, this)

    if (this.debug) {
      console.log(`[UI] opening component:`, this.currentTile.name)
    }

    if (!this.currentTile.open(this.currentComponent, state)) {
      return false
    }

    /**
     * @event UI#ui-open
     * @type Object
     * @property {BaseTile} tile - Tile instance
     */
    this.emit('ui:open', {
      tile: this.currentTile
    })

    return true
  }

  /**
   * Close an UI component.
   *
   * @return {Object|Boolean} - Updated Tile state, or `false` on error
   * @fires UI#ui-close
   */
  close () {
    if (!this.isMounted()) {
      return false
    }

    if (this.debug) {
      console.log(`[UI] closing component:`, this.currentTile.name)
    }

    const newState = this.currentTile.close(this.currentComponent)
    /**
     * @event UI#ui-close
     * @type Object
     * @property {Object} state - Current Tile state
     * @property {BaseTile} tile - Tile instance
     */
    this.emit('ui:close', {
      state: newState,
      tile: this.currentTile
    })

    if (this.debug) {
      console.log(`[UI] unmounting component:`, this.currentTile.name)
    }

    this.currentTile.off('tile:close', this._handleComponentClose, this)
    this.currentTile = null
    this.currentComponent = null

    return true
  }

  /**
   * Handle component close event.
   *
   * @param {Object} event
   * @param {Object} event.state - Current Tile state
   * @listens GrassTile#event:tile-close
   * @fires UI#ui-close
   * @private
   */
  _handleComponentClose (event) {
    this.close()
  }
}
