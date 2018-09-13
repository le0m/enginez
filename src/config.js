/* eslint-disable no-multi-spaces, comma-spacing */
const config = {
  width: 1280,
  height: 720,
  mapMargin: 1,
  camera: {
    speed: 512,
    startX: 640,
    startY: 360
  },
  grid: true,
  cellNumbers: true,
  debug: true,
  assets: {
    tileSize: 128,
    tileCols: 18,
    tileRows: 7,
    key: 'tiles',
    src: 'static/tilesheet.png'
  },
  tiles: { // TODO: all the others
    1: {
      on: function (event, state) {
        if (event.name === 'click') {
          console.log(`you clicked dirt!`)
        }
      }
    }

  },
  map: {
    cols: 16,
    rows: 16,
    layers: [
      [
        58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58,
        58, 76, 76, 76, 74, 73,  1,  1,  1, 38, 38, 38,  3,  3,  4, 58,
        58, 76, 76, 75, 74,  1,  1,  1,  1, 37, 37, 38,  3,  4,  4, 58,
        58, 76, 75, 74, 73,  1,  1,  1,  1,  1, 37, 37, 38, 38, 37, 58,
        58, 74, 74, 43,  6,  6, 24,  1,  1,  1, 38, 37, 38, 37, 37, 58,
        58, 73,  1,  1,  1,  1,  5,  1,  1,  1, 37, 37, 37, 38, 38, 58,
        58,  1,  1,  1,  1,  1,  5,  1,  1,  1, 37, 38, 38, 37, 37, 58,
        58,  1,  1,  1,  1,  1, 27,  6,  6, 25,  1, 38, 37, 37, 38, 58,
        58,  1,  1,  1,  1,  1,  5,  1,  1,  1,  1,  1, 38, 38, 38, 58,
        58,  1,  1,  1,  1,  1,  5,  1,  1,  1,  1,  1,  1, 37, 37, 58,
        58,  1,  1, 76,  1,  1,  5,  1,  1,  1,  1,  1,  1,  1,  1, 58,
        58,  1,  1,  1,  1,  1, 41,  6,  6,  6,  6, 25,  1,  1,  1, 58,
        58,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 58,
        58, 22, 22,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 58,
        58, 22, 21,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, 58,
        58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58
      ],
      [
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0, 17,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0, 35,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0, 62,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0, 15,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0, 33,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0, 54,  0,117,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0, 62,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0, 62,  0, 64, 52,  0,  0,119,  0,114,115,  0,  0,  0,  0,
        0,  0,  0, 63,  0,  0,  0,  0,  0,  0,  0,  0,101, 83,  0,  0,
        0,  0,  0,  0,  0, 81, 51,  0,  0,  0,  0,116,101,101,  0,  0,
        0,  0,  0,  0,  0, 99, 81,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
      ],
      [
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0, 53,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
      ],
      [
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0, 72,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
        0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0
      ]
    ]
  }
}

/**
 * - `tiles`:
 *  getObject: function (tile) {
 *    return this[tile] || null
 *  }
 *
 *  - `map`:
 *  getTile: function (layer, col, row) {
 *    return this.layers[layer][row * this.cols + col]
 *  },
 *  getTileObject: function (col, row) {
 *    console.log(`getting tile:`, col, row)
 *    // check first 2 layers
 *    let tile = this.getTile(1, col, row)
 *
 *    if (tile === 0) {
 *      tile = this.getTile(0, col, row)
 *    }
 *    console.log(`got tile:`, tile)
 *
 *    return tiles.getObject(tile)
 *  }
 */

function getTile (layer, col, row) {
  return config.map.layers[layer][row * config.map.cols + col]
}

function getTileObject (col, row) {
  // check first 2 layers
  let tile = getTile(1, col, row)
  if (tile === 0) {
    tile = getTile(0, col, row)
  }

  console.log(`got tile:`, tile)

  return config.tiles[tile] || null
}

export { config, getTile, getTileObject }
