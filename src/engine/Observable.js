import { filterInPlace } from '../utils.js'

/**
 * This allows for event-driven programming.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class Observable {
  constructor () {
    this._eventHandlers = new Map()
  }

  /**
   * Add event listener.
   *
   * @param {String} event - Name of the event
   * @param {Function} callback - Function to execute on event
   * @param {Object} thisArg - Context for the callback
   * @returns {Observable} - Instance of this `Observable`, for chaining
   */
  on (event, callback, thisArg) {
    let handlers = this._eventHandlers.get(event)
    let listener = { callback, this: thisArg }

    if (handlers) {
      handlers.push(listener)
    } else {
      handlers = [listener]
      this._eventHandlers.set(event, handlers)
    }

    return this
  }

  /**
   * Remove event listener.
   * Arguments must be the same used for the
   * `on()` call.
   *
   * @param {String} event - Name of the event
   * @param {Function} callback - Function to be removed
   * @param {Object} thisArg - Context of the callback
   * @returns {Number|false} - Number of removed listeners, `false` if event has no listeners
   */
  off (event, callback, thisArg) {
    let handlers = this._eventHandlers.get(event)

    if (handlers === undefined) {
      return false
    }

    // TODO: if no listeners left, unset Map for this event name
    return filterInPlace(handlers, (listener) => {
      return listener.callback !== callback || listener.this !== thisArg
    })
  }

  /**
   * Emit an event, triggering its listeners.
   *
   * @param {String} event - Name of the event
   * @param {Object} args - Arguments for the event listener
   * @returns {Number} - Number of listeners triggered
   */
  emit (event, ...args) {
    let handlers = this._eventHandlers.get(event)

    if (handlers === undefined) {
      return false
    }

    return handlers.reduce((emitted, listener) => {
      listener.callback.apply(listener.this, args)
      return ++emitted
    }, 0)
  }
}
