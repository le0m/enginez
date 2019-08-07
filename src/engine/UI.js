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
    this.currentTile      = null // current tile UI component
    this.currentComponent = null // current custom component
    this.debug            = config.debug || false

    // ensure z-index
    this.element.style.zIndex = '1'
    this.element.addEventListener('click', this._onClick.bind(this), false)
  }

  _onClick (event) {
    event.preventDefault()
    event.stopPropagation()
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
   * Mounts an UI component.
   *
   * Only one component can be open at a time.
   *
   * @param {BaseTile} tile - Tile implementing UI logic
   * @param {Object} state - Current Tile state
   * @return {Boolean} - Success of mounting
   */
  mountComponent (tile, state) {
    if (this.isMounted()) {
      return false
    }

    if (!this._mount(tile)) {
      return false
    }

    if (this.debug) {
      console.log(`[UI] opening component:`, this.currentTile.name)
    }

    if (!this.currentTile.open(state, this.currentComponent)) {
      return false
    }

    this.emit('ui:component-opened', {
      state: state,
      component: this.currentTile
    })

    return true
  }

  /**
   * Unmounts an UI component.
   *
   * @return {Object|Boolean} - Updated Tile state, or `false` on error
   */
  unmountComponent () {
    if (!this.isMounted()) {
      return false
    }

    if (this.debug) {
      console.log(`[UI] closing component:`, this.currentTile.name)
    }

    const newState = this.currentTile.close(this.currentComponent)
    this.emit('ui:component-closed', {
      state: newState,
      component: this.currentTile
    })
    this._unmount()

    return true
  }

  _mount (tile) {
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

    return true
  }

  _unmount () {
    if (this.debug) {
      console.log(`[UI] unmounting component:`, this.currentTile.name)
    }

    this.currentTile.off('tile:close', this._handleComponentClose, this)
    this.currentTile = null
    this.currentComponent = null
  }

  _handleComponentClose (data) {
    if (this.debug) {
      console.log(`[UI] closing component:`, this.currentTile.name)
    }

    this.currentTile.close(this.currentComponent)
    this.emit('ui:component-closed', {
      state: data.state,
      component: this.currentTile
    })

    this._unmount()
  }
}
