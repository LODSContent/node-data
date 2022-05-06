const fs = require('fs')
const check = require('syntax-error')
if (process.argv.length < 3) {
  console.log('You need to specify the file.')
  process.exit()
}

// eslint-disable-next-line node/no-path-concat
const file = `${__dirname}/${process.argv[2]}`
const src = fs.readFileSync(file)

const err = check(src, file)
console.log(err ? 'false' : 'true')
