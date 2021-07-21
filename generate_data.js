const units = 60000 // 1 minute in milliseconds
const pullers = [
  { time: 1637798400000, requests: 50, desc: "start thursday 00:00" },
  { time: 1637884800000, requests: 100, desc: "black friday 00:00" },
  { time: 1637931600000, requests: 4000, desc: "black friday 13:00" },
  { time: 1637971200000, requests: 150, desc: "saturday 00:00" },
  { time: 1638144000000, requests: 150, desc: "cyber monday 00:00" },
  { time: 1638190800000, requests: 2500, desc: "cyber monday 13:00" },
  { time: 1638230400000, requests: 1500, desc: "Tuesday 00:00" },
  { time: 1638316799000, requests: 50, desc: "end tuesday 23:59" },
]
const data = []
pullers.forEach((from, i) => {
  if (i + 1 == pullers.length) return
  const next = pullers[i + 1]

  const toCreate = (next.time - from.time) / units
  for (let i = 0; i < toCreate; i++) {
    const foo = (((next.requests - from.requests) / toCreate) * i) + from.requests
    data.push({
      time: (i * units) + from.time,
      requests: Math.ceil(foo)
    })
  }
})

module.exports = data
// console.log(JSON.stringify(data))