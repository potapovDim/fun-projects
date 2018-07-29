const fetch = require('node-fetch')

const fetcher = async (url, method = 'GET', data) => {
  const opts = {
    headers: {
      'Content-Type': 'application/json'
    },
    method,
    body: JSON.stringify(data)
  }
  const resp = await fetch(url, method === 'GET' ? (Reflect.deleteProperty(opts, 'body') && opts) : opts)
  if(resp.headers.get('content-type') === 'text/plain') {
    return resp.text()
  }
  return resp.json()
}

module.exports = {
  fetcher
}