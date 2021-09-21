import * as fs from 'fs'
import {
  Context,
  APIGatewayProxyResultV2,
  APIGatewayProxyEventV2
} from 'aws-lambda'

export async function pageHandler (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> {
  let file, mime
  if (event.rawPath === '/') {
    file = './docs/index.html'
    mime = 'text/html'
  } else if (event.rawPath === '/scores.html') {
    file = './docs/scores.html'
    mime = 'text/html'
  } else if (
    event.rawPath === '/form.js' ||
    event.rawPath === '/gui.js' ||
    event.rawPath === '/scoreboard.js'
  ) {
    file = `./docs${event.rawPath}`
    mime = 'text/javascript'
  } else if (event.rawPath === '/man.svg' || event.rawPath === '/bg.svg') {
    file = `./docs${event.rawPath}`
    mime = 'image/svg+xml'
  } else if (event.rawPath === '/schema.json') {
    file = `./docs${event.rawPath}`
    mime = 'application/json'
  } else if (event.rawPath === '/styles.scss') {
    file = './docs/styles.scss'
    mime = 'text/scss'
  } else if (event.rawPath === '/privacy.txt') {
    file = './docs/privacy.txt'
    mime = 'text'
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': mime
    },
    body: fs.readFileSync(file).toString()
  }
}
