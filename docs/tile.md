Tile
====

Logic component for a tile.

- pure component, only one instance per tile ID
- update method to calculate new state from old state and delta time
- can listen to custom events, reacting with an update
  - event must keep note of tile ID
- can have a (or be?) sprite, if needs animation
- maybe more complex (buildings) can extend from more simple (grass, resources)
