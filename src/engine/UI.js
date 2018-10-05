import Observable from './Observable.js'

/**
 * This component handles DOM-based game UI.
 */
export default class UI extends Observable {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - UI component configuration
   * @param {HTMLDivElement} config.div - HTML div main element
   * @param {Number} config.width - UI div width (int, px)
   * @param {Number} config.height - UI div height (int, px)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super()

    this.div      = config.div
    this.width    = config.width
    this.height   = config.height

    // other
    this.debug    = config.debug || false

    // ensure div style
    this.div.style.width = `${this.width}px`
    this.div.style.height = `${this.height}px`
    this.div.style.zIndex = '1'

    this._initListeners()
  }

  _initListeners () {
    this.div.addEventListener('click', this._onClick.bind(this))
  }

  _onClick (event) {
    this.emit('click', [event.layerX, event.layerY])
  }
}
