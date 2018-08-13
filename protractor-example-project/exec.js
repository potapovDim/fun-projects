const {exec} = require('child_process')

const pro = exec('node ./log.js')

pro.stdout.on('data', (data) => {
  console.log(data)
})

pro.on('close', (code) => {
  console.log('close', code)
})

pro.on('exit', (code) => {
  console.log('exit', code)
})