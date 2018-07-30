const {fetcher} = require('./req-interface')

const DRIVER_PORT = 9515
const baseUrl = 'http://localhost:' + DRIVER_PORT

const getSession = async () => {
  const caps = {
    desiredCapabilities: {
      browserName: 'chrome'
    }
  }
  const {sessionId} = await fetcher(`${baseUrl}/session`, 'POST', caps)
  return sessionId
}

const goTo = async () => {
  const session = await getSession()
  // const resp = await fetcher(`${baseUrl}/session/${session}/url`, 'POST', {url: 'https://google.com'}) //https://www.google.com/
  const resp = await fetcher(`${baseUrl}/session/${session}/url`, 'POST', {url: 'https://facebook.com'})
  console.log(resp)
}

goTo()

