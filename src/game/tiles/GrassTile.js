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

    this._handlers  = new Map()
    this._state     = {}
    this._closed    = false

    // init buildings menu
    this.menuItems = [
      new Field({ // idx: 0
        name: 'field',
        tileID: 112,
        cost: { food: 10, wood: 20 },
        production: { food: 50 },
        time: 10,
        debug: true
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
    component.init(this.menuItems)
    this._createHandlers(component)
    this._attachHandlers()
    this.emit('tile:open', this._state)

    return this
  }

  /**
   * @inheritDoc
   */
  close () {
    this._detachHandlers()
    this._handlers.clear()
    this._closed = true
    this.emit('tile:close', this._state)

    return this
  }

  /**
   * @inheritDoc
   */
  isOpen () {
    return !this._closed
  }

  _createHandlers (component) {
    // UI elements for menu clicks
    const closeBtn = component.shadowRoot.querySelector('.navigation .close')
    const buildingBtns = component.shadowRoot.querySelectorAll('.list-item .click.card')

    // block click on component from reaching game canvas
    this._handlers.set(component.shadowRoot, (event) => {
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
    buildingBtns.forEach((buildingBtn, index) => {
      this._handlers.set(buildingBtn, (event) => {
        if (this.debug) {
          console.log(`[GRASS TILE] clicked menu item`)
        }

        event.stopPropagation()
        this.emit('tile:build', {
          building: this.menuItems[index],
          state: this._state
        })
      })
    })
  }

  _attachHandlers () {
    for (const [element, handler] of this._handlers) {
      element.addEventListener('click', handler)
    }
  }

  _detachHandlers () {
    for (const [element, handler] of this._handlers) {
      element.removeEventListener('click', handler)
    }
  }
}
