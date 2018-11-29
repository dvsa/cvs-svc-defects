'use strict'

const DefectsDto = require('../models/DefectsDto')
const DefectsService = require('../services/DefectsService')

const getDefects = () => {
  const defects = new DefectsDto()
  const defectsService = new DefectsService(defects)

  return defectsService.getDefectList()
    .then((data) => {
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      }
    })
    .catch((error) => {
      return {
        statusCode: error.statusCode,
        headers: error.headers,
        body: JSON.stringify(error.body)
      }
    })
}

module.exports = getDefects
