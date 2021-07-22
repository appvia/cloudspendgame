module.exports = [
  {
    name: 'backend',
    request_to_cpu: 15,
    request_to_memory: 4,
    baseline_cpu: 250,
    baseline_memory: 512,
    limit_memory: 1024,
    limit_cpu: 750,
    min_replica: 2,
    max_replica: 200,
    scaling_threshold_cpu: 90,
    scaling_intervals: 2
  },
  {
    name: 'frontend',
    request_to_cpu: 10,
    request_to_memory: 0.5,
    baseline_cpu: 50,
    baseline_memory: 32,
    limit_memory: 256,
    limit_cpu: 400,
    min_replica: 2,
    max_replica: 100,
    scaling_threshold_cpu: 50,
    scaling_intervals: 2
  },
  {
    name: 'database',
    request_to_cpu: 20,
    request_to_memory: 3,
    baseline_cpu: 1500,
    baseline_memory: 1024,
    limit_memory: 2048,
    limit_cpu: 5500,
    min_replica: 3,
    max_replica: 60,
    scaling_threshold_cpu: 98,
    scaling_intervals: 90
  }
]
