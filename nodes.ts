module.exports = {
  't2.medium': {
    max_pods: 17,
    available_cpu: 3820,
    available_memory: 3358,
    minimum_nodes: 10,
    maximum_nodes: 1000,
    cost: 0.000773333333333,
    scaling_intervals: 5
  },
  'm5.4xlarge': {
    max_pods: 234,
    available_cpu: 15790,
    available_memory: 60971,
    minimum_nodes: 10,
    maximum_nodes: 1000,
    cost: 0.768 / 60,
    scaling_intervals: 5
  },
  'm5.8xlarge': {
    max_pods: 234,
    available_cpu: 31750,
    available_memory: 124971,
    minimum_nodes: 10,
    maximum_nodes: 1000,
    cost: 1.536 / 60,
    scaling_intervals: 5
  },
  'm5.16xlarge': {
    max_pods: 737,
    available_cpu: 47710,
    available_memory: 247438,
    minimum_nodes: 10,
    maximum_nodes: 1000,
    cost: 3.072 / 60,
    scaling_intervals: 5
  }
}
