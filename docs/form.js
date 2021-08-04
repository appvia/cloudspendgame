var editor = new JSONEditor(document.getElementById('editor_holder'), {
  // ajax: true,
  theme: 'bootstrap4',
  disable_edit_json: true,
  disable_collapse: true,
  disable_properties: true,
  ajax: true,
  schema: {
    "$ref": "./schema.json"
  }
})


editor.on('change', function () {
  // Get an array of errors from the validator
  var errors = editor.validate()

  // var indicator = document.getElementById('submit')

  // if (errors.length)
  //   indicator.style.color = 'red'
  // else
  //   indicator.style.color = 'green'

})

$("button").click(() => {
  $("button .spinner-border").css("display", "inline-block")
  $("div[data-schemapath='root.player']").show()
  $.post({
    url: './',
    data: JSON.stringify(editor.getValue()),
    dataType: "json",
    contentType: 'application/json',

  })
    .then(response => {
      $("div.score").show()
      $("button .spinner-border").hide()
      d3GUI(response)
    })
})

