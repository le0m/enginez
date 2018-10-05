import { filterInPlace } from '../utils.js'

export default class Observable {
  constructor () {
    this._eventHandlers = new Map()
  }

  on (event, func, thisArg) {
    let handlers = this._eventHandlers.get(event)
    let listener = { func, this: thisArg }

    if (handlers) {
      handlers.push(listener)
    } else {
      handlers = [listener]
      this._eventHandlers.set(event, handlers)
    }

    return this
  }

  off (event, func, thisArg) {
    let handlers = this._eventHandlers.get(event)

    if (handlers === undefined) {
      return false
    }

    return filterInPlace(handlers, (listener) => {
      return listener.func !== func || listener.this !== thisArg
    })
  }

  emit (event, ...args) {
    let handlers = this._eventHandlers.get(event)

    if (handlers === undefined) {
      return false
    }

    return handlers.reduce((emitted, listener) => {
      listener.func.apply(listener.this, args)
      return ++emitted
    }, 0)
  }
}
