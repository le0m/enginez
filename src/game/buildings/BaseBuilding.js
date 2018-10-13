/**
 * Base Building logic.
 *
 * TODO: use e decay system for long-paused buildings
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class BaseBuilding {
  /* eslint-disable no-multi-spaces, one-var */

  /**
   * @param {Object} config - BaseBuilding component configuration
   * @param {Object} config.production - Building production  ({[food: Number], [wood: Number], [rock: Number]})
   * @param {Number} config.time - Production time (int, s)
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this.production = config.production
    this.time       = config.time
    this.begin      = Date.now() / 1000 | 0
    this.end        = this.begin + this.time
    this.paused     = this.begin
    this.workers    = 0

    // other
    this.debug = config.debug || false
  }

  reset () {
    this.begin = Date.now() / 1000 | 0
    this.end = this.begin + this.time
  }

  pause () {
    if (!this.paused) {
      this.paused = Date.now() / 1000 | 0
    }
  }

  resume () {
    if (this.paused) {
      this.end += (Date.now() / 1000 | 0) - this.paused
      this.paused = false
    }
  }

  produce (timestamp) {
    if (!this.paused && timestamp >= this.end) {
      this.reset()
      return this.production
    }

    return false
  }

  getCost () {}
}
