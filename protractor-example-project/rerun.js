const path = require('path')
const fs = require('fs')

const walkSync = function(dir, filelist = []) {
  const files = fs.readdirSync(dir)

  files.forEach(function(file) {
    if(fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist)
    }
    else {filelist.push(path.join(dir, file))}
  })
  return filelist
}

const specsDir = path.resolve(__dirname, './specs')

console.log(walkSync(specsDir))

const getRunCommand = (file) => `
  ${path.resolve(__dirname, './node_modules/.bin/protractor')}
  ${path.resolve(__dirname, './protractor.conf.js')}
  --specs ${file}
`

