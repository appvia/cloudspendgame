import * as AWS from 'aws-sdk'

import {
  Context,
  APIGatewayProxyResultV2,
  APIGatewayProxyEventV2
} from 'aws-lambda'
import * as schema from './docs/schema.json'

import { calculate } from 'cloud-spend-forecaster'

import validate from 'jsonschema'

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
export const baseLineCost = 19907

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

  const res = validate.validate(payload, schema)
  if (!res.valid) throw new Error('INVALID PAYLOAD')

  const node = {
    ...nodes[payload.Nodes['Node Type']],
    minNodes: payload.Nodes['Node minimum count'],
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
      minReplica: payload.Backend['Minimum Replica'],
      maxReplica: payload.Backend['Maximum Replica'],
      scalingThresholdCpu: payload.Backend['CPU Scaling Threshold'],
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
      minReplica: payload.Frontend['Minimum Replica'],
      maxReplica: payload.Frontend['Maximum Replica'],
      scalingThresholdCpu: payload.Frontend['CPU Scaling Threshold'],
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
      minReplica: payload.Database['Minimum Replica'],
      maxReplica: payload.Database['Maximum Replica'],
      scalingThresholdCpu: payload.Database['CPU Scaling Threshold'],
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

  const penalties = failedRequests * failedRequestPenalty
  const savings = baseLineCost - spend
  const score = savings - penalties

  const output = {
    id: event.requestContext.requestId,
    data: data
      .filter((interval, i) => i % 60 === 0 || interval.failedRequests > 1) // reduce how much data we send the browser
      .map(interval => {
        return {
          time: interval.time,
          requests: interval.requests,
          failedRequests: interval.failedRequests
        }
      }),
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
        realname: payload.player['Real Name'] || 'anonymous',
        email: payload.player['Email Address'] || 'anonymous',
        companyname: payload.player.Company || 'anonymous',
        totalRequests,
        failedRequests,
        penalties,
        spend,
        savings,
        score,
        configuration: payload
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
