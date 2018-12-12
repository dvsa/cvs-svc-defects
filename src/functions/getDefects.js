'use strict'

const DefectsDAO = require('../models/DefectsDAO')
const DefectsService = require('../services/DefectsService')
const HTTPResponse = require('../models/HTTPResponse')

const getDefects = () => {
  const defectsDAO = new DefectsDAO()
  const defectsService = new DefectsService(defectsDAO)

  return defectsService.getDefectList()
    .then((data) => {
      return new HTTPResponse(200, data)
    })
    .catch((error) => {
      return new HTTPResponse(error.statusCode, error.body)
    })
}

module.exports = getDefects
