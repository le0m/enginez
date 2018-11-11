import './css/main.css'

import Engine from './engine/Engine.js'
import { engine as config } from './game/config.js'

const game = new Engine(config)

game.run()
  .then(() => {
    console.log(`[MAIN] game has started`)
  })

// TEST: mount a template
const mount = (templateId) => {
  if (templateId) {
    let template = document.getElementById(templateId)
    let rootNode = document.getElementById('ui')
    let clone = template.content.cloneNode(true)
    rootNode.appendChild(clone)
  }
}

// change template ID to test a template
mount('')
