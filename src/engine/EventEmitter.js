/**
 * This allows for event-driven programming.
 *
 * @author Leo Mainardi <mainardi.leo@gmail.com>
 * @license MIT
 */
export default class EventEmitter {
  constructor () {
    this._eventHandlers = new Map()
  }

  /**
   * Add event handler.
   *
   * @param {String} event - Name of the event
   * @param {Function} callback - Function to execute on event
   * @param {Object} thisArg - Context for the callback
   * @returns {EventEmitter} - Instance of this `EventEmitter`, for chaining
   */
  on (event, callback, thisArg) {
    this._eventHandlers.has(event) || this._eventHandlers.set(event, [])
    this._eventHandlers.get(event).push({
      callback,
      this: thisArg
    })

    return this
  }

  /**
   * Remove event handler.
   * Arguments must be the same as used when registering the handler.
   *
   * @param {String} event - Name of the event
   * @param {Function} callback - Function to be removed
   * @param {Object} thisArg - Context of the callback
   * @returns {boolean} - `false` if the handler is not found
   */
  off (event, callback, thisArg) {
    const handlers = this._eventHandlers.get(event)

    if (handlers && handlers.length) {
      const index = handlers.findIndex((handler) => {
        return handler.callback === callback && handler.this === thisArg
      })

      if (index > -1) {
        handlers.splice(index, 1) // in-place, no need to re-set in Map

        return true
      }
    }

    return false
  }

  /**
   * Emit an event, triggering its handlers.
   *
   * @param {String} event - Name of the event
   * @param {Object} args - Arguments for the event handler
   * @returns {Number|boolean} - Number of handlers triggered, `false` if event has no handlers
   */
  emit (event, ...args) {
    const handlers = this._eventHandlers.get(event)

    if (handlers && handlers.length) {
      return handlers.reduce((emitted, handler) => {
        handler.callback.apply(handler.this, args)
        return ++emitted
      }, 0)
    }

    return false
  }
}
