'use strict'

const DefectsDAO = require('../models/DefectsDAO')
const DefectsService = require('../services/DefectsService')

const getDefects = () => {
  const defectsDAO = new DefectsDAO()
  const defectsService = new DefectsService(defectsDAO)

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
