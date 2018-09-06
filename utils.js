function twoDecimals (number) {
  return number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
}
