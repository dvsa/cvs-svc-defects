'use strict'

const getDefectList = require('../services/defectsService')

const getDefects = async () => {
  return getDefectList()
    .then((result) => {
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    })
    .catch((e) => {
      return {
        statusCode: e.statusCode,
        headers: e.headers,
        body: JSON.stringify(e.body)
      }
    })
}

module.exports = getDefects
