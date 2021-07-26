const fs = require('fs')
const _ = require('lodash')

import { pullers, units } from './scenario'
// import { node } from './play'
import { generate } from './src/generate_request_data'
import * as calc from './src/calculator'

// const  = generate(pullers, units)
const components = require('./components')

const output = generate(pullers, units)
  .map(calc.putComponentsIntoIntervals)
  .map(calc.putNodesIntoIntervals)
  .map(calc.calculateResourceNeededForRequestsInterval)
  .map(calc.calculateReplicasNeededForInterval)
  .map(calc.calculateResourceNeededForInterval)
  .map(calc.calculateDesiredResourceForInterval)
  .map(calc.calculateNodesNeededForInterval)
  .map(calc.calculateNodesDesiredForInterval)
  .map(calc.calculateReadyNodes)
  .map(calc.calculatePendingPods)
  .map(calc.calculateReadyPods)
  .map(calc.calculateReadyRequestCapacity)
  .map(calc.calculateFailedRequests)
  .map(calc.calculateCosts)
  .map(calc.calculatePenalties)
// console.log(output[100], output)

fs.writeFileSync('./output.json', JSON.stringify(output))

console.log(
  `totalCost: ${output.reduce(
    (accumulator, interval) => (accumulator = accumulator + interval.cost),
    0
  )}`,
  `totalFailedRequests: ${output.reduce(
    (accumulator, interval) =>
      (accumulator = accumulator + interval.failedRequests),
    0
  )}`,
  `totalFailedRequestPenalties: ${output.reduce(
    (accumulator, interval) =>
      (accumulator = accumulator + interval.failedRequestPenalty),
    0
  )}`
)
