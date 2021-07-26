export const units = 60000 // 1 minute in milliseconds
export const pullers = [
  { time: 1637798400000, requests: 50, desc: 'start thursday 00:00' },
  { time: 1637884800000, requests: 100, desc: 'black friday 00:00' },
  { time: 1637931600000, requests: 40000, desc: 'black friday 13:00' },
  { time: 1637971200000, requests: 150, desc: 'saturday 00:00' },
  { time: 1638144000000, requests: 150, desc: 'cyber monday 00:00' },
  { time: 1638190800000, requests: 25000, desc: 'cyber monday 13:00' },
  { time: 1638230400000, requests: 1500, desc: 'Tuesday 00:00' },
  { time: 1638316799000, requests: 50, desc: 'end tuesday 23:59' }
]
export const failedRequestPenalty = 0.01
