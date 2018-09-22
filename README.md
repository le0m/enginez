Components
==========

- [Engine](docs/engine.md)
- [World](docs/world.md)
- [Layer](docs/layer.md)
- [Tileset](docs/tileset.md)
- [BaseTile](docs/tile.md) (interface)
- [Sprite](docs/sprite.md)
- [Viewport](docs/viewport.md)
- [UI](docs/ui.md)
- [BaseInput](docs/input.md) (interface)
  - [Keyboard](docs/input.md#keyboard)
  - [Touch](docs/input.md#touch)
  - [Mouse](docs/input.md#mouse)
- [State](docs/state.md)
- [Loader](docs/loader.md)
- [EventQueue](docs/event-queue.md)

Next
====

- Tileset component, with reference to Loader cache key and draws the tileset in an off-canvas
  - change Loader to accept Tileset
  - initialize instances of Tile here?
- Actor component, for drawing citizens moving inside a dedicated layer (no logic, animation only)
