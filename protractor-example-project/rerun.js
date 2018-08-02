const path = require('path')
const fs = require('fs')
const {exec} = require('child_process')

const sleep = (time) => new Promise(res => setTimeout(res, time))

const maxSession = 10
let currentSessionCount = 0

const rerunCount = process.env.RERUN_COUNT && Number(process.env.RERUN_COUNT) || 2
const rerunArr = new Array(rerunCount).join('_').split('_')


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

  let currentSubRun = 0
  async function performRun(runSuits, failedRun) {
    let asserter = null
    function tryRerun(runsArr, pushArr) {

      const upperRun = async () => {

        const runArr = runsArr.splice(0, maxSession - currentSessionCount).map(run => runPromise(run))

        currentSubRun += runArr.length
        currentSessionCount += currentSubRun
        await Promise.all(runArr).then((cmd) => {
          pushArr.push(...cmd.filter(cm => !!cm))
          currentSubRun -= runArr.length
          currentSessionCount -= currentSubRun
        }).catch(console.error)
      }

      upperRun()
      asserter = setInterval(upperRun, 10000)
    }

    do {
      const runMap = runSuits.splice(0, maxSession - currentSessionCount).map(run => runPromise(run))

      currentSessionCount += runMap.length

      await Promise.all(runMap).then((cmds) => {
        failedRun.push(...cmds.filter(cm => !!cm))
        currentSessionCount -= runMap.length
      }).catch(e => console.error(e.toString()))

      if(runSuits.length) {await sleep(3000)}

    } while(runSuits.length || currentSubRun)
    clearInterval(asserter)
    return failedRun
  }

  const failedTests = await arr.reduce((resolver) => {
    return resolver.then(resolvedArr => performRun(resolvedArr, []).then(failedArr => failedArr))
  }, Promise.resolve(runArr))

  console.log(failedTests.length, 'Failed test count')
  return failedTests
}