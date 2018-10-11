import BaseTile from '../../engine/BaseTile.js'
import UIComponent from '../../engine/UIComponent.js'

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
   */
  constructor (config) {
    super(config)

    this.element  = config.element
    this.component = new UIComponent({ element: this.element })

    // UI handlers
    let closeBtn = this.element.querySelector('.navigation .close')
    let buildingBtns = this.element.querySelectorAll('.list-item .click.card')

    // TODO: 'component' is an Observable
    this.component.add(closeBtn, (event) => {
      event.preventDefault()
      event.stopPropagation()
      console.log(`----TEST----`, this) // TEST if this is UIComponent, call this.close
    })
    buildingBtns.forEach((buildingBtn) => {
      this.component.add(buildingBtn, (event) => {
        event.preventDefault()
        event.stopPropagation()
        console.log(`clicked building:`, event)
      })
    })
  }

  /**
   * @inheritdoc
   */
  click (params = {}) {
    console.log(`[GRASS TILE] clicked`)
  }
}
