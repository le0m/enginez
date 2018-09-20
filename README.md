Components
==========

- [Engine](docs/engine.md) (singleton)
- [World](docs/world.md) (singleton)
- [Layer](docs/layer.md) (instance)
- [Tile](docs/tile.md) (instance per type)
- [Sprite](docs/sprite.md) (instance per animated tile)
- [Viewport](docs/viewport.md) (singleton)
- [UI](docs/ui.md) (singleton)
- [Input](docs/input.md) (interface)
  - [Keyboard](docs/input.md#keyboard) (singleton)
  - [Touch](docs/input.md#touch) (singleton)
  - [Mouse](docs/input.md#mouse) (singleton)
- [State](docs/state.md) (instance per each tile in each layer)
- [Loader](docs/loader.md) (singleton)
- [EventQueue](docs/event-queue.md) (singleton)

Next
====

- deep copy `constructor()` config parameters, so they don't end up being changed from everywhere by reference
- Actor component, for drawing citizens moving inside a dedicated layer (no logic, animation only)
