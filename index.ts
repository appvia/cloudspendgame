import { cpuUsage } from 'process'

const fs = require('fs')
const _ = require('lodash')
const data = require('./generate_data')

const components = [
  {
    name: 'backend',
    request_to_cpu: 20,
    request_to_memory: 0.5,
    baseline_cpu: 0.2,
    baseline_memory: 128,
    limit_memory: 1024,
    limit_cpu: 2,
    min_replica: 2,
    max_replica: 200,
    scaling_threshold_cpu: 90,
    scaling_intervals: 2
  },
  {
    name: 'frontend',
    request_to_cpu: 1000,
    request_to_memory: 50,
    baseline_cpu: 0.1,
    baseline_memory: 32,
    limit_memory: 128,
    limit_cpu: 0.5,
    min_replica: 2,
    max_replica: 10,
    scaling_threshold_cpu: 50,
    scaling_intervals: 10
  },
  {
    name: 'database',
    request_to_cpu: 200,
    request_to_memory: 0.9,
    baseline_cpu: 0.2,
    baseline_memory: 256,
    limit_memory: 1024,
    limit_cpu: 4,
    min_replica: 3,
    max_replica: 8,
    scaling_threshold_cpu: 98,
    scaling_intervals: 90
  }
]

const scenario = data.map(interval => {
  const intervalComponents = components.map(component => {
    const need_cpu = interval.requests / component.request_to_cpu
    const need_memory = interval.requests / component.request_to_memory
    const need_cpu_replica = Math.ceil(
      need_cpu / (component.limit_cpu - component.baseline_cpu)
    )

    const need_memory_replica = Math.ceil(
      need_memory / (component.limit_memory - component.baseline_memory)
    )

    return {
      ...component,
      need_cpu,
      need_memory,
      need_cpu_replica,
      need_memory_replica,
      need_replica: Math.max(
        need_memory_replica,
        need_cpu_replica,
        component.min_replica
      ),
      actual_replica: component.min_replica
    }
  })
  return {
    ...interval,
    components: intervalComponents
  }
})

const play = scenario.map((interval, iid) => {
  const intervalComponents = interval.components.map((component, cid) => {
    const capacity_cpu = Math.floor(
      component.actual_replica *
        (component.limit_cpu * component.request_to_cpu -
          component.baseline_cpu)
    )

    const capacity_memory = Math.floor(
      component.actual_replica *
        (component.limit_memory * component.request_to_memory -
          component.baseline_memory)
    )

    const capacity = Math.min(capacity_cpu, capacity_memory)
    if (iid + component.scaling_intervals < scenario.length) {
      scenario[iid + component.scaling_intervals].components[
        cid
      ].actual_replica = withinRange(
        component.min_replica,
        component.max_replica,
        (100 / component.scaling_threshold_cpu) * component.need_cpu_replica
      )
    }

    return {
      ...component,
      capacity_cpu,
      capacity_memory,
      capacity,
      unneeded_replica: component.actual_replica - component.need_replica,
      failedRequests: Math.max(0, interval.requests - capacity)
    }
  })
  return {
    ...interval,
    components: intervalComponents,
    failedRequests: Math.max(...intervalComponents.map(c => c.failedRequests))
  }
})

function withinRange (min, max, number) {
  return Math.ceil(Math.max(min, Math.min(max, number)))
}

console.log(play[0], play[1])

// console.log(scenario[0], scenario[1])

fs.writeFileSync('./play.json', JSON.stringify(play))
