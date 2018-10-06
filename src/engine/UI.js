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
   * REMOVE: width/height, they are set in CSS to 100%
   *
   * @param {Object} config - UI component configuration
   * @param {HTMLElement} config.element - HTML UI element
   * @param {Number} config.width - UI div width (int, px)
   * @param {Number} config.height - UI div height (int, px)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super()

    this.element    = config.element
    // this.width    = config.width REMOVE
    // this.height   = config.height REMOVE

    // other
    this.debug      = config.debug || false

    // ensure element style
    // this.element.style.width = `${this.width}px` REMOVE
    // this.element.style.height = `${this.height}px` REMOVE
    this.element.style.zIndex = '1'

    this._initListeners()
  }

  _initListeners () {
    this.element.addEventListener('click', this._onClick.bind(this))
  }

  _onClick (event) {
    this.emit('click', [event.layerX, event.layerY])
  }
}
