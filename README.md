Components
==========

- [World](docs/world.md) (singleton)
- [Layer](docs/layer.md) (instance)
- [Tile](docs/tile.md) (instance per type)
- [Sprite](docs/sprite.md) (instance per animated tile)
- [Camera](docs/camera.md) (singleton)
- [UI](docs/ui.md) (singleton)
- [Input](docs/input.md) (interface)
  - [Keyboard](docs/input.md#keyboard) (singleton)
  - [Touch](docs/input.md#touch) (singleton)
  - [Mouse](docs/input.md#mouse) (singleton)
- [State](docs/state.md) (instance per each tile in each layer)
- [Loader](docs/loader.md) (singleton)
- [EventQueue](docs/event-queue.md) (singleton)
- [Engine](docs/engine.md) (singleton)

Next
====

- Actor component, for drawing citizens moving inside a dedicated layer (no logic, animation only)
