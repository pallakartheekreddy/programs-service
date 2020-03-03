const uuid = require("uuid/v1");



function getProgram(req, response) {
  console.log(req)
}

function createProgram(req, response) {
  console.log(req.body)
  response.sendStatus(200)
}

function updateProgram(req, response) {
  console.log(req)
}

function programList(req, response) {
  console.log(req)
}

function programUpdateParticipant(req, response) {
  console.log(req)
}

module.exports.getProgramAPI = getProgram
module.exports.createProgramAPI = createProgram
module.exports.updateProgramAPI = updateProgram
module.exports.programListAPI = programList
module.exports.programUpdateParticipantAPI = programUpdateParticipant

