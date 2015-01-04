const tokenize  = require('glsl-tokenizer/string')
const stringify = require('glsl-token-string')
const test      = require('tape')
const path      = require('path')
const rename    = require('../')
const fs        = require('fs')

test('methods', (t) => {
  var src = fs.readFileSync(
    path.join(__dirname, 'fixtures', 'methods.glsl')
  , 'utf8')

  var n = 0
  var new2orig = {}
  var orig2new = {
    duplicates: 'a0'
  }

  var tokens = rename(tokenize(src), (token) => {
    let name = orig2new[token]
    new2orig[name] = token
    return name
  })

  var renamed = stringify(tokens)

  t.notEqual(renamed.indexOf(orig2new.duplicates), -1, 'duplicates() was replaced')
  t.notEqual(renamed.indexOf(`void ${orig2new.duplicates}();`), -1, 'void duplicates() was replaced')
  t.notEqual(renamed.indexOf(`vec2 ${orig2new.duplicates}() {}`), -1, 'vec2 duplicates() was replaced')
  t.notEqual(renamed.indexOf(`vec3 ${orig2new.duplicates}() {}`), -1, 'vec3 duplicates() was replaced')
  t.notEqual(renamed.indexOf(`vec4 ${orig2new.duplicates}() {}`), -1, 'vec4 duplicates() was replaced')
  t.equal(renamed.indexOf('duplicates'), -1, 'duplicates() no longer remaining in the shader')

  t.end()
})
