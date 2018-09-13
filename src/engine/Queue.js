/**
 * Implements a queue for UI events.
 */
export default class Queue {
  /**
   * Some external functions are required to work:
   * - `getObject`, from map configuration
   * - `getState`, from State object
   * - `setState`, from State object
   *
   * @param {Function} getObject
   * @param {Function} getState
   * @param {Function} setState
   */
  constructor (getObject, getState, setState) {
    this._events = []
    this._getObject = getObject
    this._getState = getState
    this._setState = setState
  }

  add (name, data) {
    this._events.push({
      ...data,
      name: name
    })
  }

  dispatch () {
    this._events.map((event) => {
      this._dispatchEvent(event)
    })

    // if changing this, be aware of: https://stackoverflow.com/a/1232046/2270403
    this._events = []
  }

  isEmpty () {
    return this._events.length === 0
  }

  _dispatchEvent (event) {
    let tile = this._getObject(event.col, event.row)
    console.log(`dispatching to:`, tile)

    if (tile !== null) {
      let state = this._getState(event.col, event.row)
      let newState = tile.on(event, state)

      this._setState(event.col, event.row, newState)
    }
  }
}
