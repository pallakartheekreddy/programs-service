const programService = require('../service/programService');

const BASE_URL = 'program/v1/'

modules.export = function (app) {
  app.route(BASE_URL + '/read/:programId')
    .get(programService.getProgramAPI)

  app.route(BASE_URL + '/create')
    .post(programService.createProgramAPI)

  app.route(BASE_URL + '/update')
    .post(programService.updateProgramAPI)

  app.route(BASE_URL + '/list')
    .post(programService.programListAPI)

  app.route(BASE_URL + '/update/participant')
    .post(programService.programUpdateParticipantAPI)
}
