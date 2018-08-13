const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')

let currentSessionCount = 0 // =<4

function walkSync(dirName, files = []) {
  const dirFiles = fs.readdirSync(dirName)
  dirFiles.forEach(function(file) {
    if(fs.statSync(path.join(dirName, file)).isDirectory()) {
      files = walkSync(path.join(dirName, file), files)
    } else {files.push(path.join(dirName, file))}
  })
  return files
}


const execCommand = (cmd) => new Promise((res) => {
  const now = +Date.now(); const longestTest = 450000
  const proc = exec(cmd)
  let fullStack = ''
  const watcher = setInterval(() => {if(+Date.now() - now > longestTest) {clearInterval(watcher); proc.kill(); res(cmd)} }, 15000)

  proc.on('exit', () => {clearInterval(watcher)})
  proc.stdout.on('data', (data) => {fullStack += data.toString()})

  proc.on('close', (code) => {
    if(code !== 0) {
      res(cmd)
    } res(null)
  })
})

const getProtractorCmd = (file) =>
  `${path.resolve(process.cwd(), './node_modules/.bin/protractor')} ./protractor.conf.js --specs ${path.join(process.cwd(), file)}`

const cmdsArr = walkSync('./specs').map(getProtractorCmd)

async function runIt(cmds = cmdsArr) {
  console.log(cmds)
  const failedArr = []

  await new Array(5).join('_').split('_').reduce(function(resolver) {
    return resolver.then(commandsArr => {
      if(!commandsArr) {commandsArr = cmds} return execRun(commandsArr)
    }).then(faild => faild)
  }, Promise.resolve(null))

  async function exeSingleRun(execCommands, failedArrPush) {
    if(4 > currentSessionCount && execCommands.length) {
      currentSessionCount += 1
      const currentCmds = execCommands.splice(0, 1)[0];
      const afterExec = await execCommand(currentCmds).catch(console.error)
      if(afterExec) {failedArrPush.push(afterExec)}
      currentSessionCount -= 1
    }
  }

  async function execRun(runCommands) {
    const interval = setInterval(async () => exeSingleRun(runCommands, failedArr), 500)

    do {
      console.log('x')
      if(runCommands.length) {await exeSingleRun(runCommands, failedArr)}
      console.log('y')
      if(currentSessionCount) {(() => new Promise(res => setTimeout(res, 3500)))}
      console.log('z')
    } while(runCommands.length || currentSessionCount)

    clearInterval(interval)
    // console.log(failedArr)
    return failedArr
  }
}

runIt()