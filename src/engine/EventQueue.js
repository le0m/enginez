/**
 * A queue to use for event updates.
 *
 * @version 0.0.2
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class EventQueue {
  /* eslint-disable no-multi-spaces */

  /**
   * @param {Object} config - BaseInput component config
   * @param {Boolean} [config.debug=false] - Debug mode
   */
  constructor (config) {
    this._events  = []

    // other
    this.debug    = config.debug || false
  }

  /**
   * Add an event to the end of the queue.
   *
   * @param {String} name - Event name
   * @param {Object} data - Event data
   */
  add (name, data) {
    this._events.push({
      ...data,
      name
    })
  }

  /**
   * Remove and return the first event in queue.
   *
   * @returns {Object}
   */
  get () {
    return this._events.shift()
  }

  /**
   * Find the first event that satisfies the
   * provided testing function.
   *
   * @see Array.prototype.find
   * @param {Function} callback
   * @return {Object}
   */
  find (callback) {
    return this._events.find(callback)
  }

  /**
   * Create a new array with all events that
   * satisfy the provided testing function.
   *
   * @see Array.prototype.filter
   * @param {Function} callback
   * @return {Object[]}
   */
  findAll (callback) {
    return this._events.filter(callback)
  }
}
