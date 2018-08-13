 const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')

let currentSessionCount = 0


function walkSync(dirName, files = []) {
  const dirFiles = fs.readdirSync(dirName)

  dirFiles.forEach(function(file) {
    if(fs.statSync(path.join(dirName, file)).isDirectory()) {
      files = walkSync(path.join(dirName, file), files)
    } else {files.push(path.join(dirName, file))}
  })
  return files
}

const getProtractorCmd = (file) =>
  `${path.resolve(process.cwd(), './node_modules/.bin/protractor')} ./protractor.conf.js --specs ${path.join(process.cwd(), file)}`

cmdArr = walkSync('./specs').map(getProtractorCmd)


const execCommand = (cmd) => new Promise((res) => {
  const proc = exec(cmd)

  proc.on('close', (code) => {

    if(code !== 0) {
      res(cmd)
    } res(null)
  })
})

async function exeSingleRun(execCommands, failedArrPush) {
  if(4 > currentSessionCount && execCommands.length) {
    currentSessionCount += 1
    const currentCmds = execCommands.splice(0, 1)[0];
    const afterExec = await execCommand(currentCmds).catch(console.error)
    if(afterExec) {failedArrPush.push(afterExec)}
    currentSessionCount -= 1
  }
}


async function doIT() {
  const failedArr = []

  async function exeSingleRun(execCommands, failedArrPush) {
    if(4 > currentSessionCount && execCommands.length) {
      currentSessionCount += 1
      const currentCmds = execCommands.splice(0, 1)[0];
      const afterExec = await execCommand(currentCmds).catch(console.error)
      if(afterExec) {failedArrPush.push(afterExec)}
      currentSessionCount -= 1
    }
  }

  const interval = setInterval(() => exeSingleRun(cmdArr, failedArr), 1500)

  do {
    console.log('in here 1')
    await exeSingleRun(cmdArr , failedArr)
    if(currentSessionCount) await (() => new Promise((res) => setTimeout(res, 2500)))
    console.log('in here 2')

  } while(cmdArr.length || currentSessionCount)

  console.log('out here')

  clearInterval(interval)
  return failedArr
}



doIT().then(console.log)



