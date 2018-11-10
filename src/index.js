import './css/main.css'

import Engine from './engine/Engine.js'
import { engine as config } from './game/config.js'
import './ResourcesHeader.js'

const game = new Engine(config)

game.run()
  .then(() => {
    console.log(`[MAIN] game has started`)
  })

let elem = document.createElement('resources-header')
let parent = document.querySelector('body .container #ui')
parent.appendChild(elem)
