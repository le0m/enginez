import './css/main.css'

import Engine from './engine/Engine.js'
import { engine as config } from './game/config.js'

const game = new Engine(config)

game.run()
  .then(() => {
    console.log(`[MAIN] game has started`)
  })
