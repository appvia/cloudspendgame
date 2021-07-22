import { cpuUsage } from 'process'

const fs = require('fs')
const _ = require('lodash')
const data = require('./generate_data')
const nodes = require('./nodes')

const components = require('./components')

const node_pool = nodes['t2.medium']

const scenario = data.map(interval => {
  const intervalComponents = components.map(component => {
    const need_cpu = interval.requests * component.request_to_cpu
    const need_memory = interval.requests * component.request_to_memory
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
    components: intervalComponents,
    node_count: node_pool.minimum_nodes,
    node_ready: node_pool.minimum_nodes
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
      failedRequests: Math.max(0, interval.requests - capacity)
    }
  })
  return {
    ...interval,
    components: intervalComponents,
    failedRequests: Math.max(...intervalComponents.map(c => c.failedRequests))
  }
})

const node_scale = play.map((interval, iid) => {
  const desired_pods = interval.components.reduce((accumulator, component) => {
    return accumulator + component.actual_replica
  }, 0)

  const desired_cpu = interval.components.reduce((accumulator, component) => {
    return accumulator + component.capacity_cpu
  }, 0)
  const desired_memory = interval.components.reduce(
    (accumulator, component) => {
      return accumulator + component.capacity_memory
    },
    0
  )

  const needed_nodes_by_cpu = Math.ceil(desired_cpu / node_pool.available_cpu)
  const needed_nodes_by_memory = Math.ceil(
    desired_cpu / node_pool.available_memory
  )

  const needed_nodes_by_pods = Math.ceil(desired_pods / node_pool.max_pods)

  const needed_nodes = Math.max(
    needed_nodes_by_cpu,
    needed_nodes_by_memory,
    needed_nodes_by_pods
  )

  const node_count = withinRange(
    node_pool.minimum_nodes,
    node_pool.maximum_nodes,
    needed_nodes
  )
  if (iid + node_pool.scaling_intervals < play.length) {
    play[iid + node_pool.scaling_intervals].node_ready = node_count
  }
  return {
    ...interval,
    desired_pods,
    needed_nodes,
    needed_nodes_by_pods,
    needed_nodes_by_cpu,
    needed_nodes_by_memory,
    node_count
  }
})

const costed = node_scale.map(interval => {
  return { ...interval, cost: interval.node_count * node_pool.cost }
})

function withinRange (min, max, number) {
  return Math.ceil(Math.max(min, Math.min(max, number)))
}

// console.log(costed[0], costed[1])

costed.map(i => {
  console.log(i)
  return i
})
fs.writeFileSync('./play.json', JSON.stringify(costed))
