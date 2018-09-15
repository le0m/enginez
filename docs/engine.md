Engine
======

Manages all engine components.

Extend this class with your implementation, overriding loop methods

- handles delta time, FPS, physics time and all that stuff
- main loop is defined here (override these):
  - `load()`, pre-load assets
  - `init()`, define and initialize all engine components
  - `update()`, handle events and updates, movement, ecc
  - `render()`, handle on/off-canvas re-draws
