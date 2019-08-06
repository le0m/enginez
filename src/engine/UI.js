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
   * Mounts an UI component.
   *
   * Only one component can be open at a time.
   * The previous one will be unmounted if needed.
   *
   * @param {BaseTile} tile - Tile implementing UI logic
   * @return {boolean} - Success of mounting
   */
  mount (tile) {
    if (this.isMounted()) {
      this.unmount()
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
    this.currentTile.on('tile:open', this._onComponentOpen, this)
    this.currentTile.on('tile:close', this._onComponentClose, this)

    return true
  }

  /**
   * Unmounts an UI component.
   *
   * @return {boolean} - Success of unmounting
   */
  unmount () {
    if (!this.isMounted()) {
      return false
    }

    if (this.debug) {
      console.log(`[UI] unmounting component:`, this.currentTile.name)
    }

    this.currentTile.off('tile:open', this._onComponentOpen, this)
    this.currentTile.off('tile:close', this._onComponentClose, this)
    this.currentTile = null
    this.currentComponent = null

    return true
  }

  /**
   * Check if a component is mounted and visible.
   *
   * @return {boolean}
   */
  isMounted () {
    return this.currentTile && this.currentComponent
  }

  open (state) {
    if (this.debug) {
      console.log(`[UI] opening component:`, this.currentTile.name)
    }

    this.currentTile.open(state, this.currentComponent)
    this.currentComponent.classList.remove('hide')
  }

  close () {
    if (this.debug) {
      console.log(`[UI] closing component:`, this.currentTile.name)
    }

    this.currentComponent.classList.add('hide')
    this.currentTile.close()
  }

  isOpen () {
    return this.currentTile && this.currentTile.isOpen()
  }

  _onComponentOpen (data) {
    this.emit('ui:component-opened', data)
  }

  _onComponentClose (data) {
    this.currentComponent.classList.add('hide')
    this.emit('ui:component-closed', data)
    this.unmount()
  }
}
