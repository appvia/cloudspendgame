var editor = new JSONEditor(document.getElementById('editor_holder'), {
  // ajax: true,
  theme: 'bootstrap4',
  disable_edit_json: true,
  disable_collapse: true,
  disable_properties: true,
  schema: {
    type: "object",
    properties: {
      "Who are you": {
        type: "object",
        required: [
          "Name",
          "Company",
          "Email Address",
          "Github Username",
        ],
        properties: {
          Name: {
            type: "string",
            default: "John Doe"
          },
          Company: {
            type: "string",
            default: "Acme inc"
          },
          "Email Address": {
            type: "string",
            default: "user@acme.inc"
          },
          "Github Username": {
            type: "string",
            default: "johndoeacme"
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
            default: 70
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
            default: 200
          },
          "CPU Limit": {
            title: "CPU Limit (millicores)",
            type: "integer",
            minimum: 50,
            default: 800
          },
          "Memory Limit": {
            title: "Memory Limit (mb)",
            type: "integer",
            minimum: 32,
            default: 256
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
            default: 200
          },
          "CPU Limit": {
            title: "CPU Limit (millicores)",
            type: "integer",
            minimum: 250,
            default: 850
          },
          "Memory Limit": {
            title: "Memory Limit (mb)",
            type: "integer",
            minimum: 512,
            default: 1024
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
            default: 10
          },
          "CPU Limit": {
            title: "CPU Limit (millicores)",
            type: "integer",
            minimum: 800,
            default: 15000
          },
          "Memory Limit": {
            title: "Memory Limit (mb)",
            type: "integer",
            minimum: 1024,
            default: 4096
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