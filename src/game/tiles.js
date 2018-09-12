'use strict'

const tiles = {
  1: {
    on: function (event, state) {
      if (event.name === 'click') {
        console.log(`you clicked dirt!`)
      }
    }
  },
  getObject: function (tile) {
    return this[tile] || null
  }
}
