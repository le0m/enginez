import Observable from './Observable.js'

/**
 * This component handles DOM-based game UI.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class UI extends Observable {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - UI component configuration
   * @param {HTMLElement} config.element - HTML UI element
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super()

    this.element    = config.element

    // other
    this.component  = null // current tile UI component
    this.debug      = config.debug || false

    // ensure z-index
    this.element.style.zIndex = '1'
    this.element.addEventListener('click', this._onClick.bind(this), false)
  }

  _onClick (event) {
    event.preventDefault()
    event.stopPropagation()
    this.emit('click', [event.layerX, event.layerY])
  }

  /**
   * Handles an UI component.
   *
   * Only one component can be open at a time.
   * The previous one will be closed and its result returned.
   *
   * @param {BaseTile} component - Tile implementing UI logic
   * @param {Object} state - Current state of the tile
   * @returns {*}
   */
  handleComponent (component, state) {
    let result = null

    if (this.component !== null && this.component.isOpen()) {
      result = this.component.close()

      if (this.debug) {
        console.log(`[UI] closing previous component:`, result || {})
      }
    }

    this.component = component.open(state)

    return result
  }
}
