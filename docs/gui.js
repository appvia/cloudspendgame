// set the dimensions and margins of the graph
const margin = { top: 15, left: 60 }

const loadTime = 3 * 1000
// d3.json('./output.json').then(d3GUI)

const d3GUI = data => {

  countup("#totalrequests", data.totalRequests)
  countup("#failedrequests", data.failedRequests)
  countup("#spend", data.spend)
  countup("#savings", data.savings)
  countup("#penalties", data.penalties)
  countup("#totalscore", data.score)

  function countup(selector, value) {
    $(selector).prop('Counter', 0).animate({
      Counter: value
    }, {
      duration: loadTime,
      easing: 'swing',
      step: function (now) {
        $(selector).text(this.Counter.toFixed(0))
      }
    })
  }

  const graphs = [
    {
      id: "total_requests_vs_failed",
      keys: ["requests", "failedRequests"],
    }
  ]

  graphs.forEach(graph => {
    const height = 385
    const div = document.createElement("div")
    div.id = graph.id
    document.getElementById("my_dataviz").appendChild(div)

    d3
      .select(`#${graph.id} svg`)
      .remove()

    const svg = d3
      .select(`#${graph.id}`)
      .append('svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 960 500")
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const color = d3.scaleOrdinal()
      .domain(graph.keys)
      .range(d3.schemeSet2)

    const x = d3
      .scaleTime()
      .domain(d3.extent(data.data, d => d.time))
      .range([0, 900])

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,10)rotate(-45)")

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.data, d => d.requests)])
      .range([height, 0])

    svg.append('g').call(d3.axisLeft(y))

    graph.keys.forEach(key => {
      svg
        .append('path')
        .datum(data.data)
        .attr("fill", "none")
        .attr("stroke", (d) => color(key))
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .line()
            .x(d => x(d.time))
            .y(d => y(d[key]))
        )
        .transition()
        .duration(loadTime)
        .attrTween("stroke-dasharray", tweenDash)

      function tweenDash() {
        var l = this.getTotalLength(),
          i = d3.interpolateString("0," + l, l + "," + l)
        return t => i(t)
      }
    })

    var legendSizeSquare = 30
    svg.selectAll("mydots")
      .data(graph.keys)
      .enter()
      .append("rect")
      .attr("x", 100)
      .attr("y", function (d, i) { return 100 + i * (legendSizeSquare + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", legendSizeSquare)
      .attr("height", legendSizeSquare)
      .style("fill", function (d) { return color(d) })

    svg.selectAll("mylabels")
      .data(graph.keys)
      .style("fill", function (d) { return "white" })
      .enter()
      .append("text")
      .attr("x", 100 + legendSizeSquare * 1.2)
      .attr("y", function (d, i) { return 100 + i * (legendSizeSquare + 5) + (legendSizeSquare / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d) { return color(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  })
}