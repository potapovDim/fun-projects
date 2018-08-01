const path = require('path')
const fs = require('fs')
const {exec} = require('child_process')

const maxSession = 10

let currentSessionCount = 0

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

const getRunCommand = (file) => `
  ${path.resolve(__dirname, './node_modules/.bin/protractor')}
  ${path.resolve(__dirname, './protractor.conf.js')}
  --specs ${file}
`

const runPromise = (cmd) => new Promise((res) => {
  const now = +Date.now(); const longestTest = 450000

  const proc = exec(cmd)
  let fullStack = ''

  const watcher = setInterval(() => {if(+Date.now() - now > longestTest) {clearInterval(watcher); proc.kill(); res(cmd)} }, 15000)

  proc.on('exit', () => {clearInterval(watcher)})

  proc.stdout.on('data', (data) => {fullStack += data.toString()})

  proc.on('close', (code) => {if(code !== 0 && !fullStack.includes('ASSERTION ERROR')) {res(cmd)} res(null)})
})


async function exeRun(runArr, failArr = []) {
  runArr = runArr || walkSync(specsDir).map(getRunCommand)

  async function performRun(runSuits, failedRun) {
    do {
      const runMap = runSuits.splice(0, maxSession - currentSessionCount).map(run => runPromise(run))
      await Promise.all(runMap).then((cmds) => {failedRun.push(...cmds.filter(cm => !!cm))}).catch(e => console.error(e.toString()))
    } while(runSuits.length)
    return failedRun
  }

  const failedTests = await performRun(runs, [])
    .then((failed) => performRun(failed, []))
    .then((failed) => performRun(failed, []))
    .then(failed => failed)

  console.log(failedTests.length, 'Failed test count')
  return failedTests
}