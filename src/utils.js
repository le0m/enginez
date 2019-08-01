/**
 * Console rate limiting, unique per line of originating code.
 *
 * console.times(n) - Only runs n times
 * console.throttle(time) - Only runs once every time milliseconds.
 *
 * Each returns a console object whose methods are rate limited.
 *
 * credits: Steven Wittens, https://github.com/unconed/console-extras.js
 *
 * @param {Object} console - Usually `window.console`
 */
function ConsoleExtra (console) {
  const counts = {}
  const timestamps = {}

  // Create replacement console class
  const limited = Object.create(console)

  // Get unique ID per call based on stack trace
  console.__getCallID = function (skip) {
    const stack = new Error().stack
    if (stack) {
      const lines = stack.split(/\n/g)
      let found = false
      let offset = 0

      skip++ // skip self

      for (const i in lines) {
        if (offset === skip) {
          return lines[i]
        }
        if (!found && lines[i].match(/getCallID/)) {
          found = true
        }
        if (found) {
          offset++
        }
      }
    }

    return 'exception'
  }

  // Prepare limited versions of all console methods.
  for (const i in console) {
    (function (method, key) {
      limited[key] = function () {
        const id = this.__id

        // Once every x ms
        const timestamp = timestamps[id] || 0
        const now = +new Date()
        if ((now - timestamp) >= this.__throttle) {
          timestamps[id] = now

          // Up to n times
          const count = counts[id] || 0
          if (count < this.__limit) {
            counts[id] = count + 1

            const that = console[key].consoleExtras ? this : console
            console[key].apply(that, arguments)
          }
        }

        return this
      }
    })(console[i], i)
  }

  // Add .times() to console.
  console.times = function (n) {
    const ret = Object.create(limited)
    ret.__id = this.__id || console.__getCallID(1)
    ret.__limit = n
    ret.__throttle = this.__throttle || 0
    return ret
  }
  console.times.consoleExtras = true

  // Add .throttle() to console.
  console.throttle = function (time) {
    const ret = Object.create(limited)
    ret.__id = this.__id || console.__getCallID(1)
    ret.__limit = this.__limit || Infinity
    ret.__throttle = time
    return ret
  }
  console.throttle.consoleExtras = true

  return console
}

/**
 * Filter an array in-place.
 *
 * Works by overwriting elements in the array with the
 * elements to keep and changing the `length` property.
 *
 * credits: https://stackoverflow.com/a/16491790/2270403
 *
 * NOTE: this was used to remove all equal event listeners in Observable class
 *       now it removes only the first found
 *
 * @param {Array} array
 * @param {Function} predicate - Return `true` to keep, `false` to remove, the current element
 * @returns {Number} - Number of removed elements
 */
const filterInPlace = (array, predicate) => {
  /* eslint-disable one-var */

  let end = 0, value = null

  for (let i = 0, max = array.length; i < max; i++) {
    value = array[i]

    if (predicate(value)) {
      array[end] = value
      end++
    }
  }

  const removed = array.length - end
  array.length = end

  return removed
}

export { ConsoleExtra, filterInPlace }
