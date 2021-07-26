export const components = [
  {
    name: 'backend',
    requestToCpu: 15,
    requestToMemory: 4,
    baselineCpu: 250,
    baselineMemory: 512,
    limitMemory: 1024,
    limitCpu: 850,
    minReplica: 2,
    maxReplica: 1000,
    scalingThresholdCpu: 70,
    scalingIntervals: 2
  },
  {
    name: 'frontend',
    requestToCpu: 10,
    requestToMemory: 0.5,
    baselineCpu: 50,
    baselineMemory: 32,
    limitMemory: 256,
    limitCpu: 800,
    minReplica: 2,
    maxReplica: 2000,
    scalingThresholdCpu: 70,
    scalingIntervals: 2
  },
  {
    name: 'database',
    requestToCpu: 20,
    requestToMemory: 2,
    baselineCpu: 500,
    baselineMemory: 1024,
    limitMemory: 4096,
    limitCpu: 15000,
    minReplica: 3,
    maxReplica: 60,
    scalingThresholdCpu: 50,
    scalingIntervals: 90
  }
]
