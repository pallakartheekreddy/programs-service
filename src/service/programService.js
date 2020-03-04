const uuid = require("uuid/v1")
  logger = require('sb_logger_util_v2')
  messageUtils = require('./messageUtil')
  respUtil = require('response_util')
  responseCode = messageUtils.RESPONSE_CODE
  programMessages = messageUtils.PROGRAM
  programDBModel = require('./../utils/cassandraUtil').getConnections('sunbird_programs')


async function getProgram(req, response) {
  let programDetails;
  console.log(req.params)
  programDBModel.instance.program.findOneAsync(req.params, {raw: true})
  .then(function(res) {
    console.log(res);
    return response.status(200).send(successResponse({
      apiId: 'api.program.read',
      ver: '1.0',
      msgid: uuid(),
      responseCode: 'OK',
      result: res
    }))
  })
  .catch(function(err) {
      console.log(err);
  });
}

async function createProgram(req, response) {
  var data = req.body
  var rspObj = req.rspObj
  if (!data.request || !data.request.config || !data.request.rootorg_id || !data.request.type) {
    rspObj.errCode = programMessages.READ.MISSING_CODE
    rspObj.errMsg = programMessages.READ.MISSING_MESSAGE
    rspObj.responseCode = responseCode.CLIENT_ERROR
    logger.error({
      msg: 'Error due to missing request or request config or request rootOrgId or request type',
      err: {
        errCode: rspObj.errCode,
        errMsg: rspObj.errMsg,
        responseCode: rspObj.responseCode
      },
      additionalInfo: { data }
    }, req)
    return response.status(400).send(errorResponse(rspObj))
  }
  const insertObj = req.body.request;
  insertObj.program_id = uuid();
  insertObj.config = insertObj.config ? JSON.stringify(insertObj.config) : "";
  if(req.body.request.enddate){
    insertObj.enddate = req.body.request.enddate
  }
  const model = new programDBModel.instance.program(insertObj);
  await model.saveAsync({if_not_exist: true}).then(resData => {
    return response.status(200).send(successResponse({
        apiId: 'api.program.create',
        ver: '1.0',
        msgid: uuid(),
        responseCode: 'OK',
        result: {
          'program_id': insertObj.program_id
        }
      }));
  }).catch(error => {
    console.log('ERRor ', error);
    return response.status(400).send(errorResponse({
      apiId: 'api.program.create',
      ver: '1.0',
      msgid: uuid(),
      responseCode: 'ERR_CREATE_PROGRAM',
      result: error
    }));
  });
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

function successResponse (data) {
  var response = {}
  response.id = data.apiId
  response.ver = data.apiVersion
  response.ts = new Date()
  response.params = getParams(data.msgid, 'successful', null, null)
  response.responseCode = data.responseCode || 'OK'
  response.result = data.result
  return response
}

/**
 * this function create error response body.
 * @param {Object} data
 * @returns {nm$_responseUtil.errorResponse.response}
 */
function errorResponse (data) {
  var response = {}
  response.id = data.apiId
  response.ver = data.apiVersion
  response.ts = new Date()
  response.params = getParams(data.msgId, 'failed', data.errCode, data.errMsg)
  response.responseCode = data.responseCode
  response.result = data.result
  return response
}

function getParams (msgId, status, errCode, msg) {
  var params = {}
  params.resmsgid = uuid()
  params.msgid = msgId || null
  params.status = status
  params.err = errCode
  params.errmsg = msg

  return params
}

module.exports.getProgramAPI = getProgram
module.exports.createProgramAPI = createProgram
module.exports.updateProgramAPI = updateProgram
module.exports.programListAPI = programList
module.exports.programUpdateParticipantAPI = programUpdateParticipant

