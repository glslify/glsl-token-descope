const tokenize    = require('glsl-tokenizer/string')
const stringify   = require('glsl-token-string')
const chalk       = require('chalk')
const test        = require('tape')
const path        = require('path')
const rename      = require('../')
const fs          = require('fs')

const src     = path.join(__dirname, '..', 'fixture.glsl')
const fixture = fs.readFileSync(src, 'utf8')
const tokens  = tokenize(fixture)

rename(tokens)

// Pretty-prints the renamed source, highlighting
// renamed variables in green.
console.error()
for (var i = 0; i < tokens.length; i++) {
  if (tokens[i].type === 'eof') continue
  if (tokens[i].descoped) {
    process.stdout.write(chalk.green(tokens[i].data))
  } else {
    process.stdout.write(tokens[i].data)
  }
}
console.error()
