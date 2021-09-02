$.get({
  url: 'https://sn2lorj5j9.execute-api.eu-west-2.amazonaws.com/scoreboard',
  contentType: 'application/json',
}).then(response => {
  const table = document.getElementById("scoretable")
  response.map(score => {
    const row = table.insertRow()
    row.insertCell().innerHTML = filterXSS(score.handle)
    row.insertCell().innerHTML = Math.ceil(score.score)
  })
})