module.exports = glslTokenDescope

function glslTokenDescope(tokens, rename) {
  require('glsl-token-depth')(tokens)
  require('glsl-token-scope')(tokens)
  require('glsl-token-properties')(tokens)
  require('glsl-token-assignments')(tokens)

  var scope   = getScope(tokens)
  var renamer = rename || defaultRenamer()
  var map     = {}

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]
    var stack = token.stack
    var name  = token.data

    token.descoped = false

    if (token.type !== 'ident') continue
    if (token.property) continue
    if (token.structMember) continue

    for (var j = stack.length - 1; j >= 0; j--) {
      var s = scope[stack[j]]
      if (!s) continue
      if (!s[name]) continue

      // exit if declaration not in top-level scope
      if (j) break

      token.descoped = token.data
      token.data = map[name] = map[name] || renamer(name) || token.data
    }
  }

  return tokens
}

function defaultRenamer() {
  var k = 0

  return function rename(name) {
    return name + '_' + (k++).toString(36)
  }
}

function getScope(tokens) {
  var scope = {}

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]
    if (token.declaration) {
      scope[token.scope] = scope[token.scope] || {}
      scope[token.scope][token.data] = token
    }
  }

  return scope
}
