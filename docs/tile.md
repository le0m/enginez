BaseTile (interface)
====================

Logic component for a tile.

Extend yourself to implement one per type of tile.

- pure component, only one instance per tile ID
- update method to calculate new state from old state and delta time
- can listen to custom events, reacting with an update
  - event must keep note of tile ID
- can have a (or be?) sprite, if needs animation
