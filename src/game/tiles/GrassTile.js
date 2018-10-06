import BaseTile from '../../engine/BaseTile.js'

/**
 * Logic for grass tile.
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
  }

  /**
   * @inheritdoc
   */
  click ({ state }) {
    let clicks = state.clicks || 0
    console.log(`[GRASS TILE] clicked ${clicks} times`)

    return { clicks: ++clicks }
  }
}
