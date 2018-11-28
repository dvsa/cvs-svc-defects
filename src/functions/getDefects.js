'use strict'

const Defects = require('../models/Defects')
const DefectsService = require('../services/DefectsService')

const getDefects = () => {
  const defects = new Defects()
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
