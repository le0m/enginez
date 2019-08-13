import './css/main.css'

import Engine from './engine/Engine.js'
import { engine as config } from './game/config.js'

const game = new Engine(config)

game.run()
  .then(() => {
    console.log(`[MAIN] game has started`)
  })

// DEBUG
const dumpState = function (layer = null, col = null, row = null) { // eslint-disable-line no-unused-vars
  if (layer !== null && col !== null && row !== null) {
    console.log(`[DUMP][state] tile`, config.world.state.getTileState(layer, col, row))
  } else {
    console.log(`[DUMP][state] all`, config.world.state.stateMap)
  }
}

const dumpCity = function () { // eslint-disable-line no-unused-vars
  console.log(`[DUMP][city] buildings`, config.world.city.buildings)
}

window.state = dumpState
window.city = dumpCity

// TEST: mount a template
const mount = (templateId) => {
  if (templateId) {
    const template = document.getElementById(templateId)
    const rootNode = document.getElementById('ui')
    const clone = template.content.cloneNode(true)
    rootNode.appendChild(clone)
  }
}

// change template ID to test a template
mount('')
