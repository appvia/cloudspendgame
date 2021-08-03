var editor = new JSONEditor(document.getElementById('editor_holder'), {
  // ajax: true,
  theme: 'bootstrap4',
  disable_edit_json: true,
  disable_collapse: true,
  disable_properties: true,
  schema: {
    type: "object",
    properties: {
      "player": {
        title: "Claim your highscore position",
        type: "object",
        required: [
          "Name",
          "Company",
          "Email Address",
        ],
        properties: {
          Name: {
            type: "string",
            options: {
              inputAttributes: {
                placeholder: "Some Anonymous Coward"
              }
            }
          },
          Company: {
            type: "string",
            options: {
              inputAttributes: {
                placeholder: "Acme inc"
              }
            }
          },
          "Email Address": {
            type: "string",
            options: {
              inputAttributes: {
                placeholder: "user@acme.inc"
              }
            }
          },
        }
      },
      "Nodes": {
        type: "object",
        properties: {
          "Node Type": {
            enum: [
              "t2.medium",
              "m5.4xlarge",
              "m5.8xlarge",
              "m5.16xlarge"
            ],
            type: "string"
          },
          "Node minimum count": {
            type: "integer",
            maximum: 1000,
            minimum: 1,
            default: 70,
            options: {
              format: "number"
            }
          },
          nodeScaling: {
            type: "checkbox",
            title: "Node auto scaling (+$300)"
          },
          "Node maximum count": {
            type: "integer",
            maximum: 1000,
            minimum: 1,
            default: 1000,
            options: {
              format: "number",
              dependencies: {
                "nodeScaling": true,
              }
            }
          },
        },
      },
      "Frontend": {
        type: "object",
        properties: {
          "Minimum Replica": {
            type: "integer",
            minimum: 1,
            default: 200,
            options: {
              format: "number"
            }
          },
          "CPU Limit": {
            title: "CPU Limit (millicores)",
            type: "integer",
            minimum: 50,
            default: 800, options: {
              format: "number"
            }
          },
          "Memory Limit": {
            title: "Memory Limit (mb)",
            type: "integer",
            minimum: 32,
            default: 256, options: {
              format: "number"
            }
          },
          HPA: {
            type: "checkbox",
            title: "Frontend autoscaling (Horizontal Pod Autoscaler) (+$200)",
          },
          "Maximum Replica": {
            type: "integer",
            minimum: 1,
            default: 2000,
            options: {
              format: "number",
              dependencies: {
                "HPA": true,
              }
            }
          },
          "CPU Scaling Threshold": {
            type: "integer",
            maximum: 100,
            minimum: 1,
            default: 70,
            options: {
              format: "range",
              dependencies: {
                "HPA": true,
              }
            }
          },
        }
      },

      "Backend": {
        type: "object",
        properties: {
          "Minimum Replica": {
            type: "integer",
            minimum: 1,
            default: 200,
            options: {
              format: "number"
            }
          },
          "CPU Limit": {
            title: "CPU Limit (millicores)",
            type: "integer",
            minimum: 250,
            default: 850,
            options: {
              format: "number"
            }
          },
          "Memory Limit": {
            title: "Memory Limit (mb)",
            type: "integer",
            minimum: 512,
            default: 1024,
            options: {
              format: "number"
            }
          },
          HPA: {
            type: "checkbox",
            title: "Backend autoscaling (Horizontal Pod Autoscaler) (+$200)",
          },
          "Maximum Replica": {
            type: "integer",
            minimum: 1,
            default: 800,
            options: {
              format: "number",
              dependencies: {
                "HPA": true,
              }
            }
          },
          "CPU Scaling Threshold": {
            type: "integer",
            maximum: 100,
            minimum: 1,
            default: 70,
            options: {
              format: "range",
              dependencies: {
                "HPA": true,
              }
            }
          },
        }
      },
      "Database": {
        type: "object",
        properties: {
          "Minimum Replica": {
            type: "integer",
            minimum: 1,
            default: 10,
            options: {
              format: "number"
            }
          },
          "CPU Limit": {
            title: "CPU Limit (millicores)",
            type: "integer",
            minimum: 800,
            default: 15000,
            options: {
              format: "number"
            }
          },
          "Memory Limit": {
            title: "Memory Limit (mb)",
            type: "integer",
            minimum: 1024,
            default: 4096,
            options: {
              format: "number"
            }
          },
          HPA: {
            type: "checkbox",
            title: "Database autoscaling (Horizontal Pod Autoscaler) (+$1500)",
          },
          "Maximum Replica": {
            type: "integer",
            minimum: 1,
            default: 70,
            options: {
              format: "number",
              dependencies: {
                "HPA": true,
              }
            }
          },
          "CPU Scaling Threshold": {
            type: "integer",
            maximum: 100,
            minimum: 1,
            default: 50,
            options: {
              format: "range",
              dependencies: {
                "HPA": true,
              }
            }
          },
        }
      },
    }
  }
})


// Hook up the submit button to log to the console
document.getElementById('submit').addEventListener('click', function () {
  // Get the value from the editor
  console.log(editor.getValue())
})

editor.on('change', function () {
  // Get an array of errors from the validator
  var errors = editor.validate()

  var indicator = document.getElementById('submit')

  if (errors.length)
    indicator.style.color = 'red'
  else
    indicator.style.color = 'green'

})

// $("button").click(() => {
//   $("#result").toggle()
//   $(".container").toggle()

// })