import * as fs from 'fs'
import * as AWS from 'aws-sdk'

import {
  Context,
  APIGatewayProxyResultV2,
  APIGatewayProxyEventV2
} from 'aws-lambda'

import { calculate } from 'cloud-spend-forecaster'

const dynamoDb = new AWS.DynamoDB.DocumentClient()
const TableName = process.env.SCORE_TABLE

export const units = 60000 // 1 minute in milliseconds
export const pullers = [
  { time: 1637798400000, requests: 50 }, // desc: 'start thursday 00:00' },
  { time: 1637884800000, requests: 100 }, // desc: 'black friday 00:00' },
  { time: 1637931600000, requests: 40000 }, // desc: 'black friday 13:00' },
  { time: 1637971200000, requests: 150 }, // desc: 'saturday 00:00' },
  { time: 1638144000000, requests: 150 }, // desc: 'cyber monday 00:00' },
  { time: 1638190800000, requests: 25000 }, // desc: 'cyber monday 13:00' },
  { time: 1638230400000, requests: 1500 }, // desc: 'Tuesday 00:00' },
  { time: 1638316799000, requests: 50 } // desc: 'end tuesday 23:59' }
]
export const failedRequestPenalty = 0.01
export const baseLineCost = 20000

export const nodes = {
  't2.medium': {
    maxPods: 17,
    availableCpu: 3820,
    availableMemory: 3358,
    cost: 0.0464 / 60,
    scalingIntervals: 5
  },
  'm5.4xlarge': {
    maxPods: 234,
    availableCpu: 15790,
    availableMemory: 60971,
    cost: 0.768 / 60,
    scalingIntervals: 5
  },
  'm5.8xlarge': {
    maxPods: 234,
    availableCpu: 31750,
    availableMemory: 124971,
    cost: 1.536 / 60,
    scalingIntervals: 5
  },
  'm5.16xlarge': {
    maxPods: 737,
    availableCpu: 47710,
    availableMemory: 247438,
    cost: 3.072 / 60,
    scalingIntervals: 5
  }
}

export async function play (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> {
  const payload = JSON.parse(event.body)

  const node = {
    ...nodes[payload.Nodes['Node Type']],
    minNodes: payload.Nodes.nodeScaling
      ? payload.Nodes['Node minimum count']
      : payload.Nodes['Node maximum count'],
    maxNodes: payload.Nodes['Node maximum count']
  }
  const components = [
    {
      name: 'backend',
      requestToCpu: 15,
      requestToMemory: 4,
      baselineCpu: 250,
      baselineMemory: 512,
      limitMemory: payload.Backend['Memory Limit'],
      limitCpu: payload.Backend['CPU Limit'],
      minReplica: payload.Backend.HPA
        ? payload.Backend['Minimum Replica']
        : payload.Backend['Maximum Replica'],
      maxReplica: payload.Backend['Maximum Replica'],
      scalingThresholdCpu: payload.Backend.HPA
        ? payload.Backend['CPU Scaling Threshold']
        : 99,
      scalingIntervals: 2
    },
    {
      name: 'frontend',
      requestToCpu: 10,
      requestToMemory: 0.5,
      baselineCpu: 50,
      baselineMemory: 32,
      limitMemory: payload.Frontend['Memory Limit'],
      limitCpu: payload.Frontend['CPU Limit'],
      minReplica: payload.Frontend.HPA
        ? payload.Frontend['Minimum Replica']
        : payload.Frontend['Maximum Replica'],
      maxReplica: payload.Frontend['Maximum Replica'],
      scalingThresholdCpu: payload.Frontend.HPA
        ? payload.Frontend['CPU Scaling Threshold']
        : 99,
      scalingIntervals: 2
    },
    {
      name: 'database',
      requestToCpu: 20,
      requestToMemory: 2,
      baselineCpu: 500,
      baselineMemory: 1024,
      limitMemory: payload.Database['Memory Limit'],
      limitCpu: payload.Database['CPU Limit'],
      minReplica: payload.Database.HPA
        ? payload.Database['Minimum Replica']
        : payload.Database['Maximum Replica'],
      maxReplica: payload.Database['Maximum Replica'],
      scalingThresholdCpu: payload.Database.HPA
        ? payload.Database['CPU Scaling Threshold']
        : 99,
      scalingIntervals: 2
    }
  ]
  console.log(components)

  const data = calculate(
    pullers,
    units,
    components,
    node,
    failedRequestPenalty
  ).map(interval => {
    return {
      time: interval.time,
      requests: interval.requests,
      failedRequests: interval.failedRequests,
      cost: interval.cost
    }
  })

  const totalRequests = Math.ceil(
    data.reduce((accumulator, interval) => accumulator + interval.requests, 0)
  )
  const failedRequests = Math.ceil(
    data.reduce(
      (accumulator, interval) => accumulator + interval.failedRequests,
      0
    )
  )
  let spend = data.reduce(
    (accumulator, interval) => accumulator + interval.cost,
    0
  )

  if (payload.Nodes.nodeScaling) spend = spend + 300
  if (payload.Frontend.HPA) spend = spend + 200
  if (payload.Backend.HPA) spend = spend + 200
  if (payload.Database.HPA) spend = spend + 1500

  const penalties = failedRequests * failedRequestPenalty
  const savings = baseLineCost - spend
  const score = savings - penalties

  const output = {
    data,
    totalRequests,
    failedRequests,
    spend,
    penalties,
    savings,
    score
  }

  await dynamoDb
    .put({
      TableName,
      Item: {
        id: event.requestContext.requestId,
        handle: payload.player.Handle || 'anonymous',
        totalRequests,
        failedRequests,
        penalties,
        spend,
        savings,
        score
      }
    })
    .promise()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(output)
  }
}

export async function pageHandler (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> {
  let file, mime
  if (event.rawPath === '/') {
    file = './docs/index.html'
    mime = 'text/html'
  } else if (event.rawPath === '/form.js' || event.rawPath === '/gui.js') {
    file = `./docs${event.rawPath}`
    mime = 'text/javascript'
  } else if (event.rawPath === '/man.svg' || event.rawPath === '/bg.svg') {
    file = `./docs${event.rawPath}`
    mime = 'image/svg+xml'
  } else if (event.rawPath === '/schema.json') {
    file = `./docs${event.rawPath}`
    mime = 'application/json'
  } else if (event.rawPath === '/styles.css') {
    file = './docs/styles.css'
    mime = 'text/css'
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': mime
    },
    body: fs.readFileSync(file).toString()
  }
}
