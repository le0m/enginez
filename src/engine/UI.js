/**
 * This component handles DOM-based game UI.
 */
export default class UI {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - UI component configuration
   * @param {HTMLDivElement} config.div - HTML div main element
   * @param {Viewport} config.viewport - {@link Viewport} component instance, to convert to world coordinates
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.div      = config.div
    this.viewport = config.viewport
    this.width    = config.viewport.width
    this.height   = config.viewport.height

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
    let x = event.layerX
    let y = event.layerY

    let [worldX, worldY] = this.viewport.canvasToWorldPosition(x, y)
    console.log(`${worldX} | ${worldY}`)
  }
}
