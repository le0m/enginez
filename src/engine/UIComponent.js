export default class UIComponent {
  constructor (config) {
    this.element = config.element
    this.handlers = new Map()
    this.state = {}
    this.closed = true
  }

  add (element, handler) {
    this.handlers.set(element, handler.bind(this))
  }

  remove (element) {
    this.handlers.delete(element)
  }

  open (state) {
    console.log(`[COMPONENT] opening; currently ${this.handlers.size} handlers`)
    this.state = state
    this.closed = false
    this.element.classList.remove('hide')
    this.attachHandlers()

    return this
  }

  close () {
    console.log(`[COMPONENT] closing; currently ${this.handlers.size} handlers`)
    this.detachHandlers()
    this.closed = true
    this.element.classList.add('hide')

    return this.state
  }

  attachHandlers () {
    for (let [element, handler] of this.handlers) {
      element.addEventListener('click', handler)
    }
  }

  detachHandlers () {
    for (let [element, handler] of this.handlers) {
      element.removeEventListener('click', handler)
    }
  }
}
