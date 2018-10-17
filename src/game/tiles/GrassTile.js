import BaseTile from '../../engine/BaseTile.js'

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
   * @param {HTMLElement} config.element - UI element
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    super(config)

    this.element    = config.element
    this._handlers  = new Map()
    this._state     = {}
    this._closed    = false

    // UI elements for menu clicks
    let closeBtn = this.element.querySelector('.navigation .close')
    let buildingBtns = this.element.querySelectorAll('.list-item .click.card')

    // block click on component from reaching game canvas
    this._handlers.set(this.element, (event) => {
      event.stopPropagation()
    })

    // menu close button
    this._handlers.set(closeBtn, (event) => {
      if (this.debug) {
        console.log(`[GRASS TILE] closing menu`)
      }

      event.stopPropagation()
      this.close()
    })

    // buildings buttons
    buildingBtns.forEach((buildingBtn) => {
      this._handlers.set(buildingBtn, (event) => {
        if (this.debug) {
          console.log(`[GRASS TILE] clicked menu item:`, event.target)
        }

        event.stopPropagation()
        this.emit('city.build.NAME_BUILDING')
      })
    })
  }

  /**
   * @inheritdoc
   */
  click (params = {}) {
    console.log(`[GRASS TILE] clicked`)
  }

  /**
   * @inheritdoc
   */
  open (state) {
    this._state = state
    this._closed = false
    this.element.classList.remove('hide')
    this._attachHandlers()

    return this
  }

  /**
   * @inheritdoc
   */
  close () {
    this._detachHandlers()
    this._closed = true
    this.element.classList.add('hide')

    return this._state
  }

  /**
   * @inheritdoc
   */
  isOpen () {
    return !this._closed
  }

  _attachHandlers () {
    for (let [element, handler] of this._handlers) {
      element.addEventListener('click', handler)
    }
  }

  _detachHandlers () {
    for (let [element, handler] of this._handlers) {
      element.removeEventListener('click', handler)
    }
  }
}
