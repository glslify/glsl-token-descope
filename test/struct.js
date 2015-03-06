const tokenize  = require('glsl-tokenizer/string')
const stringify = require('glsl-token-string')
const test      = require('tape')
const path      = require('path')
const rename    = require('../')
const fs        = require('fs')

test('struct', (t) => {
  var src = fs.readFileSync(
    path.join(__dirname, 'fixtures', 'struct.glsl')
  , 'utf8')

  var orig2new = {}
  var new2orig = {}
  var n = 0

  var tokens = rename(tokenize(src), (token) => {
    let name = `a_${n++}`
    orig2new[token] = name
    new2orig[name] = token
    return name
  })

  var renamed = stringify(tokens)

  t.notEqual(renamed.indexOf(orig2new.StructName), -1, 'StructName was renamed')
  t.notEqual(renamed.indexOf('LocalStruct'), -1, 'LocalStruct was not renamed')
  t.notEqual(renamed.indexOf('local'), -1, 'local was not renamed')
  t.notEqual(renamed.indexOf('local.x'), -1, 'local.x was not renamed')
  t.notEqual(renamed.indexOf('x.x'), -1, 'x.x was not renamed')
  t.notEqual(renamed.indexOf('x.y'), -1, 'x.y was not renamed')
  t.notEqual(renamed.indexOf(orig2new.StructInline), -1, 'StructInline was renamed')
  t.notEqual(renamed.indexOf(orig2new.inlined), -1, 'inlined was renamed')
  t.notEqual(renamed.indexOf(orig2new.inlined + '.x'), -1, 'inlined\'s .x property was preserved')
  t.notEqual(renamed.indexOf(orig2new.inlined + '.y'), -1, 'inlined\'s .y property was preserved')

  t.notEqual(renamed.indexOf(orig2new.unbound), -1, 'unbound value was renamed')
  t.notEqual(renamed.indexOf(orig2new.StructName + ' x = ' + orig2new.StructName + '(1.0, 0.0);'), -1, 'StructName was renamed in main()')

  // Should not rename x/y in the following case:
  // struct StructName {
  //   float x;
  //   float y;
  // };
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    if (!token.structMember) continue
    if (new2orig[token.data]) return t.fail('struct member token was renamed')
  }
  t.pass('no struct members were renamed')

  t.end()
})
