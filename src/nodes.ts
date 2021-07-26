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
