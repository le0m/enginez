/**
 * Console rate limiting, unique per line of originating code.
 *
 * console.times(n) - Only runs n times
 * console.throttle(time) - Only runs once every time milliseconds.
 *
 * Each returns a console object whose methods are rate limited.
 *
 * credits: Steven Wittens, https://github.com/unconed/console-extras.js
 */
function ConsoleExtra (console) {
  let counts = {}
  let timestamps = {}

  // Create replacement console class
  let limited = Object.create(console)

  // Get unique ID per call based on stack trace
  console.__getCallID = function (skip) {
    let stack = new Error().stack
    if (stack) {
      let lines = stack.split(/\n/g)
      let found = false
      let offset = 0

      skip++ // skip self

      for (let i in lines) {
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
  for (let i in console) {
    (function (method, key) {
      limited[key] = function () {
        let id = this.__id

        // Once every x ms
        let timestamp = timestamps[id] || 0
        let now = +new Date()
        if ((now - timestamp) >= this.__throttle) {
          timestamps[id] = now

          // Up to n times
          let count = counts[id] || 0
          if (count < this.__limit) {
            counts[id] = count + 1

            let that = console[key].consoleExtras ? this : console
            console[key].apply(that, arguments)
          }
        }

        return this
      }
    })(console[i], i)
  }

  // Add .times() to console.
  console.times = function (n) {
    let ret = Object.create(limited)
    ret.__id = this.__id || console.__getCallID(1)
    ret.__limit = n
    ret.__throttle = this.__throttle || 0
    return ret
  }
  console.times.consoleExtras = true

  // Add .throttle() to console.
  console.throttle = function (time) {
    let ret = Object.create(limited)
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
 * @param {Array} array
 * @param {Function} predicate
 * @returns {Number} - Number of removed elements
 */
const filterInPlace = (array, predicate) => {
  /* eslint-disable one-var */

  let end = 0, value = null, removed = 0

  for (let i = 0, max = array.length; i < max; i++) {
    value = array[i]

    if (predicate(value)) {
      array[end] = value
      end++
    }
  }

  removed = array.length - end
  array.length = end

  return removed
}

export { ConsoleExtra, filterInPlace }
