const scoreboard = () =>
  $.get({
    url: 'https://blackfriday.sa-team.teams.kore.appvia.io/scoreboard',
    contentType: 'application/json',
  }).then(response => {
    $("#scoretable tr").not(":eq(0)").remove()
    const table = document.getElementById("scoretable")
    response.map(score => {
      const row = table.insertRow()
      row.insertCell().innerHTML = filterXSS(score.handle)
      row.insertCell().innerHTML = Math.ceil(score.score)
    })
  })


scoreboard()
setInterval(scoreboard, 30_000)