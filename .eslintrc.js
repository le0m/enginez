
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  env: {
    browser: true,
    es6: true
  },
  extends: ['standard']
}
