'use strict'

//
// Queue for UI events
//

const Queue = {
  _events: []
}

Queue.add = function (name, data) {
  this._events.push({
    ...data,
    name: name
  })
}

Queue.dispatch = function () {
  this._events.map((event) => {
    this._dispatchEvent(event)
  })

  // if changing this, be aware of: https://stackoverflow.com/a/1232046/2270403
  this._events = []
}

Queue._dispatchEvent = function (event) {
  let tile = map.getTileObject(event.col, event.row)
  console.log(`dispatching to:`, tile)

  if (tile !== null) {
    let state = State.getTileState(event.col, event.row)
    let newState = tile.on(event, state)

    state.setTileState(event.col, event.row, newState)
  }
}

Queue.isEmpty = function () {
  return this._events.length === 0
}
