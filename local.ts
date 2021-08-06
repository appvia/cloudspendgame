// @ts-nocheck
import * as app from './'

// console.log(app.play({}, {}))
// const mod = require('./')

// mod.pageHandler({}, {}, console.log)
const http = require('http')

const host = 'localhost'
const port = 8000

const requestListener = async (req, res) => {
  // console.log(req)
  res.writeHead(200)
  if (req.method === 'GET') {
    const lambdaEvent = {
      rawPath: req.url
    }
    const response = await app.pageHandler(lambdaEvent)
    console.log(lambdaEvent)
    res.end(response.body)
    // return
  } else if (req.method === 'POST') {
    // game api
  }
  // res.end('My first server!')
}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
