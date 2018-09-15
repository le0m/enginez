Sprite
======

Helper class (or extension?) for tiles with an animation.

- array of tile IDs for the animation
- handle rotating tile frames
- add event to queue for drawing new tile frame (like "draw this tile ID on me")
  - changing tile ID in Layer's map may be a **bad** idea, it would call a different Tile next loop
